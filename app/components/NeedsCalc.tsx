import { useTranslation } from "react-i18next";
import React, { useCallback, useState } from "react";
import { Row } from "@/app/ui/Row";
import { SelectCustom } from "@/app/ui/SelectCustom";
import { Input } from "@/app/ui/Input";
import styles from "@/app/styles.module.scss";
import { Button } from "@/app/ui/Button";
import { toast } from "react-toastify";

export const NeedsCalc = ({
  contact,
  setErrors,
  setIsModalOpen,
  selectPanel,
  setSelectPanel,
  roofAreaArray,
  solarPanelArray,
  setLoading,
}: any) => {
  const { t } = useTranslation();
  const [changedValues, setChangedValues] = useState<any>({});

  const [roofType, setRoofType] = useState({
    label: t("Двускатная крыша"),
    value: "gable",
  });
  const [results, setResults] = useState({
    panelsNeeded: 0,
    totalCost: 0,
    annualSavings: 0,
    paybackPeriod: 0,
    canInstallPanels: false,
    totalPanelArea: 0,
    roofArea: 0,
    roofSlopeAngleDegrees: 0,
  });
  const [state, setState] = useState({
    averageMonthlyConsumption: 900,
    sunlightHoursPerDay: 5,
    costPerKWhMDL: 2.34,
    roofHeight: 5,
    houseLength: 10,
    houseWidth: 10,
  });

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

  const calcFunc = useCallback(
    async (panel: any) => {
      setLoading(true);
      if (!selectPanel) {
        Error("Please select a solar panel");
        return;
      }
      setChangedValues({});

      try {
        const responsePromise = fetch("/api/needs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectPanel: panel,
            contact: { ...contact },
            roofType,
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

        toast.promise(
          responsePromise,
          {
            success: "Calculation successful!",
            // error: "Failed to calculate",
          },
          {
            position: "top-right",
            theme: "dark",
            hideProgressBar: true,
          },
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        toast.error(String(error), {
          position: "top-right",
          theme: "dark",
          hideProgressBar: true,
        });
        console.error("Error calculating solar panel requirements:", error);
      } finally {
        setLoading(false);
      }
    },
    [roofType, state, contact],
  );

  return (
    selectPanel && (
      <>
        <div className={styles.calc_container_calc}>
          <Row>
            <SelectCustom
              title={t("Выберите подходящую солнечную панель")}
              value={selectPanel}
              onChange={(panel) => {
                setSelectPanel(panel); // Установка выбранной солнечной панели
                setChangedValues((prevValues: any) => ({
                  ...prevValues,
                  selectPanel: true,
                }));
              }}
              options={solarPanelArray}
            />
          </Row>
          <Row>
            <Input
              label={t("Среднее месячное потребление (кВт*ч)")}
              inputSize="md"
              value={state.averageMonthlyConsumption}
              placeholder={t("Введите потребление")}
              name="averageMonthlyConsumption"
              onChange={(e) =>
                handleChange("averageMonthlyConsumption", e.target.value)
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
          </Row>
          <Row>
            <SelectCustom
              title={t("Выберите тип крыши")}
              value={roofType}
              // onChange={setRoofType}
              onChange={(e) => {
                setRoofType(e); // Установка выбранной солнечной панели
                setChangedValues((prevValues: any) => ({
                  ...prevValues,
                  selectPanel: true,
                }));
              }}
              options={roofAreaArray}
            />
            <Input
              label={t("Высота крыши (м)")}
              inputSize="md"
              value={state.roofHeight}
              placeholder={t("Высота крыши")}
              name="roofHeight"
              onChange={(e) => handleChange("roofHeight", e.target.value)}
            />
          </Row>
          <Row title={"Введите данные вашего дома"}>
            <Input
              label={t("Длина дома (м)")}
              inputSize="md"
              value={state.houseLength}
              placeholder={t("Длина (м)")}
              name="houseLength"
              onChange={(e) => handleChange("houseLength", e.target.value)}
            />
            <Input
              label={t("Ширина (м)")}
              inputSize="md"
              value={state.houseWidth}
              placeholder={t("Ширина (м)")}
              name="houseWidth"
              onChange={(e) => handleChange("houseWidth", e.target.value)}
            />
          </Row>
          <div className={styles.controls}>
            <Button
              buttonSize="sm"
              buttonType="secondaryGray"
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
                calcFunc(selectPanel);
              }}
            >
              Расчитать
            </Button>
          </div>
        </div>
        <div className={styles.calc_container_info}>
          <h2>Таким образом для вашего запроса:</h2>
          <p>
            Вам потребуется{" "}
            <span>{results.panelsNeeded} солнечных панелей. </span>В эту сумму
            входит: приобретением панелей, проектирование и разрешения,
            установка и монтаж. Поэтому общая начальная стоимость составляет
            примерно:{" "}
            <span>
              {results.totalCost?.toLocaleString("de-DE")} MDL (&#8776;{" "}
              {(results.totalCost / 19.5).toLocaleString("de-DE")} EUR)
            </span>
          </p>
          <p>
            Благодаря этому количеству панелей вы сможете каждый год экономить
            примерно:{" "}
            <span>
              {results.annualSavings?.toLocaleString("de-DE")} MDL (&#8776;{" "}
              {(results.annualSavings / 19.5).toLocaleString("de-DE")} EUR).
            </span>{" "}
            <br />
            Всю сумму вложений в этот проект вы сможете окупить примерно за{" "}
            <span>
              {results.paybackPeriod?.toFixed(2)} {t("лет")}
            </span>
          </p>
          <p>
            Основываясь на размере вашего дома{" "}
            <span>(площадь &#8776; {results.roofArea?.toFixed(2)}м²)</span> и
            высоте крыши{" "}
            <span>
              (угол склона &#8776; {results.roofSlopeAngleDegrees} °),
            </span>{" "}
            при общей площади всех{" "}
            <span>
              {results.panelsNeeded} панелей ≈{" "}
              {results.totalPanelArea?.toFixed(2)} м²
            </span>
            , мы поняли что вы
            {results.canInstallPanels
              ? " МОЖЕТЕ установить необходимое количество панелей."
              : " НЕ МОЖЕТЕ установить необходимое количество панелей, но мы постараемся вам решить эту задачу."}
            . *В случае если никакие установки/постройки этому не помешают
          </p>
        </div>
      </>
    )
  );
};
