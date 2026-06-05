'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCoach } from '@/hooks/useCoach';
import { CoachMessageThread } from './CoachMessageThread';
import { CoachInputBar } from './CoachInputBar';
import { CoachAvatar } from './CoachAvatar';

interface CoachPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CoachPanel({ isOpen, onClose }: CoachPanelProps) {
  const { messages, isLoading, sendMessage } = useCoach();
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);

  // Keyboard shortcut Cmd/Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div 
        ref={panelRef}
        role="complementary"
        aria-label="Aria accountability coach"
        className={`fixed z-50 bg-card border-l border-border shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          bottom-0 right-0 left-0 h-[60vh] rounded-t-xl md:rounded-none md:h-screen md:w-[360px] md:top-0 md:left-auto
          ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full md:translate-y-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <CoachAvatar className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-semibold">Aria · Accountability Coach</h2>
              <div className="w-2 h-2 rounded-full bg-green-500 ml-1" title="Connected" />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors md:hidden"
              aria-label="Close panel"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 4L4 11M4 4L11 11" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <CoachMessageThread messages={messages} />

          {/* Input */}
          <CoachInputBar 
            onSend={sendMessage} 
            isLoading={isLoading} 
            isEmpty={messages.length === 0}
          />
        </div>
      </div>
    </>
  );
}
