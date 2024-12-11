import { create } from 'zustand';
import { User } from '@/types/user';
import { getUserById } from '@/services/users';

interface AuthState {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const defaultUser: User = {
  _id: "",
  firstName: "לא מחובר",
  lastName: "",
  address: "",
  gender: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  password: "",
  remainingHours: 0,
};

export const useUserStore = create<AuthState>()((set) => {
  const initializeUser = async () => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("UserId");
      if (userId) {
        try {
          const fetchedUser = await getUserById(userId);
          if (fetchedUser) {
            set({ user: fetchedUser });
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          set({ user: defaultUser });
        }
      }
    }
  };

  // Call the initialization function when the store is created
  initializeUser();

  return {
    user: defaultUser,

    setUser: (user) => {
      if (user._id !== "") {
        localStorage.setItem("UserId", user._id as string);
      }
      set({ user });
    },

    clearUser: () => {
      localStorage.removeItem("UserId"); 
      set({ user: defaultUser });
    },
  };
});
