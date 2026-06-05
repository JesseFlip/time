import { QuadrantGrid } from '@/components/quadrant/QuadrantGrid';
import { Header } from '@/components/quadrant/Header';
import { ModeSelector } from '@/components/modes/ModeSelector';

/**
 * Main application page showing the Eisenhower Matrix.
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 pb-8 space-y-6">
        <Header />
        <ModeSelector />
        <main>
          <QuadrantGrid />
        </main>
      </div>
    </div>
  );
}
