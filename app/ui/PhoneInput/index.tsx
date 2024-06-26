import { useCallback, useEffect, useRef, useState } from "react";
import Phone from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./index.scss";
//@ts-ignore
import { ErrorObject, ErrorType } from "../../Pages/utils.tsx";

const classNames = require("classnames");

interface Props {
  index?: string;
  value?: string;
  errors?: {
    error: boolean;
    message: string;
    visible: boolean;
  };
  label: string;
  changeError?: (e: any) => void;
  validateCondition?: (e: any) => ErrorType;
  onChange?: (value: string) => void;
  onBlur?: (index?: string) => void;
}

const PhoneInput = ({
  index,
  value,
  errors = {
    error: false,
    message: "",
    visible: false,
  },
  changeError,
  validateCondition,
  onChange,
  onBlur,
  label,
}: Props) => {
  const { error, message, visible } = errors;

  const [focus, setFocus] = useState(false);

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const className = classNames("agent-ui-phone-input", {
    "agent-ui-phone-input--error": error && visible,
    "agent-ui-phone-input--focus": focus,
  });

  const handleChange = useCallback(
    (Value?: string) => {
      if (typeof Value === "string") {
        let validationError = { error: false, message: "", visible: false };
        if (validateCondition) {
          validationError = validateCondition(Value);
        }
        if (changeError && index) {
          changeError((errors: any) => ({
            ...errors,
            [index]: {
              ...errors[index],
              ...validationError,
              visible: false,
            },
          }));
        }
        if (onChange) {
          onChange(Value);
        }
      }
    },
    [onChange, changeError, validateCondition, index],
  );

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur(index);
    }

    setFocus(false);
  }, [index, onBlur]);

  const handleFocus = () => {
    setFocus(true);
  };

  useEffect(() => {
    if (phoneRef.current) {
      phoneRef.current.tabIndex = 1;
    }
  }, [phoneRef]);

  useEffect(() => {
    if (
      validateCondition &&
      changeError &&
      index &&
      typeof value === "string"
    ) {
      changeError((errors: ErrorObject) => ({
        ...errors,
        [index]: {
          ...errors[index],
          ...validateCondition(value),
          visible: false,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateCondition, changeError, index, value]);

  return (
    <div className="agent-ui-phone-input--wrapper" data-index={index}>
      {label && <label className="agent-ui-label">{label}</label>}
      <Phone
        //@ts-ignore
        ref={phoneRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
        countryCallingCodeEditable={false}
        defaultCountry="MD"
        international
      />
      {message && error && visible && (
        <p className="agent-ui-input--error">{message}</p>
      )}
    </div>
  );
};

export default PhoneInput;
