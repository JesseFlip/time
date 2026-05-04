'use client';

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTaskStore } from '@/lib/store/useTaskStore';
import { TaskCard } from './TaskCard';
import { QuadrantContainer } from './QuadrantContainer';
import { type LocalTask } from '@/lib/db/dexie';

const QUADRANTS = [
  { id: 'do', label: 'Do', description: 'Urgent & Important', color: 'border-red-500/20 bg-red-500/5' },
  { id: 'schedule', label: 'Schedule', description: 'Important, Not Urgent', color: 'border-blue-500/20 bg-blue-500/5' },
  { id: 'delegate', label: 'Delegate', description: 'Urgent, Not Important', color: 'border-orange-500/20 bg-orange-500/5' },
  { id: 'delete', label: 'Delete', description: 'Neither', color: 'border-gray-500/20 bg-gray-500/5' },
] as const;

/**
 * Main 2x2 Eisenhower Matrix grid with Drag and Drop.
 * @example <QuadrantGrid />
 */
export function QuadrantGrid() {
  const { tasks, fetchTasks, isLoading, updateTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<LocalTask | null>(null);

  useEffect(() => {
    // Placeholder user_id
    fetchTasks('00000000-0000-0000-0000-000000000000');
  }, [fetchTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if dragging over a different quadrant container or a task in a different quadrant
    const isOverQuadrant = QUADRANTS.some((q) => q.id === overId);
    const overTask = tasks.find((t) => t.id === overId);

    if (isOverQuadrant) {
      if (activeTask.quadrant !== overId) {
        updateTask(activeId, { quadrant: overId as LocalTask['quadrant'], position: tasks.filter(t => t.quadrant === overId).length });
      }
    } else if (overTask) {
      if (activeTask.quadrant !== overTask.quadrant) {
        updateTask(activeId, { quadrant: overTask.quadrant, position: overTask.position });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      
      if (overIndex !== -1) {
        const newTasks = arrayMove([...tasks], activeIndex, overIndex);
        // Update positions for all affected tasks in the store
        newTasks.forEach((task, index) => {
          if (task.position !== index) {
            updateTask(task.id, { position: index });
          }
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
        {QUADRANTS.map((q) => (
          <QuadrantContainer
            key={q.id}
            id={q.id}
            label={q.label}
            description={q.description}
            color={q.color}
            tasks={tasks.filter((t) => t.quadrant === q.id).sort((a, b) => a.position - b.position)}
            isLoading={isLoading}
          />
        ))}
      </div>
      
      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeTask ? (
          <div className="w-[calc(100vw/2-4rem)] max-w-sm">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
