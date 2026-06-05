'use client';

import React, { useEffect } from 'react';
import { BUILT_IN_MODES } from '@/types/modes';
import { useFocusModes } from '@/hooks/useFocusModes';

export function ModeSelector() {
  const { activeModes, toggleMode, fetchPreferences } = useFocusModes();

  useEffect(() => {
    // We should technically fetch preferences for logged-in user.
    // For now, we will assume a generic placeholder or handled elsewhere.
    fetchPreferences('00000000-0000-0000-0000-000000000000');
  }, [fetchPreferences]);

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 px-4 md:px-8 border-b border-border/40 bg-card overflow-x-auto">
      <span className="text-sm text-muted-foreground mr-2 font-medium">Focus:</span>
      {BUILT_IN_MODES.map(mode => {
        const isActive = activeModes.includes(mode.id);
        return (
          <button
            key={mode.id}
            onClick={() => toggleMode(mode.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'}`}
            title={mode.description}
          >
            <span>{mode.emoji}</span>
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
