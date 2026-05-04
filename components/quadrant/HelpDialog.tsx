'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">How does this work?</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How the Eisenhower Matrix Works</DialogTitle>
          <DialogDescription>
            The Eisenhower Matrix is a simple tool for prioritizing tasks by urgency and importance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm leading-relaxed">
          <div>
            <h4 className="font-bold text-red-500 uppercase tracking-tight">Do (Urgent & Important)</h4>
            <p className="text-muted-foreground">Tasks that need to be done immediately. These are your top priorities.</p>
          </div>
          <div>
            <h4 className="font-bold text-blue-500 uppercase tracking-tight">Schedule (Important, Not Urgent)</h4>
            <p className="text-muted-foreground">Tasks that contribute to long-term goals. Schedule a time to do these later.</p>
          </div>
          <div>
            <h4 className="font-bold text-orange-500 uppercase tracking-tight">Delegate (Urgent, Not Important)</h4>
            <p className="text-muted-foreground">Tasks that need to be done now but don&apos;t require your specific skills. Delegate these if possible.</p>
          </div>
          <div>
            <h4 className="font-bold text-muted-foreground uppercase tracking-tight">Delete (Neither)</h4>
            <p className="text-muted-foreground">Distractions and low-value tasks. Try to eliminate these from your schedule.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
