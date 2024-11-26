'use client';
import styles from './UserMenu.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleRedirect = (path: string) => {
      router.push(path); // Redirect to the specified route
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
                        <li onClick={() => handleRedirect('profile')}>פרופיל</li>
                        <li onClick={() => handleRedirect('history')}>היסטוריה</li>
                        <li onClick={() => handleRedirect('saved')}>שמורים</li>
                        <li onClick={() => handleRedirect('logout')}>התנתקות</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
