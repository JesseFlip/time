import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
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

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (20 requests per hour)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limitKey = `rate_limit_coach_${ip}`;
    
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const currentUsage = await kv.get<number>(limitKey) || 0;
      if (currentUsage >= 20) {
        return new Response("You've chatted a lot today — I'll be back tomorrow.", { status: 429 });
      }
      await kv.set(limitKey, currentUsage + 1, { ex: 3600 });
    }

    // 2. Extract Provider and Key
    const provider = req.headers.get('x-ai-provider') || 'anthropic';
    const apiKey = req.headers.get('x-ai-api-key');

    if (!apiKey) {
      return new Response("Unauthorized: Missing API Key", { status: 401 });
    }

    // 3. Parse Request
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response("Invalid request", { status: 400 });
    }

    const { messages, boardContext } = parsed.data;

    // 4. Inject Board Context into System Prompt
    const rawSystemPrompt = process.env.COACH_SYSTEM_PROMPT || "You are Aria, an AI accountability coach.";
    const boardContextString = formatBoardContext(boardContext);
    const systemPrompt = rawSystemPrompt.replace('{{BOARD_CONTEXT}}', boardContextString);

    // 5. Stream back to client
    const readableStream = new ReadableStream({
      async start(controller) {
        const enqueueText = (text: string) => {
          const data = JSON.stringify({ delta: text });
          controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
        };

        try {
          if (provider === 'anthropic') {
            const anthropic = new Anthropic({ apiKey });
            const stream = await anthropic.messages.create({
              model: 'claude-3-5-sonnet-20240620',
              max_tokens: 1024,
              system: systemPrompt,
              messages: messages,
              stream: true,
            });

            for await (const chunk of stream) {
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                enqueueText(chunk.delta.text);
              }
            }

          } else if (provider === 'openai') {
            const openai = new OpenAI({ apiKey });
            const stream = await openai.chat.completions.create({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({
                  role: m.role,
                  content: m.content
                }))
              ],
              stream: true,
            });

            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || '';
              if (text) enqueueText(text);
            }

          } else if (provider === 'google') {
            const ai = new GoogleGenAI({ apiKey });
            
            // Format messages for Google GenAI
            // The API expects 'user' or 'model' roles
            const contents = messages.map((m: { role: string; content: string }) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            }));

            const responseStream = await ai.models.generateContentStream({
              model: 'gemini-2.5-pro',
              contents,
              config: {
                systemInstruction: systemPrompt,
              }
            });

            for await (const chunk of responseStream) {
              const text = chunk.text;
              if (text) enqueueText(text);
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
