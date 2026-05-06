'use client';

import React from 'react';
import { Code, MessageSquare } from 'lucide-react';
import { AddTaskDialog } from './AddTaskDialog';
import { HelpDialog } from './HelpDialog';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
  return (
    <header className="flex items-center justify-between py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Quadrant
        </h1>
        <nav className="flex items-center gap-1">
          <HelpDialog />
          <ModeToggle />
          <a 
            href="https://github.com/JesseFlip/time" 
            target="_blank" 
            rel="noreferrer"
            title="View source on GitHub"
            className="inline-flex items-center justify-center rounded-full px-3 h-9 transition-colors hover:bg-muted text-muted-foreground hover:text-foreground gap-2 text-sm font-medium"
          >
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a 
            href="https://github.com/JesseFlip/time/issues" 
            target="_blank" 
            rel="noreferrer"
            title="Suggest feedback or report issues"
            className="inline-flex items-center justify-center rounded-full px-3 h-9 transition-colors hover:bg-muted text-muted-foreground hover:text-foreground gap-2 text-sm font-medium"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
          </a>
        </nav>
      </div>
      <AddTaskDialog />
    </header>
  );
}
