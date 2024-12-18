"use client";
import Image from "next/image";
import styles from "./home.module.css";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState, useEffect } from "react";
import { Register, Login } from "@/components";

export default function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const toggleLogin = () => setIsLoginOpen((prev) => !prev);
  const toggleRegister = () => setIsRegisterOpen((prev) => !prev);
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.textContent}>
          <h1>ברוכים הבאים לבנק הזמן</h1>
          <h2 className={styles.highlight}>מקום שבו הזמן שלך שווה כסף!</h2>
          <p>חווה את כוחה של הקהילה באמצעות בנק הזמן</p>
        </div>
        <div className={styles.imagePeople}>
          <DotLottieReact
            src="https://lottie.host/d78d1121-c0f2-4286-b4d5-229df5f1d853/z4Tmc7w554.lottie"
            loop
            autoplay
          />
        </div>
      </header>
      <section className={styles.sectionExplation}>
        <div>
          <h2>מה זה בנק הזמן?</h2>
          <p>
            בנק זמן הוא מערכת שמאפשרת לאנשים להעניק שירותים אחד לשני, כאשר כל
            שעה של זמן היא שוות ערך, ללא קשר לסוג השירות. כל שעה שאתה מקדיש
            למישהו אחר, ניתן להמיר לשעה של עזרה או שירות ממישהו אחר בתמורה.
            במקום להשתמש בכסף כיחידת ערך, בבנק הזמן אנו משתמשים בשעות. כל שעה של
            עבודה נחשבת שווה לשעה של שירות אחר.
          </p>
        </div>
      </section>

      <div className={styles.cardWrapper}>
        {[
          {
            number: "1",
            title: "הצטרף",
            description: "הירשם לאתר בנק הזמן שלנו ופתח פרופיל אישי.",
          },
          {
            number: "2",
            title: "הצע שירותים",
            description:
              "הצע את הזמן שלך לאחרים! אולי אתה יכול לעזור בהוראה פרטית, סיוע טכני, בישול, תיקונים בבית או כל דבר אחר.",
          },
          {
            number: "3",
            title: "התחל להרוויח",
            description:
              "כל שעה שתשקיע בשירותים תצבר לך שעות בבנק הזמן, שתוכל להמיר לשירותים אחרים.",
          },
          {
            number: "4",
            title: "השתמש בשעות שלך",
            description:
              "כשתצטרך עזרה, תוכל להשתמש בשעות שצברת על מנת לקבל שירותים מכל חברי הקהילה.",
          },
        ].map((card, index) => (
          <div key={index} className={styles.startCard}>
            <div className={styles.cardHover}>
              <span className={styles.cardNumber}>{card.number}</span>
              <span className={styles.cardName}>{card.title}</span>
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.cardOcupation}>{card.description}</span>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.sectionJoin}>
        <h2>למה כדאי להצטרף?</h2>
        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <h3>הזדמנויות למידה:</h3>
            <p>
              כל אדם שמציע שירות בבנק הזמן יכול ללמוד ולהתנסות במגוון תחומים.
            </p>
          </div>
          <div className={styles.benefit}>
            <h3>קהילה תומכת:</h3>
            <p>
              הצטרפות לבנק הזמן מאפשרת לך להיות חלק מקהילה שבה כולם עוזרים אחד
              לשני
            </p>
          </div>
          <div className={styles.joinImage}>
            <DotLottieReact
              src="https://lottie.host/652f1eef-42fd-46ef-93a1-04f9af2e31c7/gexAMOMsHK.lottie"
              loop
              autoplay
            />
          </div>
          <div className={styles.benefit}>
            <h3>גמישות:</h3>
            <p>
              קבע את שעות הפעילות שלך ואת השירותים שאתה מציע, וכל אחד יכול
              להשתמש בשירותים שלך לפי הצורך.
            </p>
          </div>
          <div className={styles.benefit}>
            <h3>חיסכון כספי:</h3>
            <p>ניתן לקבל שירותים מבלי לשלם כסף – כל מה שצריך זה זמן.</p>
          </div>
        </div>
      </section>

      <section className={styles.sectionStartNow}>
        <button className={styles.btnStart} onClick={toggleRegister}>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
          <span>התחל עכשיו</span>
        </button>
        <p>צור חשבון, אסוף את השעות שלך ומצא מישהו שמוכן לעזור לך.</p>
        <p>אנו ממליצים לך להתחיל בפרסום בקשה, כדי שתבין איך התהליך עובד.</p>
        <p>מהר מאוד תגלה שאתה בקהילה שבה אמון ועזרה הולכים יד ביד.</p>
      </section>
      {/* Pop-up for Login */}
      {isLoginOpen && (
        <div className={styles.popup}>
          {/* <div className={styles.popupContent}> */}
            {/* <button className={styles.closeButton} onClick={toggleLogin}>
              ×
            </button> */}
            <Login
              closePopup={toggleLogin}
              setIsRegisterOpen={setIsRegisterOpen}
              setIsLoginOpen={setIsLoginOpen}
            />
          {/* </div> */}
        </div>
      )}

      {/* Pop-up for Signup */}
      {isRegisterOpen && (
        <div className={styles.popup}>
          {/* <div className={styles.popupContent}> */}
            {/* <button className={styles.closeButton} onClick={toggleRegister}>
              ×
            </button> */}
            <Register
              closePopup={toggleRegister}
              setIsLoginOpen={setIsLoginOpen}
            />
          {/* </div> */}
        </div>
      )}
    </div>
  );
}
