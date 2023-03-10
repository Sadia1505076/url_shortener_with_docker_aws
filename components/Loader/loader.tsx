import React from "react";
import styles from '@/components/Loader/Loader.module.css';

export default function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  );
}