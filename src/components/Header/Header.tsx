'use client';
import { useAuthStore } from '@/store/authStore';
import styles from './Header.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.gif';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Login, Register, UserMenu} from '@/components'; 

export default function Header() {
  const { isLoggedIn } = useAuthStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  const toggleLogin = () => setIsLoginOpen((prev) => !prev);
  const toggleRegister = () => setIsRegisterOpen((prev) => !prev);


  if (isLoggedIn) {
    return (
        <header className={styles.header}>
            <nav className={styles.navigation}>
              <UserMenu/>

              <Link href="/home" className={styles.navItem}>
              דף הבית
              </Link>
              <Link href="/all_activities" className={styles.navItem}>
              פעילויות
              </Link>
              <Link href="/give" className={styles.navItem}>
                לתת
              </Link>
          </nav>
        <Image className={styles.logo} src={logo} alt="Logo" width={200} height={100} />
      </header>
    );
  } else {
    return (
        <header className={styles.header}>
          <nav className={styles.navigation}>
            <button
              className={styles.btnLogin}
              onClick={toggleLogin}
            >
              כניסה
            </button>
            <button
              className={styles.btnSignup}
              onClick={toggleRegister}
            >
              הרשמה
            </button>
          </nav>
        <Image className={styles.logo} src={logo} alt="Logo" width={200} height={100} />

        {/* Pop-up for Login */}
        {isLoginOpen && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <button
                className={styles.closeButton}
                onClick={toggleLogin}
              >
                ×
              </button>
              <Login closePopup={toggleLogin} 
                      setIsRegisterOpen={setIsRegisterOpen}
                      setIsLoginOpen={setIsLoginOpen}/>
            </div>
          </div>
        )}

        {/* Pop-up for Signup */}
        {isRegisterOpen && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <button
                className={styles.closeButton}
                onClick={toggleRegister}
              >
                ×
              </button>
              <Register closePopup={toggleRegister} setIsLoginOpen={setIsLoginOpen}/>
            </div>
          </div>
        )}
      </header>
    );
  }
}
