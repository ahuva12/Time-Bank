"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "../../../public/images/logo.gif";
import { useState } from "react";
import Link from "next/link";
import { UserMenu, ExplanationPage } from "@/components";

export default function HeaderLogin() {
  const [isExplanationPage, setIsExplanationPage] = useState<boolean>(false);
  const [explanationPageMeassge, setExplanationPageMeassge] = useState<null | string>(null);

  const handleOnMouseEnter = (page:string) : void => {
    let explanation = null;
    switch (page) {
      case 'all-activities':
        explanation = 'כאן תוכל להתרשם מכל הפעילויות שהחברים הציעו ו"לקנות" את הפעילות המועדפת עליך';
        break; 
      case 'give':
        explanation = 'כאן תוכל לעקוב אחר התרומה שלך - הפעילויות שהצעת ונתפסו, הפעילויות שעדיין ממתינות לחבר שיתפוס אותן, ולהציע פעילות חדשה כמובן:)';
        break; 
    }
    setExplanationPageMeassge(explanation);
    setIsExplanationPage(true);
  }  

  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <UserMenu />

        <Link href="/home" className={styles.navItem}>
          דף הבית
        </Link>
        <Link href="/all-activities" className={styles.navItem} 
          onMouseEnter={() => handleOnMouseEnter('all-activities')}
          onMouseLeave={() => setIsExplanationPage(false)}>
          פעילויות
        </Link>
        <Link href="/give" className={styles.navItem}
          onMouseEnter={() => handleOnMouseEnter('give')}
          onMouseLeave={() => setIsExplanationPage(false)}>
          לתת
        </Link>
      </nav>
      {isExplanationPage && explanationPageMeassge && 
        <div className={styles.containerExplanationPage}>
          <ExplanationPage explanation={explanationPageMeassge}/>
        </div>
      }
      <Image
        className={styles.logo}
        src={logo}
        alt="Logo"
        width={200}
        height={100}
      />
    </header>
  );
}