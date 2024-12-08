'use client'
import { create } from "zustand";
import { getUserById } from '@/services/users'

// Simulated database function to fetch user data
const fetchUserFromDatabase = async (userId) => {
  // Replace this with your actual database call
  const response = await getUserById(userId)
  return response;
};

const useUserStore = create((set) => {
  const initializeUser = async () => {
    if (typeof window !== 'undefined') {

      let userId;

      if (typeof window !== 'undefined') {
        userId = localStorage.getItem("UserId");
      }

      if (userId) {
        try {
          const user = await fetchUserFromDatabase(userId);
          set({ user });
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    }
  };

  // Initialize the user when the store is created
  initializeUser();

  return {
    user: null,
    setUser: (user) => {
      if (user?._id) {
        localStorage.setItem("UserId", user._id);
      }
      set({ user });
    },
    clearUser: () => {
      localStorage.removeItem("UserId");
      set({ user: null });
    },
  };
});

export default useUserStore;
