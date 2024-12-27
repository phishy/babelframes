import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Subtitle } from '@/lib/types/subtitle';

interface SubtitleHistoryState {
  past: Subtitle[][];
  present: Subtitle[];
  future: Subtitle[][];
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

      setSubtitles: (subtitles) => {
        set((state) => {
          state.past.push([...state.present]);
          state.present = [...subtitles];
          state.future = [];
        });
      },

      updateSubtitle: (index, text) => {
        set((state) => {
          state.past.push([...state.present]);
          state.present = state.present.map((subtitle, i) => 
            i === index ? { ...subtitle, text } : subtitle
          );
          state.future = [];
        });
      },

      undo: () => {
        const { past, present } = get();
        if (past.length === 0) return;

        set((state) => {
          const previous = state.past[state.past.length - 1];
          state.past = state.past.slice(0, -1);
          state.future = [state.present, ...state.future];
          state.present = previous;
        });
      },

      redo: () => {
        const { future } = get();
        if (future.length === 0) return;

        set((state) => {
          const next = state.future[0];
          state.past = [...state.past, state.present];
          state.future = state.future.slice(1);
          state.present = next;
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