"use client";

import React from "react";
import styles from "./styles.module.scss";

export const Row = ({ title, children }: any) => {
  return (
    <div className={styles.row}>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.children}>{children}</div>
    </div>
  );
};
