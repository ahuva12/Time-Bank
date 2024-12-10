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
      localStorage.removeItem("UserId"); // Clear UserId from localStorage
      set({ user: defaultUser });
    },
  };
});

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { User } from '@/types/user';

// interface AuthState {
//   user: User;
//   setUser: (user: User) => void;
//   clearUser: () => void;
// }

// const defaultUser: User = {
//   _id: "",
//   firstName: "לא מחובר",
//   lastName: "",
//   address: "",
//   gender: "",
//   email: "",
//   phoneNumber: "",
//   dateOfBirth: "",
//   password: "",
//   remainingHours: 0,
// };

// export const useUserStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: defaultUser,
//       setUser: (user: User) => {set({ user })},
//       clearUser: () => {set({ user: defaultUser })},
//     }),

//     {
//       name: 'user-store', 
//       partialize: (state) => {
//         const { user } = state;
//         const { password, ...userWithoutPassword } = user; 
//         return { user: userWithoutPassword };
//       },
//     }
//   )
// );





// interface AuthState {
//   user: User;
//   getUser: () => Promise<any>; 
//   setUser: (user: any) => void;
//   clearUser: () => void;
// }

// const defaultUser: User = {
//   _id: "",
//   firstName: "לא מחובר",
//   lastName: "",
//   address: "",
//   gender: "",
//   email: "",
//   phoneNumber: "",
//   dateOfBirth: "",
//   password: "",
//   remainingHours: 0,
// };

// export const useUserStore = create<AuthState>((set, get) => ({
//   // user: null,
//   user : defaultUser,
//   getUser: async () => {
//     const state = get(); 
//     console.log(state);
    
//     // If user is already set, return it
//     if (state.user !== defaultUser) {
//       return state.user;
//     } else {
//       try {
//         // Try to fetch user from localStorage
//         const userId = localStorage.getItem("UserId");
//         if (userId) {
//           const user = await getUserById(userId); 
//           set({ user }); 
//           return user;
//         } else {
//           console.error("UserId not found in localStorage");
//           set({ user: defaultUser });
//           return defaultUser; 
//         }
//       } catch (error) {
//         console.error("Failed to fetch user:", error);
//         set({ user: defaultUser });
//         return defaultUser; 
//       }
//     }
//   },
//   setUser: (user: User) => {
//     if (user?._id) {
//       localStorage.setItem("UserId", user._id as string);
//     }
//     set({ user }); 
//   },
//   clearUser: () => {
//     localStorage.removeItem("UserId"); 
//     set({ user: defaultUser }); 
//   },
// }));

//gpt proposed:
// import { create } from 'zustand';

// interface AuthState {
//   user: User;
//   isLoading: boolean;
//   getUser: () => Promise<void>; // fetch user data
//   setUser: (user: User) => void;
//   clearUser: () => void;
// }

// const defaultUser: User = {
//   _id: "",
//   firstName: "לא מחובר",
//   lastName: "",
//   address: "",
//   gender: "",
//   email: "",
//   phoneNumber: "",
//   dateOfBirth: "",
//   password: "",
//   remainingHours: 0,
// };

// export const useUserStore = create<AuthState>((set) => ({
//   user: defaultUser,
//   isLoading: true,
//   getUser: async () => {
//     const userId = localStorage.getItem("UserId");

//     if (userId) {
//       try {
//         const user = await fetchUserFromDatabase(userId); // Assume this is a function to fetch user data
//         set({ user, isLoading: false });
//       } catch (error) {
//         console.error("Failed to fetch user:", error);
//         set({ user: defaultUser, isLoading: false });
//       }
//     } else {
//       set({ user: defaultUser, isLoading: false });
//     }
//   },
//   setUser: (user: User) => {
//     if (user?._id) {
//       localStorage.setItem("UserId", user._id);
//     }
//     set({ user });
//   },
//   clearUser: () => {
//     localStorage.removeItem("UserId");
//     set({ user: defaultUser });
//   },
// }));

// // Call getUser when the store is initialized to fetch the user
// useUserStore.getState().getUser();




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
  // const initializeUser = async () => {
  //   if (typeof window !== 'undefined') {

  //     let userId;

  //     if (typeof window !== 'undefined') {
  //       userId = localStorage.getItem("UserId");
  //     }

  //     if (userId) {
  //       try {
  //         const user = await fetchUserFromDatabase(userId);
  //         set({ user });
  //       } catch (error) {
  //         console.error("Failed to fetch user:", error);
  //       }
  //     }
  //   }
  // };

  // // Initialize the user when the store is created
  // initializeUser();

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





