import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Subtitle } from '@/lib/types/subtitle';

interface SubtitleHistoryState {
  past: Subtitle[][];
  present: Subtitle[];
  future: Subtitle[][];
  lastModifiedIndex: number | null;
}

interface SubtitleState extends SubtitleHistoryState {
  setSubtitles: (subtitles: Subtitle[]) => void;
  updateSubtitle: (index: number, text: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useSubtitleStore = create<SubtitleState>()(
  persist(
    immer((set, get) => ({
      past: [],
      present: [],
      future: [],
      lastModifiedIndex: null,

      setSubtitles: (subtitles) => {
        set((state) => {
          state.past.push([...state.present]);
          state.present = [...subtitles];
          state.future = [];
          state.lastModifiedIndex = null;
        });
      },

      updateSubtitle: (index, text) => {
        set((state) => {
          state.past.push([...state.present]);
          state.present = state.present.map((subtitle, i) => 
            i === index ? { ...subtitle, text } : subtitle
          );
          state.future = [];
          state.lastModifiedIndex = index;
        });
      },

      undo: () => {
        const { past, present, lastModifiedIndex } = get();
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const changedIndex = present.findIndex((subtitle, i) => 
          subtitle.text !== previous[i]?.text
        );
        
        set((state) => {
          state.past = state.past.slice(0, -1);
          state.future = [state.present, ...state.future];
          state.present = previous;
          state.lastModifiedIndex = changedIndex >= 0 ? changedIndex : null;
        });
      },

      redo: () => {
        const { future, present } = get();
        if (future.length === 0) return;
        
        const next = future[0];
        const changedIndex = next.findIndex((subtitle, i) => 
          subtitle.text !== present[i]?.text
        );
        
        set((state) => {
          state.past = [...state.past, state.present];
          state.future = state.future.slice(1);
          state.present = next;
          state.lastModifiedIndex = changedIndex >= 0 ? changedIndex : null;
        });
      },

      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,
    })),
    {
      name: 'subtitle-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);