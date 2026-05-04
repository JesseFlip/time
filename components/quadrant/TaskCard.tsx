'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/lib/store/useTaskStore';
import { type LocalTask } from '@/lib/db/dexie';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: LocalTask;
  isDragging?: boolean;
}

/**
 * Task card display component.
 * @example <TaskCard task={task} />
 */
export function TaskCard({ task, isDragging }: TaskCardProps) {
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <Card 
      className={cn(
        "group relative hover:shadow-lg transition-all duration-200 border-border/50",
        isDragging ? "opacity-50 scale-105 shadow-2xl ring-2 ring-primary" : "hover:-translate-y-0.5",
        "cursor-grab active:cursor-grabbing bg-card/50 backdrop-blur-sm"
      )}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight tracking-tight">{task.title}</h3>
          <div className="flex items-center gap-1">
            {!task._synced && (
              <Badge variant="secondary" className="text-[9px] h-3.5 px-1 font-medium bg-muted/50 text-muted-foreground uppercase">
                Offline
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {task.notes && (
          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {task.notes}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-1.5">
          {task.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-[10px] h-4.5 px-1.5 font-normal border-border/50 bg-background/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
