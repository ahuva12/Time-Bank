// 'use client';
// import styles from './Loader.module.css';

// const Loader = () => {
//     return (
//         <div className={styles.loader}>טוען נתונים...</div>
//     )
// }

// export default Loader;
"use client";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import styles from './Loader.module.css';
const Loader = () => {
  return (
    <div className={styles.loader}>
      <DotLottieReact className={styles.animation}
        src="https://lottie.host/5f587e06-b7a4-4b15-b4b1-0a485bd6dd58/DCuzCbd9kD.lottie"
        loop
        autoplay
      />
    </div>
  );
};
export default Loader;
