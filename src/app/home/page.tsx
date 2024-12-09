"use client";

import Image from "next/image";
import styles from "./home.module.css";
export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.textContent}>
          <h1>ברוכים הבאים לבנק הזמן</h1>
          <h2 className={styles.highlight}>מקום שבו הזמן שלך שווה כסף!</h2>
          <p>חווה את כוחה של הקהילה באמצעות בנק הזמן</p>
        </div>
        <Image
          src="/images/people.png"
          alt="חברים מחובקים"
          width={300}
          height={200}
          className={styles.imagePeople}
        />
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

      <section className={styles.sectionStart}>
        <h2>איך מתחילים:</h2>
        <div className={styles.steps}>
          {[
            "הצטרף: הירשם לאתר בנק הזמן שלנו ופתח פרופיל אישי.",
            " הצע שירותים: הצע את הזמן שלך לאחרים! אולי אתה יכול לעזור בהוראה פרטית, סיוע טכני, בישול, תיקונים בבית או כל דבר אחר.",
            "התחל להרוויח: כל שעה שתשקיע בשירותים תצבר לך שעות בבנק הזמן, שתוכל להמיר לשירותים אחרים. ",
            " השתמש בשעות שלך: כשתצטרך עזרה, תוכל להשתמש בשעות שצברת על מנת לקבל שירותים מכל חברי הקהילה.",
          ].map((text, index) => (
            <div key={index} className={styles.step}>
              <h3>{index + 1}</h3>
              <p>
                <strong>{text.split(":")[0]}:</strong>
                <br />
                {text.split(":")[1]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.sectionJoin}>
        <h2>למה כדאי להצטרף?</h2>
        <div className={styles.benefits}>
        <div className={styles.joinImage}>
            <Image
              src="/images/heands.png"
              alt="hands"
              width={150}
              height={150}
              className={styles.image}
            />
          </div>

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
        <h2>התחל עכשיו!</h2>
        <p>צור חשבון, אסוף את השעות שלך ומצא מישהו שמוכן לעזור לך.</p>
        <p>אנו ממליצים לך להתחיל בפרסום בקשה, כדי שתבין איך התהליך עובד.</p>
        <p>מהר מאוד תגלה שאתה בקהילה שבה אמון ועזרה הולכים יד ביד.</p>
      </section>
    </div>
  );
}
