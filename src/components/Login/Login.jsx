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
