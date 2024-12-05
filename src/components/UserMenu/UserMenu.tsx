'use client';
import styles from './UserMenu.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from "@/store/useUserStore";

export default function UserMenu({ logout }: { logout: Function }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const clearUser = useUserStore((state) => state.clearUser);
    const { user } = useUserStore();

    const handleLogout = () => {
        clearUser(); // Clear user data from Zustand store
        alert("Logged out successfully!");
        logout();
        window.location.href = "/home"; // Redirect to login page
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleRedirect = (path: string) => {
        router.push(path); // Redirect to the specified route
        setIsOpen(false);
    };

    return (
        <div className={styles.profileContainer}>
            {/* Profile Icon */}
            <div className={styles.userMenu} onClick={toggleDropdown}>
                <div className={styles.profileIcon}></div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <ul>
                        <li className={`${styles.welcomeItem} ${styles.noHover}`}>
                            <div>
                                שלום&nbsp; 
                                <span style={{fontWeight: "bold"}}>{user?.firstName}</span>
                            </div>
                            <div>
                                יתרת השעות שלי:&nbsp; 
                                <span>{user?.remainingHours}</span>
                            </div>
                        </li>
                        <li onClick={() => handleRedirect('profile')}>פרופיל</li>
                        <li onClick={() => handleRedirect('history')}>היסטוריה</li>
                        <li onClick={() => handleRedirect('saved_activities')}>פעילויות שמורות</li>
                        <li onClick={() => handleRedirect('my_donation')}>התרומה שלי</li>
                        <li onClick={handleLogout}>התנתקות</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
