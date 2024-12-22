"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "../../../public/images/logo.gif";

export default function HeaderLoading() {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation}></nav>
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