// 'use client'
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface AuthState {
//   isLoggedIn: boolean;
//   login: () => void;
//   signup: () => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => {
//   // Initialize isLoggedIn from localStorage after the component has mounted on the client side
//   let isLoggedInFromStorage = false;

//   if (typeof window !== 'undefined') {
//     // Ensure we are on the client side before accessing localStorage
//     isLoggedInFromStorage = localStorage.getItem('LoggedIn') === 'true';
//   }

//   return {
//     isLoggedIn: isLoggedInFromStorage, // Set initial state from localStorage or false
//     login: () => {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('LoggedIn', 'true'); 
//       }
//       set({ isLoggedIn: true });
//     },
//     signup: () => {
//     },
//     logout: () => {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('LoggedIn', 'false'); 
//       }
//       set({ isLoggedIn: false });
//     },
//   };
// });

'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false, 
      login: () => {
        set({ isLoggedIn: true });
      },
      signup: () => {
      },
      logout: () => {
        set({ isLoggedIn: false });
      },
    }),
    {
      name: 'auth-user', 
    }
  )
);
