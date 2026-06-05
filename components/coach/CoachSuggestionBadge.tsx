import React from 'react';

interface CoachSuggestionBadgeProps {
  taskTitle: string;
}

export function CoachSuggestionBadge({ taskTitle }: CoachSuggestionBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app we'd dispatch an event or use context to open the coach and pre-fill
    // For now we just use a global event since CoachPanel isn't directly wrapping tasks
    window.dispatchEvent(new CustomEvent('coach-suggest', { detail: taskTitle }));
  };

  return (
    <button
      onClick={handleClick}
      className="hidden group-hover:flex absolute -top-2.5 -right-2.5 items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full shadow-md hover:scale-105 transition-transform"
      title="Ask Aria about this task"
      aria-label="Ask Aria about this task"
    >
      <span>✨</span>
      <span>Ask Aria</span>
    </button>
  );
}
