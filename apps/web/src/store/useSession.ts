import { create } from 'zustand';

interface SessionState {
  user: null | { id: string; email: string };
  setUser: (user: SessionState['user']) => void;
}

export const useSession = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
