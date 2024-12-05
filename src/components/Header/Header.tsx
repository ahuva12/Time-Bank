'use client';
import { useAuthStore } from '@/store/authStore';
import styles from './Header.module.css';
import Image from 'next/image';
import UserMenu from '../UserMenu/UserMenu';
import logo from '../../../public/images/logo.gif';
import { Login, Register} from '@/components'; 
import { useState, useEffect  } from 'react';
import Link from 'next/link';

export default function Header() {
  const { isLoggedIn, logout, login, signup } = useAuthStore();
  const [isClient, setIsClient] = useState(false); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [])

  const toggleLogin = () => setIsLoginOpen((prev) => !prev);
  const toggleRegister = () => setIsRegisterOpen((prev) => !prev);

  if (!isClient) {
    return null; 
  }

  return (
    <header className={styles.header}>
      {isLoggedIn ? (
          <nav className={styles.navigation}>
            <UserMenu logout={logout} />
            <Link href="/home" className={styles.navItem}>
            דף הבית
            </Link>
            <Link href="/activities" className={styles.navItem}>
            פעילויות
            </Link>
            <Link href="/give" className={styles.navItem}>
              לתת
            </Link>
        </nav>
      ) : (
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
      )}
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
            <Login closePopup={toggleLogin} setIsRegisterOpen={setIsRegisterOpen}/>
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

