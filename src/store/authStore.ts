import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize isLoggedIn from localStorage after the component has mounted on the client side
  let isLoggedInFromStorage = false;

  if (typeof window !== 'undefined') {
    // Ensure we are on the client side before accessing localStorage
    isLoggedInFromStorage = localStorage.getItem('LoggedIn') === 'true';
  }

  return {
    isLoggedIn: isLoggedInFromStorage, // Set initial state from localStorage or false
    login: () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('LoggedIn', 'true'); // Set LoggedIn to true in localStorage
      }
      set({ isLoggedIn: true });
    },
    signup: () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('LoggedIn', 'true'); // Set LoggedIn to true in localStorage
      }
      set({ isLoggedIn: true });
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('LoggedIn', 'false'); // Set LoggedIn to false in localStorage
      }
      set({ isLoggedIn: false });
    },
  };
});