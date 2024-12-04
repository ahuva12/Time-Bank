'use client';
import { useAuthStore } from '@/store/authStore';
import styles from './Header.module.css';
import Image from 'next/image';
import UserMenu from '../UserMenu/UserMenu';
import logo from '../../../public/images/logo.gif';
import Login from '@/components/Login/Login'; 
import Register from '@/components/Register/Register'; 
import { useState } from 'react';

export default function Header() {
  const { isLoggedIn, logout, login, signup } = useAuthStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toggleLogin = () => setIsLoginOpen((prev) => !prev);
  const toggleRegister = () => setIsRegisterOpen((prev) => !prev);

  return (
    <header className={styles.header}>
      {isLoggedIn ? (
          <nav className={styles.navigation}>
            <UserMenu logout={logout} />
            <a href="/home" className={styles.navItem}>דף הבית</a>
            <a href="/activities" className={styles.navItem}>פעילויות</a>
            <a href="/give" className={styles.navItem}>לתת</a>
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
            <Login login={login} closePopup={toggleLogin} setIsRegisterOpen={setIsRegisterOpen}/>
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




// 'use client'
// import { useAuthStore } from '@/store/authStore';
// import styles from './Header.module.css';
// import Link from 'next/link';
// import Image from 'next/image';

// import UserMenu from '../UserMenu/UserMenu';
// import logo from '../../../public/images/logo.gif';

// export default function Header() {
//     const { isLoggedIn, logout, login } = useAuthStore();

//     return (
//         <header className={styles.header}>
//             {isLoggedIn ? (
//                 <nav className={styles.navigation}>
//                     {/* <div className={styles.wrapper}> */}
//                     <UserMenu logout={logout} />
//                     <Link href="/home" className={styles.navItem}>דף הבית</Link>
//                     <Link href="/activities" className={styles.navItem}>פעילויות</Link>
//                     <Link href="/give" className={styles.navItem}>לתת</Link>
//                     {/* </div> */}
//                 </nav>
//             ) : (
//                 <nav className={styles.navigation}>
//                     <button className={styles.btnLogin}><a href="/login">כניסה</a></button>
//                     <button className={styles.btnSignup}><a href="/signup">הרשמה</a></button>
//                     <div><button onClick={login}>Simulate Login</button></div>
//                 </nav>
//             )}
//             <Image className={styles.logo} src={logo} alt="Logo" width={200} height={100} />

//         </header>
//     );
// }
