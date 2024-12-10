'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './UserMenu.module.css';
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/store/useUserStore";
import { CiUser } from "react-icons/ci";
import { useAuthStore } from '@/store/authStore';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); 
    const router = useRouter();
    const clearUser = useUserStore((state) => state.clearUser);
    const { user } = useUserStore();
    const { logout, isLoggedIn } = useAuthStore();

    const handleLogout = () => {
        clearUser(); // Clear user data from Zustand store
        logout();
        router.push('/home'); 
        alert("Logged out successfully!");
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleRedirect = (path: string) => {
        router.push(path); // Redirect to the specified route
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.profileContainer} ref={dropdownRef}>
            {/* Profile Icon */}
            <div className={styles.userMenu} onClick={toggleDropdown}>
                <div className={styles.profileIcon}>
                    <CiUser className={styles.icon} />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <ul>
                        <li className={`${styles.welcomeItem} ${styles.noHover}`}>
                            <div>
                                שלום,&nbsp;
                                <span style={{ fontWeight: 'bold' }}>{user.firstName}!</span>
                            </div>
                            <div>
                                יתרת השעות שלי:&nbsp;
                                <span style={{ fontWeight: 'bold' }}>{user.remainingHours}</span>
                            </div>
                        </li>
                        <li onClick={() => handleRedirect('profile')}>פרופיל</li>
                        <li onClick={() => handleRedirect('history')}>היסטוריה</li>
                        <li onClick={() => handleRedirect('saved_activities')}>פעילויות שמורות</li>
                        <li onClick={handleLogout}>התנתקות</li>
                    </ul>
                </div>
            )}
        </div>
    );
}