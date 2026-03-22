import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // This would be replaced with actual API call
          // const response = await authAPI.login(credentials);
          // For now, just simulate
          const response = {
            token: 'mock-token',
            user: {
              id: 1,
              name: 'Test User',
              email: credentials.email,
              role: 'USER' // or 'MANAGER' or 'ADMIN'
            }
          };
          
          set({ 
            user: response.user,
            token: response.token,
            isLoading: false 
          });
          
          return { success: true, user: response.user };
        } catch (error) {
          set({ 
            error: error.message || 'Login failed',
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // This would be replaced with actual API call
          // const response = await authAPI.register(userData);
          // For now, just simulate
          const response = {
            user: {
              id: Date.now(),
              name: `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
              role: userData.role
            }
          };
          
          set({ 
            user: response.user,
            isLoading: false 
          });
          
          return { success: true, user: response.user };
        } catch (error) {
          set({ 
            error: error.message || 'Registration failed',
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null,
          error: null 
        });
        localStorage.removeItem('token');
      },
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      getInitialState: () => {
        const state = get();
        return {
          user: state.user || null,
          token: state.token || null,
          isLoading: false,
          error: null
        };
      }
    }
  )
);
