import { create } from 'zustand';
import { db, type LocalTask } from '@/lib/db/dexie';
import { createClient } from '@/lib/supabase/client';

interface TaskState {
  tasks: LocalTask[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: (userId: string) => Promise<void>;
  addTask: (task: Omit<LocalTask, 'id' | 'created_at' | 'updated_at' | '_synced' | 'position'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<LocalTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  sync: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (userId) => {
    set({ isLoading: true });
    try {
      // 1. Load from Dexie first (offline-first)
      const localTasks = await db.tasks.where('user_id').equals(userId).toArray();
      set({ tasks: localTasks.sort((a, b) => a.position - b.position) });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    const newTask: LocalTask = {
      ...taskData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      position: get().tasks.length,
      _synced: false,
    };

    // Optimistic Update
    set((state) => ({ tasks: [...state.tasks, newTask] }));

    try {
      await db.tasks.add(newTask);
      await db.outbox.add({
        task_id: newTask.id,
        type: 'insert',
        payload: newTask,
        timestamp: new Date().toISOString(),
      });
      get().sync();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  updateTask: async (id, updates) => {
    const updatedAt = new Date().toISOString();
    
    // Optimistic Update
    set((state) => ({
      tasks: state.tasks
        .map((t) => (t.id === id ? { ...t, ...updates, updated_at: updatedAt } : t))
        .sort((a, b) => a.position - b.position),
    }));

    try {
      await db.tasks.update(id, { ...updates, updated_at: updatedAt, _synced: false });
      await db.outbox.add({
        task_id: id,
        type: 'update',
        payload: updates,
        timestamp: updatedAt,
      });
      get().sync();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  deleteTask: async (id) => {
    // Optimistic Update
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));

    try {
      await db.tasks.delete(id);
      await db.outbox.add({
        task_id: id,
        type: 'delete',
        payload: {},
        timestamp: new Date().toISOString(),
      });
      get().sync();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  sync: async () => {
    const supabase = createClient();
    const outboxItems = await db.outbox.orderBy('id').toArray();
    
    if (outboxItems.length === 0) return;

    for (const item of outboxItems) {
      try {
        let error;
        if (item.type === 'insert') {
          const { error: err } = await supabase.from('tasks').insert([item.payload]);
          error = err;
        } else if (item.type === 'update') {
          const { error: err } = await supabase.from('tasks').update(item.payload).eq('id', item.task_id);
          error = err;
        } else if (item.type === 'delete') {
          const { error: err } = await supabase.from('tasks').delete().eq('id', item.task_id);
          error = err;
        }

        if (!error) {
          // If it was a delete, we don't need to update the task record anymore
          if (item.type !== 'delete') {
            await db.tasks.update(item.task_id, { _synced: true });
          }
          await db.outbox.delete(item.id!);
        }
      } catch (err) {
        console.error('Sync failed for item', item.id, err);
        break;
      }
    }
  }
}));
