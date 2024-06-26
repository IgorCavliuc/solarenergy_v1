"use client";

import {
  createElement,
  FocusEvent,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useId,
  useMemo,
} from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputComponent?: string;
  inputState?: string;
  inputSize?: string;
  withFocusWithin?: boolean;
  label?: string;
  hintText?: string;
  onClear?: () => void;
  additionalOnBlurCheck?: (e: FocusEvent<HTMLDivElement>) => boolean;
  isClearable?: boolean;
  inFocusedState?: boolean;
  hideHintText?: boolean;
  hideErrorIcon?: boolean;
  inputClassName?: string;
  rootContainerProps?: any;
  labelProps?: any;
  containerProps?: any;
  inputContainerProps?: any;
  clearButtonProps?: any;
  hintProps?: any;
  startContainerAdornment?: React.ReactNode;
  endContainerAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  additionalInputContent?: React.ReactNode;
  errors?: {
    error: boolean;
    message: string;
    visible: boolean;
  };
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputComponent = "input",
      inputState,
      inputSize = "sm",
      withFocusWithin = true,
      label,
      hintText,
      onClear,
      additionalOnBlurCheck,
      isClearable,
      inFocusedState,
      hideHintText,
      errors = {
        error: false,
        message: "",
        visible: false,
      },
      hideErrorIcon,
      inputClassName,
      rootContainerProps,
      labelProps,
      containerProps,
      inputContainerProps,
      clearButtonProps,
      hintProps,
      startContainerAdornment,
      endContainerAdornment,
      startAdornment,
      endAdornment,
      additionalInputContent,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const realId = useMemo(() => props.id || reactId, [props.id, reactId]);
    const hasValue = `${props.value}` === "0" || !!props.value;
    const renderClearButton = hasValue && !props.disabled && isClearable;
    const { error, message, visible } = errors;

    const onClearButtonClick = useCallback(() => {
      if (!props.disabled) {
        if (onClear) {
          onClear();
        } else {
          return props?.onChange?.(null as any);
        }
      }
    }, [props.disabled, onClear, props.onChange]);

    const onContainerBlur = useCallback(
      (e: FocusEvent<HTMLDivElement>) => {
        if (
          !e.relatedTarget ||
          !e.currentTarget.contains(e.relatedTarget as Node)
        ) {
          if (additionalOnBlurCheck) {
            if (additionalOnBlurCheck(e)) {
              return rootContainerProps?.onBlur?.(e);
            }
          } else {
            return rootContainerProps?.onBlur?.(e);
          }
        }
      },
      [rootContainerProps?.onBlur, additionalOnBlurCheck],
    );

    return (
      <div
        {...rootContainerProps}
        className={classNames(
          rootContainerProps?.className,
          styles.input,
          styles[inputSize as keyof typeof styles],
          styles[inputState as keyof typeof styles],
          {
            [styles.disabled]: props?.disabled,
            [styles.focused]: inFocusedState,
            [styles.withFocusWithin]: withFocusWithin,
          },
        )}
        onBlur={onContainerBlur}
        data-input-disabled={`${props.disabled}`}
        data-input-state={inputState}
      >
        {label && (
          <label
            {...labelProps}
            className={classNames(labelProps?.className, styles.label)}
            htmlFor={realId}
          >
            {label}
          </label>
        )}
        <div
          {...containerProps}
          className={classNames(containerProps?.className, styles.container)}
        >
          {typeof startContainerAdornment === "string" ? (
            <span>{startContainerAdornment}</span>
          ) : (
            startContainerAdornment
          )}
          <div
            {...inputContainerProps}
            className={classNames(
              inputContainerProps?.className,
              styles.inputContainer,
            )}
          >
            {typeof startAdornment === "string" ? (
              <span>{startAdornment}</span>
            ) : (
              startAdornment
            )}
            {createElement(inputComponent, {
              ...props,
              id: realId,
              className: classNames(styles.input, inputClassName),
              ref,
            })}
            {additionalInputContent}
            {renderClearButton && (
              <button
                {...clearButtonProps}
                className={classNames(
                  clearButtonProps?.className,
                  styles.clearButton,
                )}
                type="button"
                onClick={onClearButtonClick}
              >
                {/*<ClearIcon />*/}
              </button>
            )}
            {typeof endAdornment === "string" ? (
              <span>{endAdornment}</span>
            ) : (
              endAdornment
            )}
            {/*{inputState === "error" && !hideErrorIcon && <AlertIcon />}*/}
          </div>
          {typeof endContainerAdornment === "string" ? (
            <span>{endContainerAdornment}</span>
          ) : (
            endContainerAdornment
          )}
        </div>
        {!!hintText && !hideHintText && (
          <span
            {...hintProps}
            className={classNames(hintProps?.className, styles.hintText)}
            title={typeof hintText === "string" ? hintText : undefined}
          >
            {hintText}
          </span>
        )}
        {message && visible && error && (
          <p className="agent-ui-input--error">{message}</p>
        )}
      </div>
    );
  },
);
