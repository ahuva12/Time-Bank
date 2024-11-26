'use client'
import { useAuthStore } from '@/store/authStore';
import styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';

import UserMenu from '../UserMenu/UserMenu';
import logo from '../../../public/images/logo.gif';

export default function Header() {
    const { isLoggedIn, logout, login } = useAuthStore();

    return (
        <header className={styles.header}>
            {isLoggedIn ? (
                <nav className={styles.navigation}>
                    {/* <div className={styles.wrapper}> */}
                    <UserMenu />
                    <Link href="/home" className={styles.navItem}>דף הבית</Link>
                    <Link href="/activities" className={styles.navItem}>פעילויות</Link>
                    <Link href="/give" className={styles.navItem}>לתת</Link>
                    {/* </div> */}
                </nav>
            ) : (
                <nav className={styles.navigation}>
                    <button className={styles.btnLogin}><a href="/login">כניסה</a></button>
                    <button className={styles.btnSignup}><a href="/signup">הרשמה</a></button>
                    <div><button onClick={login}>Simulate Login</button></div>
                </nav>
            )}
            <Image className={styles.logo} src={logo} alt="Logo" width={150} height={75} />

        </header>
    );
}
