export const BUILT_IN_MODES = [
  {
    id: "health",
    label: "Health",
    emoji: "💪",
    color: "--mode-health",
    description: "Workouts, nutrition, sleep, mental wellness, appointments"
  },
  {
    id: "work",
    label: "Work",
    emoji: "🧑💼",
    color: "--mode-work",
    description: "Professional tasks, meetings, deadlines, career growth"
  },
  {
    id: "study",
    label: "Study",
    emoji: "📚",
    color: "--mode-study",
    description: "Learning, courses, certifications, reading, research"
  },
  {
    id: "cleaning",
    label: "Cleaning",
    emoji: "🧹",
    color: "--mode-cleaning",
    description: "Home tasks, errands, organizing, maintenance, chores"
  },
  {
    id: "misc",
    label: "Misc",
    emoji: "📦",
    color: "--mode-misc",
    description: "Everything else that doesn't fit a specific category"
  }
] as const;

export type BuiltInModeId = typeof BUILT_IN_MODES[number]["id"];

export interface CustomMode {
  id: string;          // "custom_" + nanoid(6)
  label: string;       // user-defined, max 20 chars
  emoji: string;       // user-picked from a curated set
  color: string;       // one of 5 preset accent colors user picks
  description: string; // auto-generated or user-defined, max 60 chars
  isCustom: true;
}

export type FocusMode = typeof BUILT_IN_MODES[number] | CustomMode;

export type ModeId = BuiltInModeId | string;
