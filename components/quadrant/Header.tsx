'use client';

import React from 'react';
import { Code } from 'lucide-react';
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
            className="inline-flex items-center justify-center rounded-full size-9 transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Code className="h-5 w-5" />
          </a>
        </nav>
      </div>
      <AddTaskDialog />
    </header>
  );
}
