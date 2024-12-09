'use client';
import { create } from 'zustand';
import { getUserById } from '@/services/users';
import { User } from '@/types/user';

interface AuthState {
  user: User;
  getUser: () => Promise<any>; 
  setUser: (user: any) => void;
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

export const useUserStore = create<AuthState>((set, get) => ({
  // user: null,
    //   user : {
    //   _id: "6745ce841396a6f699f26d13",
    //   firstName: "נעמה",
    //   lastName: "אילוז",
    //   address: "תל אביב",
    //   gender: "female",
    //   email: "naama@gmail.com",
    //   phoneNumber: "0521234567",
    //   dateOfBirth: "2014-11-10",
    //   password:"$2a$12$O3HzvCKZQ3zzabnwJq7DVOReHCC8CdryvaO8lErDvYL2gn5.NvTDq",
    //   remainingHours: 3
    // },
  user : defaultUser,
  getUser: async () => {
    const state = get(); 
    console.log(state);
    
    // If user is already set, return it
    if (state.user) {
      return state.user;
    } else {
      try {
        // Try to fetch user from localStorage
        const userId = localStorage.getItem("UserId");
        if (userId) {
          const user = await getUserById(userId); 
          set({ user }); // Update state with the user
          return user;
        } else {
          console.error("No UserId found in localStorage");
          set({ user: defaultUser });
          return defaultUser; // Return null if no UserId in localStorage
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        set({ user: defaultUser });
        return defaultUser; // Return null if error occurs
      }
    }
  },
  setUser: (user: any) => {
    if (user?._id) {
      localStorage.setItem("UserId", user._id); // Save user ID in localStorage
    }
    set({ user }); // Update user in Zustand state
  },
  clearUser: () => {
    localStorage.removeItem("UserId"); // Remove user ID from localStorage
    set({ user: defaultUser }); // Clear the user from Zustand state
  },
}));



// 'use client'
// import { create } from "zustand";
// import { getUserById } from '@/services/users';

// // Simulated database function to fetch user data
// const fetchUserFromDatabase = async (userId) => {
//   // Replace this with your actual database call
//   const response = await getUserById(userId)
//   return response;
// };

// const useUserStore = create((set) => {
//   const initializeUser = async () => {
//     if (typeof window !== 'undefined') {

//       let userId;

//       if (typeof window !== 'undefined') {
//         userId = localStorage.getItem("UserId");
//       }

//       if (userId) {
//         try {
//           const user = await fetchUserFromDatabase(userId);
//           set({ user });
//         } catch (error) {
//           console.error("Failed to fetch user:", error);
//         }
//       }
//     }
//   };

//   // Initialize the user when the store is created
//   initializeUser();

//   return {
//     // user: null,
//     user : {
//       _id: "6745ce841396a6f699f26d13",
//       firstName: "נעמה",
//       lastName: "אילוז",
//       address: "תל אביב",
//       gender: "female",
//       email: "naama@gmail.com",
//       phoneNumber: "0521234567",
//       dateOfBirth: "2014-11-10",
//       password:"$2a$12$O3HzvCKZQ3zzabnwJq7DVOReHCC8CdryvaO8lErDvYL2gn5.NvTDq",
//       remainingHours: 3
//     },
//     setUser: (user) => {
//       if (user?._id) {
//         localStorage.setItem("UserId", user._id);
//       }
//       set({ user });
//     },
//     clearUser: () => {
//       localStorage.removeItem("UserId");
//       set({ user: null });
//     },
//   };
// });

// export default useUserStore;





