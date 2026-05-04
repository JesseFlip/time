import { QuadrantGrid } from '@/components/quadrant/QuadrantGrid';
import { AddTaskDialog } from '@/components/quadrant/AddTaskDialog';
import { Code } from 'lucide-react';

/**
 * Main application page showing the Eisenhower Matrix.
 */
export default function DashboardPage() {
  return (
    <main className="container mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quadrant</h1>
        <div className="flex items-center gap-2">
          <a 
            href="https://github.com/JesseFlip/time" 
            target="_blank" 
            rel="noreferrer"
            title="View source on GitHub"
            className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-8"
          >
            <Code className="h-5 w-5" />
          </a>
          <AddTaskDialog />
        </div>
      </header>
      <QuadrantGrid />
    </main>
  );
}
