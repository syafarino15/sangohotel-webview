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
  login: (member: MemberProfile) => void;
  logout: () => void;
  setTab: (tab: AppTab) => void;
  addHistory: (record: HistoryRecord) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      entered: false,
      member: null,
      history: [],
      activeTab: 'home',

      enterAsGuest: () => set({ entered: true, member: null, activeTab: 'home' }),

      login: (member) => set({ entered: true, member }),

      logout: () => set({ member: null, activeTab: 'account' }),

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
      version: 1,
      partialize: (state) => ({
        entered: state.entered,
        member: state.member,
        history: state.history,
      }),
    }
  )
);