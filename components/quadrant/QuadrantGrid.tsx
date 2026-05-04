'use client';

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/lib/store/useTaskStore';
import { TaskCard } from './TaskCard';
import { AddTaskDialog } from './AddTaskDialog';

const QUADRANTS = [
  { id: 'do', label: 'DO', description: 'Urgent & Important', color: 'bg-red-500/10 border-red-500/20' },
  { id: 'schedule', label: 'SCHEDULE', description: 'Important, Not Urgent', color: 'bg-blue-500/10 border-blue-500/20' },
  { id: 'delegate', label: 'DELEGATE', description: 'Urgent, Not Important', color: 'bg-orange-500/10 border-orange-500/20' },
  { id: 'delete', label: 'DELETE', description: 'Neither', color: 'bg-gray-500/10 border-gray-500/20' },
] as const;

/**
 * Main 2x2 Eisenhower Matrix grid.
 * @example <QuadrantGrid />
 */
export function QuadrantGrid() {
  const { tasks, fetchTasks, isLoading } = useTaskStore();

  useEffect(() => {
    // Placeholder user_id
    fetchTasks('00000000-0000-0000-0000-000000000000');
  }, [fetchTasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
      {QUADRANTS.map((q) => {
        const quadrantTasks = tasks.filter((t) => t.quadrant === q.id);
        
        return (
          <Card key={q.id} className={`flex flex-col ${q.color}`} data-testid={`quadrant-${q.id}`}>
            <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex flex-col">
                {q.label}
                <span className="text-[10px] font-normal opacity-70 uppercase tracking-wider">{q.description}</span>
              </CardTitle>
              <AddTaskDialog 
                defaultQuadrant={q.id} 
                trigger={
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                }
              />
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-2">
              {quadrantTasks.length > 0 ? (
                <div className="space-y-2">
                  {quadrantTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs italic">
                  {isLoading ? 'Loading...' : 'No tasks yet.'}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
