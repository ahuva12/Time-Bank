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
    // user: null,
    user : {
      _id: "6745ce841396a6f699f26d13",
      firstName: "נעמה",
      lastName: "אילוז",
      address: "תל אביב",
      gender: "female",
      email: "naama@gmail.com",
      phoneNumber: "0521234567",
      dateOfBirth: "2014-11-10",
      password:"$2a$12$O3HzvCKZQ3zzabnwJq7DVOReHCC8CdryvaO8lErDvYL2gn5.NvTDq",
      remainingHours: 3
    },
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
