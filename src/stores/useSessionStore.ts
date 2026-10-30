'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppTab, HistoryRecord, MemberProfile } from '@/types/account';

interface SessionStore {
  entered: boolean;
  member: MemberProfile | null;
  history: HistoryRecord[];
  activeTab: AppTab;
  enterAsGuest: () => void;
  enterAsMember: () => void;
  login: (member: MemberProfile) => void;
  logout: () => void;
  setTab: (tab: AppTab) => void;
  addHistory: (record: HistoryRecord) => void;
  resetSession: () => void;
}

interface PersistedSession {
  member: MemberProfile | null;
  history: HistoryRecord[];
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      entered: false,
      member: null,
      history: [],
      activeTab: 'home',

      enterAsGuest: () => set({ entered: true, member: null, activeTab: 'home' }),

      enterAsMember: () => {
        const member = get().member;
        if (member) {
          set({ entered: true, activeTab: 'home' });
        }
      },

      login: (member) => set({ entered: true, member }),

      logout: () => set({ member: null, entered: false, activeTab: 'home' }),

      setTab: (activeTab) => set({ activeTab }),

      addHistory: (record) =>
        set((state) =>
          state.history.some((item) => item.code === record.code)
            ? state
            : { history: [record, ...state.history] }
        ),

      resetSession: () => set({ entered: false, member: null, history: [], activeTab: 'home' }),
    }),
    {
      name: 'sango-session',
      // `entered` sengaja tidak disimpan: landing page harus tampil setiap aplikasi dibuka.
      version: 2,
      partialize: (state): PersistedSession => ({
        member: state.member,
        history: state.history,
      }),
      migrate: (persisted): PersistedSession => {
        const data = (persisted ?? {}) as Partial<PersistedSession>;
        return {
          member: data.member ?? null,
          history: data.history ?? [],
        };
      },
    }
  )
);