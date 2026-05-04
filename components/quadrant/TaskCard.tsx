'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type LocalTask } from '@/lib/db/dexie';

interface TaskCardProps {
  task: LocalTask;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-tight">{task.title}</h3>
          {!task._synced && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1 opacity-50">
              Offline
            </Badge>
          )}
        </div>
        {task.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.notes}</p>
        )}
        <div className="flex items-center gap-2">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] h-4 px-1">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
