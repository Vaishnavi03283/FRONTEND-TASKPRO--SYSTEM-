import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  notifications: [],
  
  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen 
  })),
  
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, {
      id: Date.now(),
      ...notification,
      timestamp: new Date()
    }]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] })
}));
