import { type LocalTask } from "@/lib/db/dexie";

export interface CoachMessage {
  id: string;           // randomUUID()
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface BoardContext {
  quadrants: {
    do: LocalTask[];
    schedule: LocalTask[];
    delegate: LocalTask[];
    eliminate: LocalTask[];
  };
  taskCount: number;
  oldestDoTaskAge: number | null;
  userLocalTime: string;
}
