
"use client";
import styles from "./Footer.module.css";
import Image from "next/image";
import logo from "../../../public/images/logo.gif";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <Image
          className={styles.logo}
          src={logo}
          alt="Logo"
          width={200}
          height={200}
        />
      </div>
      <div className={styles.links}>
        <a href="https://www.instagram.com" className={styles.link}>
          {" "}
          <FaInstagram />
        </a>
        <span className={styles.separator}>|</span>

        <a href="https://www.facebook.com" className={styles.link}>
          {" "}
          <FaFacebook />
        </a>
        <span className={styles.separator}>|</span>

        <a href="https://www.youtube.com" className={styles.link}>
          {" "}
          <IoLogoYoutube />
        </a>
      </div>

      <div className={styles.bottomText}>
        <p>03-1234567</p>
        <span className={styles.separator}>|</span>
        <p>Timerepublic@gmail.com</p>
      </div>
    </footer>
  );
}
