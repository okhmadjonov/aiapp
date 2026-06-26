import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  time: string;
  read: boolean;
}

interface UiState {
  sidebarExpanded: boolean;
  theme: 'dark' | 'light';
  notifications: Notification[];
}

const getInitialTheme = (): 'dark' | 'light' => {
  const storedTheme = localStorage.getItem('admin_theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  return 'dark'; // Default theme
};

const initialState: UiState = {
  sidebarExpanded: true,
  theme: getInitialTheme(),
  notifications: [
    { id: 'n1', type: 'info', message: 'System initialized successfully', time: 'Just now', read: false },
    { id: 'n2', type: 'warning', message: 'Product "Ergonomic Aero Chair" is low on stock', time: '10 min ago', read: false },
    { id: 'n3', type: 'success', message: 'Database backup successfully saved', time: '2 hours ago', read: true }
  ]
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    setSidebarExpanded: (state, action: PayloadAction<boolean>) => {
      state.sidebarExpanded = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('admin_theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
      localStorage.setItem('admin_theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'time' | 'read'>>) => {
      state.notifications.unshift({
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
        time: 'Just now',
        read: false
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        state.notifications[index].read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => { n.read = true; });
    },
    clearNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {
  toggleSidebar,
  setSidebarExpanded,
  toggleTheme,
  setTheme,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotification,
  clearAllNotifications
} = uiSlice.actions;

export default uiSlice.reducer;
