"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "../../../public/images/logo.gif";
import { useState } from "react";
import { Login, Register } from "@/components";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/authStore";
import { getUserByEmail } from "@/services/users";
import {MiniLoader, ErrorMessage, } from "@/components";

export default function HeaderLogout() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { setLogin } = useAuthStore();
  const { setUser } = useUserStore();
  const [isLoader, setIsLoader] = useState(false);
  const [errorServer, setErrorServer] = useState(false);

  const toggleLogin = () => setIsLoginOpen((prev) => !prev);
  const toggleRegister = () => setIsRegisterOpen((prev) => !prev);

  const handleExampleUser = async () => {
      try {
        setIsLoader(true);
        const user = await getUserByEmail('israelIsraeli@gmail.com');
        console.log(user)
  
        if (user.length === 0) {
          throw new Error("user not found");
        }  
        setUser(user[0]);
        setLogin();

      } catch (error: any) {
        if (error.message.includes("Error updating user")) {
        } else {
          setErrorServer(true);
        }
      } finally {
        setIsLoader(false);
      }
    };

  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <button className={styles.btnLogin} onClick={toggleLogin}>
          כניסה
        </button>
        <button className={styles.btnSignup} onClick={toggleRegister}>
          הרשמה
        </button>
        <button className={styles.btnExampleUser} onClick={handleExampleUser}>
          משתמש לדוגמא
        </button>
      </nav>
      <Image
        className={styles.logo}
        src={logo}
        alt="Logo"
        width={200}
        height={100}
      />

      {isLoader && (
        <div className={styles.loader}>
          <MiniLoader />
        </div>
      )}
      {errorServer && (
        <ErrorMessage
          message_line1="שגיאה בהתחברות"
          message_line2="נסה שוב בעוד מספר דקות"
          message_line3="או נסה להתחבר עם מייל אחר"
          onOkClick={() => setErrorServer(false)}
        />
      )}

      {/* Pop-up for Login */}
      {isLoginOpen && (
        <div className={styles.popup}>
          <Login
            closePopup={toggleLogin}
            setIsRegisterOpen={setIsRegisterOpen}
            setIsLoginOpen={setIsLoginOpen}
          />
        </div>
      )}

      {/* Pop-up for Signup */}
      {isRegisterOpen && (
        <div className={styles.popup}>
          <Register
            closePopup={toggleRegister}
            setIsLoginOpen={setIsLoginOpen}
          />
        </div>
      )}
    </header>
  );
}