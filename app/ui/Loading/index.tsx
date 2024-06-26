import * as React from "react";
import styles from "./styles.module.scss";
import { PuffLoader } from "react-spinners";

export const Loading = ({ label, size = 40 }: any) => {
  return (
    <div className={styles.container}>
      <PuffLoader color={"#fff"} />
      {label && <p>{label}</p>}
    </div>
  );
};
