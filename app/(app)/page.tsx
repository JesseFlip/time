import { QuadrantGrid } from '@/components/quadrant/QuadrantGrid';
import { AddTaskDialog } from '@/components/quadrant/AddTaskDialog';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Main application page showing the Eisenhower Matrix.
 */
export default function DashboardPage() {
  return (
    <main className="container mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quadrant</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a 
              href="https://github.com/JesseFlip/time" 
              target="_blank" 
              rel="noreferrer"
              title="View source on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <AddTaskDialog />
        </div>
      </header>
      <QuadrantGrid />
    </main>
  );
}
