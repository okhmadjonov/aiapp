import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { usersApi } from '../../services/mockApi';
import type { User } from '../../services/mockApi';

interface UsersState {
  list: User[];
  searchTerm: string;
  roleFilter: string;
}

const initialState: UsersState = {
  list: usersApi.getInitialUsers(),
  searchTerm: '',
  roleFilter: 'All'
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<User, 'id' | 'joinedDate' | 'avatar'>>) => {
      const newUser: User = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150`
      };
      state.list.unshift(newUser);
      usersApi.saveUsers(state.list);
    },
    updateUser: (state, action: PayloadAction<Partial<User> & { id: string }>) => {
      const index = state.list.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
        usersApi.saveUsers(state.list);
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(u => u.id !== action.payload);
      usersApi.saveUsers(state.list);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
    }
  }
});

export const { addUser, updateUser, deleteUser, setSearchTerm, setRoleFilter } = usersSlice.actions;
export default usersSlice.reducer;
