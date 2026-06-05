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
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">How does this work?</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How the Eisenhower Matrix Works</DialogTitle>
          <DialogDescription>
            The Eisenhower Matrix is a simple tool for prioritizing tasks by urgency and importance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 text-sm leading-relaxed">
          <div className="space-y-4">
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
              <h4 className="font-bold text-muted-foreground uppercase tracking-tight">Eliminate (Neither)</h4>
              <p className="text-muted-foreground">Distractions and low-value tasks. Try to eliminate these from your schedule.</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <h4 className="font-bold uppercase tracking-tight mb-3">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">n</kbd> <span>New Task</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">e</kbd> <span>Edit Task</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">1</kbd> <span>Do</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">2</kbd> <span>Schedule</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">3</kbd> <span>Delegate</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">4</kbd> <span>Eliminate</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">?</kbd> <span>Help</span></div>
              <div className="flex justify-between"><kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">esc</kbd> <span>Close</span></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
