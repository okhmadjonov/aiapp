import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    email: string;
    avatar: string;
  } | null;
  error: string | null;
}

const getInitialState = (): AuthState => {
  const session = localStorage.getItem('admin_session');
  if (session) {
    try {
      return {
        isAuthenticated: true,
        user: JSON.parse(session),
        error: null,
      };
    } catch {
      localStorage.removeItem('admin_session');
    }
  }
  return {
    isAuthenticated: false,
    user: null,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<Exclude<AuthState['user'], null>>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('admin_session', JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('admin_session');
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
