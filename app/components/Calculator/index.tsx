"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "@/app/styles.module.scss";
import { Loading, MultiSwitch } from "@/app/ui";
import { NeedsCalc } from "@/app/components/NeedsCalc";
import { AreaCalc } from "@/app/components/AreaCalc";
import { Row } from "@/app/ui/Row";
import { Input } from "@/app/ui/Input";
import PhoneInput from "@/app/ui/PhoneInput";
import { isValidPhoneNumber } from "react-phone-number-input";

interface CalculatorProps {
  typeCalc: { type: string; label: string };
  isModalOpen: boolean;
  setTypeCalc: React.Dispatch<
    React.SetStateAction<{ type: string; label: string }>
  >;
  typeCalcValue: { type: string; label: string }[];
  setIsModalOpen: (e: boolean) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  typeCalc,
  isModalOpen,
  setTypeCalc,
  typeCalcValue,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectPanel, setSelectPanel] = useState<any>(null);

  const [contact, setContact] = useState({
    email: "",
    phone: "",
    name: "",
    lastname: "",
  });
  const [errors, setErrors] = useState({
    phone: { error: true, message: "", visible: false },
    email: { error: true, message: "", visible: false },
    name: { error: true, message: "", visible: false },
    lastname: { error: true, message: "", visible: false },
  });
  const [solarPanelArray, setSolarPanelArray] = useState<any[]>([]);

  const roofAreaArray = [
    { label: "Плоская крыша", value: "flat" },
    { label: "Односкатная крыша", value: "singleSlope" },
    { label: "Двускатная крыша", value: "gable" },
  ];

  const getSolarPanel = useCallback(async () => {
    try {
      const response = await fetch("/api/solar_panel", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setSolarPanelArray(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching solar panels:", error);
    }
  }, []);

  useEffect(() => {
    getSolarPanel();
  }, [getSolarPanel]);

  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (loading) {
      document.documentElement.style.pointerEvents = "none";
      document.body.style.pointerEvents = "none";
    } else {
      document.documentElement.style.pointerEvents = "auto";
      document.body.style.pointerEvents = "auto";
    }
  }, [loading]);

  useEffect(() => {
    if (solarPanelArray.length > 0) {
      setSelectPanel(solarPanelArray[0]);
    }
  }, [solarPanelArray]);
  const emailRegex =
    /^(?:(?:[a-zA-Z0-9_'^&amp;/+-])+(?:\.[a-zA-Z0-9_'^&amp;/+-]+)*|"(?:(?:\\[^\r\n]|[^\\"])*)")@((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;

  const handleChange = (key: string, value: string) => {
    setContact((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    validateInput(key, value);
  };

  const validateInput = (key: string, value: string) => {
    if (key === "phone") {
      const isValid = isValidPhoneNumber(value);
      setErrors((prev) => ({
        ...prev,
        phone: {
          error: !isValid,
          message: isValid ? "" : "Введите корректный номер телефона",
          visible: false,
        },
      }));
    }

    if (key === "email") {
      const isValid = emailRegex.test(value);
      setErrors((prev) => ({
        ...prev,
        email: {
          error: !isValid,
          message: isValid
            ? ""
            : "Введите корректный адрес электронной почты (example@gmail.com)",
          visible: false,
        },
      }));
    }
    if (key === "name") {
      const isValid = value.trim().length > 0;
      setErrors((prev) => ({
        ...prev,
        name: {
          error: !isValid,
          message: isValid ? "" : "Введите свое имя",
          visible: false,
        },
      }));
    }
    if (key === "lastname") {
      const isValid = value.trim().length > 0;
      setErrors((prev) => ({
        ...prev,
        lastname: {
          error: !isValid,
          message: isValid ? "" : "Введите свою фамилию",
          visible: false,
        },
      }));
    }
  };

  const handleBlur = (key: string, value: string) => {
    validateInput(key, value);

    setErrors((prev) => {
      const updatedErrors = { ...prev };
      for (const property in updatedErrors) {
        if (Object.prototype.hasOwnProperty.call(updatedErrors, property)) {
          // @ts-ignore
          updatedErrors[property].visible = true;
        }
      }
      return updatedErrors;
    });
  };

  const getCalcForm = useMemo(() => {
    switch (typeCalc?.type) {
      case "needs":
        return (
          <NeedsCalc
            contact={contact}
            setErrors
            setIsModalOpen={setIsModalOpen}
            selectPanel={selectPanel}
            setSelectPanel={setSelectPanel}
            roofAreaArray={roofAreaArray}
            solarPanelArray={solarPanelArray}
            setLoading={setLoading}
          />
        );
      case "area":
        return (
          <AreaCalc
            contact={contact}
            setErrors
            setIsModalOpen={setIsModalOpen}
            selectPanel={selectPanel}
            setSelectPanel={setSelectPanel}
            roofAreaArray={roofAreaArray}
            solarPanelArray={solarPanelArray}
            setLoading={setLoading}
          />
        );
      default:
        return null;
    }
  }, [
    typeCalc?.type,
    contact.email,
    contact.phone,
    errors.phone.error,
    errors.phone.visible,
    errors.email.error,
    errors.email.visible,
  ]);

  const handleTypeChange = (e: any) => {
    setTypeCalc(e);
  };

  return (
    <div
      className={
        isModalOpen ? styles.calculator_visible : styles.calculator_hidden
      }
      onClick={() => setIsModalOpen(false)}
    >
      {loading && <Loading />}
      <div
        className={styles.calc_tab_wrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.close} onClick={() => setIsModalOpen(false)}>
          X
        </p>
        <div className={styles.calc_tab}>
          <MultiSwitch
            options={typeCalcValue}
            select={typeCalc}
            onChange={handleTypeChange}
          />
        </div>

        <div className={styles.calc_container}>
          <p className={styles.subtitle}>
            *Введите ваши контактные данные что бы форма расчета была доступна!{" "}
            <br />
            Ваши данные сохраняются у нас в базе для того что бы наши менеджеры
            смогли связаться с вами и детально проконсультировать вас.
          </p>
          <Row>
            <Input
              label={"Введите ваше имя"}
              inputSize="md"
              value={contact.name}
              errors={errors.name}
              placeholder={"Имя"}
              name="name"
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name", contact.name)}
            />
            <Input
              label={"Введите вашу фамилию"}
              inputSize="md"
              value={contact.lastname}
              errors={errors.lastname}
              placeholder={"Фамилия"}
              name="lastname"
              onChange={(e) => handleChange("lastname", e.target.value)}
              onBlur={() => handleBlur("lastname", contact.lastname)}
            />
          </Row>
          <Row>
            <Input
              label={"Введите адрес электронной почты"}
              inputSize="md"
              value={contact.email}
              errors={errors.email}
              placeholder={"Email"}
              name="email"
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email", contact.email)}
            />
            <PhoneInput
              label="Номер телефона"
              value={contact.phone}
              errors={errors.phone}
              changeError={setErrors}
              onChange={(e) => handleChange("phone", e)}
              onBlur={() => handleBlur("phone", contact.phone)}
            />
          </Row>

          {contact.email &&
          contact.phone &&
          !errors.phone.error &&
          // !errors.phone.visible &&
          !errors.email.error ? (
            // !errors.email.visible
            <div>
              <>
                <p className={styles.subtitle}>
                  *Все расчеты производятся исходя из физико-математических
                  алгоритмов и могут отличаться от реальных данных. Данная форма
                  создана для примерного подсчета.
                </p>
                <div className={styles.calc_container_wrapper}>
                  {getCalcForm}
                </div>
              </>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
