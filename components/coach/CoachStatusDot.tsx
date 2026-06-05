import React from 'react';

export function CoachStatusDot({ unreadCount, onClick }: { unreadCount: number; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted transition-colors"
      aria-label="Toggle Aria Coach"
    >
      <span className="text-sm font-medium hidden sm:inline-block">Aria</span>
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${unreadCount > 0 ? 'bg-green-500' : 'bg-muted-foreground'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-3 text-[10px] font-bold text-green-600 bg-green-100 rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}
