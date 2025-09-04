import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface SessionState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => {
        set({ user: null, isLoading: false });
        // Clear any stored tokens if needed
        localStorage.removeItem('drive-mode-auth');
      },
      checkAuthStatus: async () => {
        try {
          // Check URL parameters for OAuth callback
          const urlParams = new URLSearchParams(window.location.search);
          const userId = urlParams.get('user_id');
          const email = urlParams.get('email');
          const name = urlParams.get('name');
          const picture = urlParams.get('picture');

          if (userId && email) {
            // User just authenticated via OAuth
            const user: User = {
              id: userId,
              email,
              name: name || undefined,
              picture: picture || undefined,
            };
            set({ user, isLoading: false });

            // Clean up URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);

            return;
          }

          // Check if we have a stored session
          const storedUser = get().user;
          if (storedUser) {
            set({ user: storedUser, isLoading: false });
            return;
          }

          // No session found
          set({ user: null, isLoading: false });
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'drive-mode-session',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
