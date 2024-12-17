"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./UserMenu.module.css";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { CiUser } from "react-icons/ci";
import { useAuthStore } from "@/store/authStore";
import { SuccessMessage } from '@/components';
import { CgProfile } from "react-icons/cg";
import { FaRegStar } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const { user } = useUserStore();
  const { setLogout } = useAuthStore();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleRedirect = (path: string) => {
    router.push(path);
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

  const handleLogOut = () => {
    clearUser();
    setShowSuccessMessage(true); 
  }

  
  const handleOkClick = () => {
    setLogout();
    router.push('/home')
  }

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
          <div className={styles.card}>
            <ul className={styles.list}>
              <li className={`${styles.staticElement} ${styles.noHover}`}>
                <div className={styles.label}>
                  <p className={styles.hello}>
                    שלום,&nbsp;
                    <span>{user ? user.firstName : "משתמש"}</span>
                  </p>
                  <p className={styles.hours}>
                    יתרת השעות שלי:&nbsp;
                    <span>
                      <strong>
                        {user ? user.remainingHours : "אין נתונים"}
                      </strong>
                    </span>
                  </p>
                </div>
              </li>
            </ul>
            <div className={styles.separator}></div>

            <ul className={styles.list}>
              <li
                className={styles.element}
                onClick={() => handleRedirect("profile")}
              >
                <CgProfile />
                <p className={styles.label}>פרופיל</p>
              </li>
              <li
                className={styles.element}
                onClick={() => handleRedirect("history")}
              >
                <FaHistory />
                <p className={styles.label}>היסטוריה</p>
              </li>
              <li
                className={styles.element}
                onClick={() => handleRedirect("saved_activities")}
              >
                <FaRegStar />
                <p className={styles.label}>פעילויות שמורות</p>
              </li>
            </ul>

            <div className={styles.separator}></div>

            <ul className={styles.list}>
              <li
                className={styles.logOut}
                onClick={handleLogOut}
              >
                <TbLogout className={styles.outLogo} />
                <p className={styles.label}>התנתקות</p>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Show Success Message with OK button */}
      {showSuccessMessage && (
        <SuccessMessage
          message_line1="התנתקת בהצלחה!"
          message_line2="נשמח לראותך שוב בקרוב:)"
          onOkClick={handleOkClick} 
        />
      )}
    </div>
  );
}
