import React from "react";
import styles from "./styles.module.scss";

export const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <p className={styles.logo}>
          Solar<span>Energy</span>
        </p>
      </div>
    </div>
  );
};
