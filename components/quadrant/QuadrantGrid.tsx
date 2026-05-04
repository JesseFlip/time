'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const QUADRANTS = [
  { id: 'do', label: 'DO', description: 'Urgent & Important', color: 'bg-red-500/10 border-red-500/20' },
  { id: 'schedule', label: 'SCHEDULE', description: 'Important, Not Urgent', color: 'bg-blue-500/10 border-blue-500/20' },
  { id: 'delegate', label: 'DELEGATE', description: 'Urgent, Not Important', color: 'bg-orange-500/10 border-orange-500/20' },
  { id: 'delete', label: 'DELETE', description: 'Neither', color: 'bg-gray-500/10 border-gray-500/20' },
];

/**
 * Main 2x2 Eisenhower Matrix grid.
 * @example <QuadrantGrid />
 */
export function QuadrantGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
      {QUADRANTS.map((q) => (
        <Card key={q.id} className={`flex flex-col ${q.color}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              {q.label}
              <span className="text-[10px] font-normal opacity-70 uppercase tracking-wider">{q.description}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
              No tasks yet.
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
