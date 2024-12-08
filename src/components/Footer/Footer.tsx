'use client';
import styles from './Footer.module.css'
import Image from 'next/image';
import logo from '../../../public/images/logo.gif';


export default function Footer() {
    return (
      <footer className={styles.footer}>
         <div className={styles.contactInfo}>
            <h3>יצירת קשר</h3>
            <div className={styles.contactlist}>
                <p>דוא"ל: <a href="mailto:Timebank@gmail.com">Timerepublic@gmail.com</a></p>
                <p>טלפון: 03-1234567</p>
                <p>כתובת: רחוב הדוגמה 12, תל אביב</p>
            </div>
        </div>
        <div className={styles.socialLinks}>
            <h3>עקבו אחרינו</h3>
            <div className={styles.links}>
                <a href="https://www.instagram.com" className={styles.icon}>Instagram</a>
                <a href="https://www.facebook.com" className={styles.icon}>Facebook</a>
                <a href="https://www.youtube.com" className={styles.icon}>YouTube</a>
            </div>
            <Image className={styles.logo} src={logo} alt="Logo" width={150} height={75} />
        </div>
      </footer>
    );
  }