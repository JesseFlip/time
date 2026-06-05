'use client';

import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

interface CoachInputBarProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isEmpty: boolean;
}

const QUICK_ACTIONS = [
  "Help me prioritize",
  "What should I do first?",
  "Daily review"
];

export function CoachInputBar({ onSend, isLoading, isEmpty }: CoachInputBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      {isEmpty && (
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => onSend(action)}
              disabled={isLoading}
              className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              {action}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Aria about your board..."
          disabled={isLoading}
          aria-label="Message Aria"
          className="w-full bg-input rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-1.5 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <SendHorizonal className="w-4 h-4" />
          <span className="sr-only">Send</span>
        </button>
      </form>
    </div>
  );
}
