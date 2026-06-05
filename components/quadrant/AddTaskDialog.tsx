'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTaskStore } from '@/lib/store/useTaskStore';
import { BUILT_IN_MODES } from '@/types/modes';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(280),
  quadrant: z.enum(['do', 'schedule', 'delegate', 'delete']),
  notes: z.string().optional(),
  modes: z.array(z.string()),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface AddTaskDialogProps {
  defaultQuadrant?: 'do' | 'schedule' | 'delegate' | 'delete';
  trigger?: React.ReactElement;
}

export function AddTaskDialog({ defaultQuadrant = 'do', trigger }: AddTaskDialogProps) {
  const [open, setOpen] = React.useState(false);
  const addTask = useTaskStore((state) => state.addTask);
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      quadrant: defaultQuadrant,
      notes: '',
      modes: [],
    },
  });

  const watchedModes = form.watch('modes');

  const onSubmit = async (values: TaskFormValues) => {
    // In a real app, we'd get the user_id from auth
    // For now, using a placeholder or assuming the store handles it (needs user_id)
    // Let's assume a dummy user_id for v1 if not logged in
    await addTask({
      ...values,
      user_id: '00000000-0000-0000-0000-000000000000', // placeholder
      status: 'open',
      tags: [],
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={trigger || (
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quadrant">Quadrant</Label>
            <Select
              defaultValue={defaultQuadrant}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- rationale: bypass type inference issue
              onValueChange={(value: any) => form.setValue('quadrant', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a quadrant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="do">DO (Urgent & Important)</SelectItem>
                <SelectItem value="schedule">SCHEDULE (Important, Not Urgent)</SelectItem>
                <SelectItem value="delegate">DELEGATE (Urgent, Not Important)</SelectItem>
                <SelectItem value="delete">DELETE (Neither)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Focus Modes</Label>
            <div className="flex flex-wrap gap-2">
              {BUILT_IN_MODES.map(mode => {
                const isSelected = watchedModes.includes(mode.id);
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      const current = form.getValues('modes');
                      if (isSelected) {
                        form.setValue('modes', current.filter(m => m !== mode.id));
                      } else {
                        form.setValue('modes', [...current, mode.id]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'}`}
                  >
                    {mode.emoji} {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Additional details..."
              {...form.register('notes')}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
