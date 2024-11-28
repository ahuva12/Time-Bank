import { create } from 'zustand';

interface AuthState {
    isLoggedIn: boolean;
    login: () => void;
    signup: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    login: () => set({ isLoggedIn: true }),
    signup: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),
}));
