import { create } from 'zustand';
import { type ModeId, BUILT_IN_MODES } from '@/types/modes';
import { createClient } from '@/lib/supabase/client';

interface FocusModesState {
  activeModes: ModeId[];
  customModes: any[]; // Define custom modes type better if needed
  isLoading: boolean;
  
  toggleMode: (id: ModeId) => void;
  fetchPreferences: (userId: string) => Promise<void>;
  savePreferences: () => Promise<void>;
}

export const useFocusModes = create<FocusModesState>((set, get) => ({
  activeModes: [],
  customModes: [],
  isLoading: false,

  toggleMode: (id) => {
    set((state) => {
      const newModes = state.activeModes.includes(id)
        ? state.activeModes.filter(m => m !== id)
        : [...state.activeModes, id];
      return { activeModes: newModes };
    });
    get().savePreferences();
  },

  fetchPreferences: async (userId) => {
    set({ isLoading: true });
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('active_modes, custom_modes')
        .eq('user_id', userId)
        .single();
        
      if (data && !error) {
        set({ 
          activeModes: data.active_modes || [], 
          customModes: data.custom_modes || [] 
        });
      }
    } catch (err) {
      console.error('Failed to fetch user preferences', err);
    } finally {
      set({ isLoading: false });
    }
  },

  savePreferences: async () => {
    const supabase = createClient();
    const { activeModes, customModes } = get();
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return; // not logged in

      await supabase.from('user_preferences').upsert({
        user_id: userData.user.id,
        active_modes: activeModes,
        custom_modes: customModes,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch (err) {
      console.error('Failed to save user preferences', err);
    }
  }
}));
