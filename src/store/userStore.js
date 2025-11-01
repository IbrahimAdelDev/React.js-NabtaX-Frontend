import { create } from 'zustand';
import { saveToken, removeTokens, saveUser, removeUser } from '../lib/auth';

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user, token, refreshToken) => {
    set({ user });
    if ( user ) {
      saveUser(user);
    }
    if (token) {
      saveToken(token);
    }
    if (refreshToken) {
      saveToken(refreshToken, true);
    }
  },
  logout: () => {
    removeTokens();
    removeUser();
    set({ user: null });
  }
}));