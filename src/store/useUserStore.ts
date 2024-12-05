import { create } from "zustand";
import { getUserById } from "@/services/users";
import { User } from "@/types/user";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  initializeUser: () => void;
}

// Simulated database function to fetch user data
const fetchUserFromDatabase = async (userId: string): Promise<User> => {
  const response = await getUserById(userId);
  return response;
};

// Create the Zustand store
const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => {
    if (user?._id) {
      localStorage.setItem("UserId", user._id as string);
    }
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("UserId");
    set({ user: null });
  },
  initializeUser: async () => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("UserId");
      if (userId) {
        try {
          const user = await fetchUserFromDatabase(userId);
          set({ user });
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    }
  },
}));

// Initialize the user on the client side
if (typeof window !== "undefined") {
  useUserStore.getState().initializeUser();
}

export default useUserStore;
