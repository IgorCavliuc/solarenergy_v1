"use client";

import React from "react";
import styles from "./styles.module.scss";

export const Column = ({ title, children, controls }: any) => {
  return (
    <div className={styles.column}>
      <div className={styles.header}>
        {title && <p className={styles.title}>{title}</p>}
        {controls}
      </div>
      {children}
    </div>
  );
};
