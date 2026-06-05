'use client';

import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import { type CoachMessage } from '@/types/coach';

export function CoachMessageThread({ messages }: { messages: CoachMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6" aria-live="polite" aria-atomic="false">
      {messages.length === 0 && (
        <div className="text-center text-muted-foreground text-sm mt-8">
          No messages yet.
        </div>
      )}
      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
          <div 
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user' 
                ? 'bg-secondary text-secondary-foreground rounded-br-sm' 
                : 'bg-muted text-muted-foreground rounded-bl-sm'
            }`}
          >
            {msg.role === 'assistant' ? (
              <div 
                className="prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }}
              />
            ) : (
              <p>{msg.content}</p>
            )}
            {msg.isStreaming && <span className="inline-block animate-pulse ml-1">▋</span>}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1 px-1">
            {new Intl.DateTimeFormat('default', { hour: 'numeric', minute: 'numeric' }).format(new Date(msg.timestamp))}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
