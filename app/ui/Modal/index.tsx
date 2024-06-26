import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Portal from "@/app/ui/Portal";

const Modal = ({ isOpen, onClose, children }: any) => {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimate(true), 10); // Задержка для плавного появления
    } else {
      setAnimate(false);
      setTimeout(() => setVisible(false), 300); // Задержка перед скрытием
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <Portal>
      <div
        className={`${styles.modalOverlay} ${animate ? styles.fadeIn : styles.fadeOut}`}
        onClick={onClose}
      >
        <div
          className={`${styles.modalContent} ${animate ? styles.slideIn : styles.slideOut}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
