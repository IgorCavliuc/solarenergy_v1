"use client";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const LanguageSwitcher = ({ t, lang }: any) => {
  const [language, setLanguage] = useState("en");
  const { i18n } = useTranslation();

  useEffect(() => {
    const langState = localStorage.getItem("lang");
    setLanguage(String(langState));
  }, []);

  const langChange = (e: any) => {
    const selectedLang = e;
    localStorage.setItem("lang", selectedLang);
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  const languageArray = ["en", "ro", "ru"];

  return (
    <div className={styles.language_switcher}>
      {languageArray?.map((el, index) => (
        <p
          key={index}
          className={language === el ? styles.active_language : ""}
          // onClick={() => langChange(el)}
        >
          {el.toUpperCase()}
        </p>
      ))}
    </div>
  );
};
