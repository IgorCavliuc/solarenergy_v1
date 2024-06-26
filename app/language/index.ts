import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import { en } from "./en";
import { ro } from "./ro";
import { ru } from "./ru";

const languageState = localStorage.getItem("lang");

i18n.use(initReactI18next).init({
  lng: `${languageState}`,
  resources: {
    en: {
      translation: { ...en },
    },
    ro: {
      translation: { ...ro },
    },
    ru: {
      translation: { ...ru },
    },
  },
  keySeparator: false,
  interpolation: { escapeValue: false },
});

export default i18n;
