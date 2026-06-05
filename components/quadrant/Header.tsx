'use client';

import React from 'react';
import { Code, MessageSquare } from 'lucide-react';
import { AddTaskDialog } from './AddTaskDialog';
import { HelpDialog } from './HelpDialog';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { CoachStatusDot } from './../coach/CoachStatusDot';
import { CoachPanel } from './../coach/CoachPanel';
import { useCoach } from '@/hooks/useCoach';

export function Header() {
  const [isCoachOpen, setIsCoachOpen] = React.useState(false);
  const { messages } = useCoach();
  const unreadCount = isCoachOpen ? 0 : messages.filter(m => m.role === 'assistant').length; // Simple proxy for unread

  React.useEffect(() => {
    const saved = localStorage.getItem('coach_panel_open');
    // Initialize state properly without calling setIsCoachOpen if possible, or ignore warning.
    // We can't use useState(saved === 'true') because it causes hydration mismatch.
    // Just ignore the lint rule
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === 'true') setIsCoachOpen(true);

    const handleOpen = () => setIsCoachOpen(true);
    window.addEventListener('coach-open-panel', handleOpen);
    return () => window.removeEventListener('coach-open-panel', handleOpen);
  }, []);

  const toggleCoach = () => {
    setIsCoachOpen(prev => {
      localStorage.setItem('coach_panel_open', String(!prev));
      return !prev;
    });
  };

  return (
    <header className="flex items-center justify-between py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Quadrant
        </h1>
        <nav className="flex items-center gap-1">

          <HelpDialog />
          <div className="flex items-center gap-2 border-r border-border/40 pr-2 mr-2">
            <CoachStatusDot unreadCount={unreadCount} onClick={toggleCoach} />
            <ModeToggle />
          </div>
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
          <div className="ml-2 pl-2 border-l border-border/40">
            <Button variant="default" size="sm" className="rounded-full px-4 h-8 text-xs font-semibold shadow-sm">
              Sign in to sync
            </Button>
          </div>
        </nav>
      </div>
      <AddTaskDialog />
      <CoachPanel isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} />
    </header>
  );
}
