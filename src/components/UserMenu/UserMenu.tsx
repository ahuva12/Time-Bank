
"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./UserMenu.module.css";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import { CiUser } from "react-icons/ci";
import SuccessMessage from "../SuccessMessage/SuccessMessage";

export default function UserMenu({ logout }: { logout: Function }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const { user } = useUserStore();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message

  const handleLogout = () => {
    clearUser(); // Clear user data from Zustand store
    logout(); // Log the user out
    router.push("/"); // Redirect to the home page after logout
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle OK click from SuccessMessage
  const handleOkClick = () => {
    setShowSuccessMessage(false); // Hide success message
    handleLogout(); // Perform logout and redirect to home
  };

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
                <span><strong>{user ? user.firstName : "משתמש"}</strong></span>
              </div>
              <div>
                יתרת השעות שלי:&nbsp;
                <span><strong>{user ? user.remainingHours : "אין נתונים"}</strong></span>
              </div>
            </li>
            <li onClick={() => handleRedirect("profile")}>פרופיל</li>
            <li onClick={() => handleRedirect("history")}>היסטוריה</li>
            <li onClick={() => handleRedirect("saved_activities")}>
              פעילויות שמורות
            </li>
            <li onClick={() => setShowSuccessMessage(true)}>התנתקות</li>
          </ul>
        </div>
      )}

      {/* Show Success Message with OK button */}
      {showSuccessMessage && (
        <SuccessMessage
          message_line1="התנתקת בהצלחה!"
          message_line2="נשמח לראותך שוב בקרוב."
          onOkClick={handleOkClick} // Pass the handleOkClick function as a prop
        />
      )}
    </div>
  );
}
