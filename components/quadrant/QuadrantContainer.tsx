'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddTaskDialog } from './AddTaskDialog';
import { SortableTask } from './SortableTask';
import { type LocalTask } from '@/lib/db/dexie';
import { cn } from '@/lib/utils';

interface QuadrantContainerProps {
  id: string;
  label: string;
  description: string;
  color: string;
  tasks: LocalTask[];
  isLoading: boolean;
}

export function QuadrantContainer({
  id,
  label,
  description,
  color,
  tasks,
  isLoading,
}: QuadrantContainerProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Card 
      className={cn(
        "flex flex-col h-full border-2 transition-colors duration-200",
        color,
        "bg-opacity-5"
      )}
      data-testid={`quadrant-${id}`}
    >
      <CardHeader className="pb-3 space-y-1 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-xs font-bold tracking-widest uppercase opacity-80">
            {label}
          </CardTitle>
          <p className="text-[10px] font-medium opacity-60 uppercase tracking-tighter">
            {description}
          </p>
        </div>
        <AddTaskDialog 
          defaultQuadrant={id as any} 
          trigger={
            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-background/50 rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          }
        />
      </CardHeader>
      <CardContent ref={setNodeRef} className="flex-1 overflow-y-auto p-3 min-h-[150px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <SortableTask key={task.id} task={task} />
            ))}
            {tasks.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted/20 rounded-xl text-muted-foreground/40 text-[10px] uppercase font-bold tracking-widest">
                Drop tasks here
              </div>
            )}
            {isLoading && tasks.length === 0 && (
              <div className="flex items-center justify-center h-24 text-muted-foreground/40 text-[10px] uppercase font-bold tracking-widest animate-pulse">
                Loading...
              </div>
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
}
