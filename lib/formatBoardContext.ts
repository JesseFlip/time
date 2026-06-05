import { type BoardContext } from '@/types/coach';
import { type LocalTask } from '@/lib/db/dexie';

export function formatBoardContext(board: BoardContext): string {
  const now = new Date(board.userLocalTime);
  const hour = now.getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });

  const formatTasks = (tasks: LocalTask[]) =>
    tasks.length === 0
      ? "  (empty)"
      : tasks.map(t => {
          const age = Math.floor(
            (now.getTime() - new Date(t.created_at).getTime()) / 86400000
          );
          return `  - "${t.title}"${t.notes ? ` (notes: ${t.notes})` : ""} · added ${age}d ago`;
        }).join("\n");

  return `
CURRENT BOARD STATE (${dayOfWeek} ${timeOfDay}, ${now.toLocaleDateString()}):

DO — Urgent & Important (${board.quadrants.do.length} tasks):
${formatTasks(board.quadrants.do)}

SCHEDULE — Important, Not Urgent (${board.quadrants.schedule.length} tasks):
${formatTasks(board.quadrants.schedule)}

DELEGATE — Urgent, Not Important (${board.quadrants.delegate.length} tasks):
${formatTasks(board.quadrants.delegate)}

ELIMINATE — Neither (${board.quadrants.eliminate.length} tasks):
${formatTasks(board.quadrants.eliminate)}

SUMMARY: ${board.taskCount} total task(s).
${board.oldestDoTaskAge !== null
  ? `Oldest DO task has been there ${board.oldestDoTaskAge} day(s).`
  : ""}
  `.trim();
}
