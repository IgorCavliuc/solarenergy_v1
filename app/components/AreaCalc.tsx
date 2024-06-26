import { useTranslation } from "react-i18next";
import React, { useCallback, useState } from "react";
import { Row } from "@/app/ui/Row"; // Предположим, что это компонент для ряда элементов
import { SelectCustom } from "@/app/ui/SelectCustom"; // Предположим, что это кастомный селектор
import { Input } from "@/app/ui/Input"; // Предположим, что это компонент ввода
import styles from "@/app/styles.module.scss"; // Предположим, что это ваши стили
import { Button } from "@/app/ui/Button";
import { replaceNumberFormat } from "@/utils";

export const AreaCalc = ({
  contact,
  setErrors,
  setIsModalOpen,
  selectPanel,
  setSelectPanel,
  roofAreaArray,
  solarPanelArray,
  setLoading,
}: any) => {
  const { t } = useTranslation(); // Хук для использования i18n для переводов

  // Состояния для хранения данных
  const [results, setResults] = useState({
    panelsNeeded: 0,
    totalCost: 0,
    annualSavings: 0,
    canInstallPanels: false,
    totalPanelArea: 0,
    farmArea: 0,
    paybackPeriod: 0,
  }); // Результаты расчета

  const [state, setState] = useState({
    sunlightHoursPerDay: 5,
    costPerKWhMDL: 2,
    farmLength: 100,
    farmWidth: 100,
  }); // Входные данные о ферме

  const [changedValues, setChangedValues] = useState<any>({});

  // Функция для обработки изменений в форме
  const handleChange = (key: string, value: string) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    setChangedValues((prevValues: any) => {
      const updatedValues = { ...prevValues };
      let currentChangedLevel = updatedValues;
      if (!currentChangedLevel[key]) {
        currentChangedLevel[key] = typeof key === "number" ? [] : {};
      }
      currentChangedLevel = currentChangedLevel[key];

      currentChangedLevel[key[key.length - 1]] = value;
      return updatedValues;
    });
  };

  const calcFunc = useCallback(async () => {
    setLoading(true);
    if (!selectPanel) {
      console.error("Please select a solar panel"); // заменил Error на console.error, чтобы код был выполним
      return;
    }

    setChangedValues({});

    try {
      const responsePromise = fetch("/api/area", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectPanel: selectPanel,
          contact: { ...contact },
          ...state,
        }),
      });

      const response = await responsePromise;

      if (!response.ok) {
        const dataRes = await response.json();
        if (dataRes?.error === "Invalid email address") {
          setErrors((prev: any) => ({
            ...prev,
            email: {
              error: true,
              message: "Invalid email address",
              visible: true,
            },
          }));
        }
        throw new Error(dataRes?.error ?? "Failed to fetch data");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error calculating solar panel requirements:", error);
    } finally {
      setLoading(false);
    }
  }, [selectPanel, state, contact, setErrors, setLoading]); // Добавлены setErrors и setLoading в зависимости

  return (
    <>
      {/*<ToastContainer />*/}
      <div className={styles.calc_container_calc}>
        <Row>
          <SelectCustom
            title={t("Выберите подходящую солнечную панель")}
            value={selectPanel}
            onChange={(panel) => {
              setChangedValues((prevValues: any) => ({
                ...prevValues,
                selectPanel: true,
              }));
              setSelectPanel(panel); // Установка выбранной солнечной панели
            }}
            options={solarPanelArray} // Опции для выбора солнечных панелей
          />
        </Row>
        <Row>
          <Input
            label={t("Часы солнечного света в день")}
            inputSize="md"
            value={state.sunlightHoursPerDay}
            placeholder={t("Введите часы")}
            name="sunlightHoursPerDay"
            onChange={(e) =>
              handleChange("sunlightHoursPerDay", e.target.value)
            }
          />
          <Input
            label={t("Стоимость электроэнергии (MDL/кВт*ч)")}
            inputSize="md"
            value={state.costPerKWhMDL}
            placeholder={t("Введите стоимость")}
            name="costPerKWhMDL"
            onChange={(e) => handleChange("costPerKWhMDL", e.target.value)}
          />
        </Row>
        <Row title={t("Введите данные вашей фермы")}>
          <Input
            label={t("Длина фермы (м)")}
            inputSize="md"
            value={state.farmLength}
            placeholder={t("Длина (м)")}
            name="farmLength"
            onChange={(e) => handleChange("farmLength", e.target.value)}
          />
          <Input
            label={t("Ширина фермы (м)")}
            inputSize="md"
            value={state.farmWidth}
            placeholder={t("Ширина (м)")}
            name="farmWidth"
            onChange={(e) => handleChange("farmWidth", e.target.value)}
          />
        </Row>
        <div className={styles.controls}>
          <Button
            buttonType="secondaryGray"
            buttonSize="sm"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Отменить
          </Button>
          <Button
            buttonSize="sm"
            disabled={!Object.keys(changedValues).length}
            onClick={() => {
              calcFunc();
            }}
          >
            {t("Рассчитать")}
          </Button>
        </div>
      </div>
      <div className={styles.calc_container_info}>
        <h2>{t("Таким образом для вашего запроса:")}</h2>
        <p>
          {t("Вам потребуется")}{" "}
          <span>
            {results.panelsNeeded} {t("солнечных панелей.")}{" "}
          </span>
          {t(
            "Вместе с приобретением панелей и их установкой, общая начальная стоимость составляет примерно:",
          )}{" "}
          <span>
            {replaceNumberFormat(String(results?.totalCost))} MDL (&#8776;{" "}
            {replaceNumberFormat(String(+results.totalCost / 19))} EUR)
          </span>
        </p>
        <p>
          {t(
            "Благодаря этому количеству панелей вы сможете каждый год зарабатывать примерно:",
          )}{" "}
          <span>
            {replaceNumberFormat(String(results.annualSavings))} MDL (&#8776;{" "}
            {replaceNumberFormat(String(results.annualSavings / 19))} EUR).
          </span>{" "}
          <br />
          {t(
            "Всю сумму вложений в этот проект вы сможете окупить примерно за",
          )}{" "}
          <span>
            {replaceNumberFormat(String(results?.paybackPeriod))} {t("лет")}
          </span>
        </p>
        <p>
          {t("Основываясь на размере вашей фермы")}{" "}
          <span>
            ({t("площадь")} &#8776; {results.farmArea} м²)
          </span>
          {t("при общей площади всех")}{" "}
          <span>
            {results.panelsNeeded} {t("панелей ≈")} {results.totalPanelArea} м².
          </span>{" "}
        </p>
      </div>
    </>
  );
};
