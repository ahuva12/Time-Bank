'use client';
import { useState } from "react";
import { http } from "@/services/http";
import useUserStore from "@/store/useUserStore";
import Styles from './Login.module.css'
import { useRouter } from 'next/navigation';

export default function Login({login, closePopup, setIsRegisterOpen}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await http.post("/login", { email, password });
      console.log(response.data.user)
      // Store user details in Zustand
      setUser(response.data.user); // Assuming `response.data.user` contains the user's details
      // localStorage.setItem('UserId', response.data.user._id);
      login();
      closePopup();
      router.push('home'); 
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const goRegister = () => {
    closePopup();
    setIsRegisterOpen(true); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={Styles.container}>
        <h1 className={Styles.title}>התחברות</h1>
      <input className={Styles.inputFields}
        type="email"
        placeholder="אמייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input className={Styles.inputFields}
        type="password"
        placeholder="סיסמא"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className={Styles.innerDiv}>
        <button className={Styles.button} type="submit">כניסה</button>
        <div style={{marginLeft: '50px'}}>
      <p className={Styles.registerText}>
          אין לך חשבון?{' '}
          <span
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={goRegister}
          >
            הירשם
          </span>{' '}
          במקום.
        </p>
        </div>
      </div>
      {error && <p>{error}</p>}
      </div>
    </form>
  );
}








// import React from 'react';

// const LoginPage = () => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add your login logic here
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
//       <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg shadow-blue-100/50">
//         <h1 className="text-2xl font-bold text-right mb-8 text-gray-800">כניסה</h1>
        
//         <form /*onSubmit={handleSubmit}*/ className="space-y-6">
//           <div className="space-y-4">
//             <input
//               type="email"
//               placeholder="אימייל"
//               className="w-full px-4 py-3 rounded-lg bg-blue-50/50 border border-blue-100 
//                          text-right focus:outline-none focus:ring-2 focus:ring-blue-200 
//                          transition duration-200 text-gray-700 placeholder-gray-400"
//               required
//             />
            
//             <input
//               type="password"
//               placeholder="סיסמא"
//               className="w-full px-4 py-3 rounded-lg bg-blue-50/50 border border-blue-100 
//                          text-right focus:outline-none focus:ring-2 focus:ring-blue-200 
//                          transition duration-200 text-gray-700 placeholder-gray-400"
//               required
//             />
//           </div>

//           <div className="flex justify-end">
//             <a href="#" className="text-sm text-cyan-600 hover:text-cyan-700 transition duration-200">
//               ?אין לך חשבון
//             </a>
//           </div>
          
//           <button 
//             type="submit"
//             className="w-full bg-cyan-500 text-white py-3 rounded-lg font-medium
//                      hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 
//                      focus:ring-offset-2 transform transition duration-200 hover:scale-[0.99]"
//           >
//             כניסה
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;