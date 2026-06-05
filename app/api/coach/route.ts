import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import { formatBoardContext } from '@/lib/formatBoardContext';
import { z } from 'zod';

const RequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })),
  boardContext: z.any() // Should match BoardContext type
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (20 requests per hour)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limitKey = `rate_limit_coach_${ip}`;
    
    // We only enforce rate limits if KV is properly configured (has env vars)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const currentUsage = await kv.get<number>(limitKey) || 0;
      if (currentUsage >= 20) {
        return new Response(
          "You've chatted a lot today — I'll be back tomorrow.", 
          { status: 429 }
        );
      }
      await kv.set(limitKey, currentUsage + 1, { ex: 3600 }); // 1 hour expiration
    }

    // 2. Parse Request
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response("Invalid request", { status: 400 });
    }

    const { messages, boardContext } = parsed.data;

    // 3. Inject Board Context into System Prompt
    const rawSystemPrompt = process.env.COACH_SYSTEM_PROMPT || "You are Aria, an AI accountability coach.";
    const boardContextString = formatBoardContext(boardContext);
    const systemPrompt = rawSystemPrompt.replace('{{BOARD_CONTEXT}}', boardContextString);

    // 4. Call AI Provider
    const stream = await anthropic.messages.create({
      model: process.env.COACH_MODEL || 'claude-3-5-sonnet-20240620',
      max_tokens: parseInt(process.env.COACH_MAX_TOKENS || '1024', 10),
      system: systemPrompt,
      messages: messages,
      stream: true,
    });

    // 5. Stream back to client
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const data = JSON.stringify({ delta: chunk.delta.text });
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Coach API Error:', error);
    return new Response(
      "Something went wrong on my end. Try again in a moment.", 
      { status: 500 }
    );
  }
}
