'use client'
import { useAuthStore } from '@/store/authStore';
import styles from './Header.module.css';

export default function Header() {
    const { isLoggedIn, logout, login } = useAuthStore();

    return (
        <header>
            {isLoggedIn ? (
                <nav className={styles.nav}>
                    <div><a href="/dashboard">Dashboard</a></div>
                    <div><a href="/profile">Profile</a></div>
                    <div><button onClick={logout}>Logout</button></div>
                </nav>
            ) : (
                <nav>
                    <ul>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/signup">Sign Up</a></li>
                        <li><button onClick={login}>Simulate Login</button></li>
                    </ul>
                </nav>
            )}
        </header>
    );
}
