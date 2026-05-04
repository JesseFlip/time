import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTaskStore } from './useTaskStore';
import { db } from '@/lib/db/dexie';

// Mock Dexie
vi.mock('@/lib/db/dexie', () => ({
  db: {
    tasks: {
      add: vi.fn(),
      where: vi.fn(() => ({
        equals: vi.fn(() => ({
          toArray: vi.fn(() => Promise.resolve([])),
        })),
      })),
    },
    outbox: {
      add: vi.fn(),
      orderBy: vi.fn(() => ({
        toArray: vi.fn(() => Promise.resolve([])),
      })),
    },
  },
}));

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  })),
}));

describe('useTaskStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add a task optimistically', async () => {
    const taskData = {
      title: 'Test Task',
      quadrant: 'do' as const,
      status: 'open' as const,
      user_id: 'user-123',
      tags: [],
    };

    await useTaskStore.getState().addTask(taskData);

    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Test Task');
    expect(db.tasks.add).toHaveBeenCalled();
    expect(db.outbox.add).toHaveBeenCalled();
  });
});
