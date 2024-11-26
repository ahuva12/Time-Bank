import { useState } from "react";

export default function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token); // Store JWT token
      window.location.href = "/"; // Redirect to /
    } else {
      setError(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
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