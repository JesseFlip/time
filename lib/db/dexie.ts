import Dexie, { type Table } from 'dexie';

export interface LocalTask {
  id: string;
  user_id: string;
  title: string;
  notes?: string;
  quadrant: 'do' | 'schedule' | 'delegate' | 'delete';
  status: 'open' | 'done' | 'archived';
  due_at?: string;
  delegated_to?: string;
  tags: string[];
  position: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  deleted_at?: string;
  /** local-only flag to track sync status */
  _synced?: boolean;
  modes: string[];
}

export interface OutboxItem {
  id?: number;
  task_id: string;
  type: 'insert' | 'update' | 'delete';
  payload: Partial<LocalTask>;
  timestamp: string;
}

export class QuadrantDatabase extends Dexie {
  tasks!: Table<LocalTask>;
  outbox!: Table<OutboxItem>;

  constructor() {
    super('QuadrantDB');
    this.version(1).stores({
      tasks: 'id, user_id, quadrant, status, updated_at',
      outbox: '++id, task_id, timestamp'
    });
    this.version(2).stores({
      tasks: 'id, user_id, quadrant, status, updated_at, *modes',
      outbox: '++id, task_id, timestamp'
    }).upgrade(tx => {
      return tx.table('tasks').toCollection().modify(task => {
        if (!task.modes) task.modes = [];
      });
    });
  }
}

export const db = new QuadrantDatabase();
