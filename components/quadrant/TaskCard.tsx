'use client';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Trash2, GripVertical, Check, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/lib/store/useTaskStore';
import { type LocalTask } from '@/lib/db/dexie';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { CoachSuggestionBadge } from './../coach/CoachSuggestionBadge';
import { BUILT_IN_MODES } from '@/types/modes';

interface TaskCardProps {
  task: LocalTask;
  isDragging?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragListeners?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragAttributes?: any;
}

/**
 * Task card display component.
 * @example <TaskCard task={task} />
 */
export function TaskCard({ task, isDragging, dragListeners, dragAttributes }: TaskCardProps) {
  const { deleteTask, updateTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateTask(task.id, { status: task.status === 'done' ? 'open' : 'done' });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  return (
    <article
      className={cn(
        "group relative hover:shadow-lg transition-all duration-200 border border-border/50 rounded-xl overflow-hidden",
        isDragging ? "opacity-50 scale-105 shadow-2xl ring-2 ring-primary" : "hover:-translate-y-0.5",
        "bg-card/50 backdrop-blur-sm"
      )}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <div 
            className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 -ml-2 rounded"
            {...dragAttributes}
            {...dragListeners}
            aria-label="Drag handle"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          
          <button
            onClick={handleToggleComplete}
            aria-label={task.status === 'done' ? 'Mark as open' : 'Mark as done'}
            className={cn(
              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              task.status === 'done' ? "bg-primary text-primary-foreground" : "bg-transparent"
            )}
          >
            {task.status === 'done' && <Check className="h-3 w-3" />}
          </button>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                  className="h-7 text-sm"
                />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSaveEdit}>
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <h3 className={cn("text-sm font-semibold leading-tight tracking-tight", task.status === 'done' && "line-through text-muted-foreground")}>
                {task.title}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!task._synced && (
              <Badge variant="secondary" className="text-[9px] h-3.5 px-1 font-medium bg-muted/50 text-muted-foreground uppercase">
                Not Synced
              </Badge>
            )}
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                aria-label={`Edit task: ${task.title}`}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
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
        
        {task.notes && !isEditing && (
          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed ml-7">
            {task.notes}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-1.5 ml-7">
          {task.tags?.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-[10px] h-4.5 px-1.5 font-normal border-border/50 bg-background/50"
            >
              {tag}
            </Badge>
          ))}
          {task.modes?.map(modeId => {
            const mode = BUILT_IN_MODES.find(m => m.id === modeId);
            if (!mode) return null;
            return (
              <Badge 
                key={mode.id} 
                variant="outline" 
                className="text-[10px] h-4.5 px-1.5 font-normal border-border/50 bg-secondary/50 text-secondary-foreground"
              >
                {mode.emoji} {mode.label}
              </Badge>
            );
          })}
        </div>
      </div>
      <CoachSuggestionBadge taskTitle={task.title} />
    </article>
  );
}
