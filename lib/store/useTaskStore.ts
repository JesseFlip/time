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

      // 2. Background sync (optional, can be called separately)
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
      position: get().tasks.length, // simple position for now
      _synced: false,
    };

    // Optimistic Update
    set((state) => ({ tasks: [...state.tasks, newTask] }));

    try {
      // Save to Dexie
      await db.tasks.add(newTask);
      
      // Add to outbox
      await db.outbox.add({
        task_id: newTask.id,
        type: 'insert',
        payload: newTask,
        timestamp: new Date().toISOString(),
      });

      // Trigger background sync
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
        }
        // Add update/delete logic here later

        if (!error) {
          // Mark as synced in Dexie
          await db.tasks.update(item.task_id, { _synced: true });
          // Remove from outbox
          await db.outbox.delete(item.id!);
        }
      } catch (err) {
        console.error('Sync failed for item', item.id, err);
        // Stop processing outbox on error to preserve order
        break;
      }
    }
  }
}));
