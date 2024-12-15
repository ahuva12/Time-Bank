import { create } from 'zustand';
import { User } from '@/types/user';
import { getUserById } from '@/services/users';

interface UserState {
  user: User;
  setUser: (user: User) => void;
  setUserField: (field: string, value: string | number | Date) => void; 
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

export const useUserStore = create<UserState>()((set) => {
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
    setUserField: (field: string, value: string | number | Date) => {
      set((state) => ({
        user: {
          ...state.user, 
          [field]: value, 
        },
      }));
    },
    clearUser: () => {
      localStorage.removeItem("UserId"); 
      set({ user: defaultUser });
    },
  };
});
