"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "../../../public/images/logo.gif";
import { useState } from "react";
import { Login, Register } from "@/components";

export default function HeaderLogout() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toggleLogin = () => setIsLoginOpen((prev) => !prev);
  const toggleRegister = () => setIsRegisterOpen((prev) => !prev);

  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <button className={styles.btnLogin} onClick={toggleLogin}>
          כניסה
        </button>
        <button className={styles.btnSignup} onClick={toggleRegister}>
          הרשמה
        </button>
      </nav>
      <Image
        className={styles.logo}
        src={logo}
        alt="Logo"
        width={200}
        height={100}
      />

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