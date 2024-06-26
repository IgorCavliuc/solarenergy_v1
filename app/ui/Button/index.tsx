"use client";

import React from "react";
import classnames from "classnames";
import styles from "./styles.module.scss";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type ButtonType = "primary" | "secondaryGray";

export const Button = ({
  component = "button",
  disabled = false,
  buttonSize = "md",
  buttonType = "primary",
  className,
  children,
  onClick,
  ...props
}: any) => {
  return (
    <button
      className={classnames(
        className,
        styles.button,
        styles[buttonSize as any],
        styles[buttonType as any],
        {
          [styles.disabled]: disabled,
        },
      )}
      onClick={() => (disabled ? null : onClick())}
    >
      {children}
    </button>
  );
};
