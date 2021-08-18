import React, { ChangeEvent, CSSProperties, ReactNode } from "react";
import classNames from "classnames";
import NumericInput from "./NumericInput";
import { divide } from "@/exports/math";

interface InputProps {
  type?: "text" | "number";
  value: string | number;
  defaultValue?: string | number;
  placeholder: string;
  onChange: (value: string | number) => void;
  className?: string;
  right?: ReactNode;
  left?: ReactNode;
  inputClass?: string;
  readonly?: boolean;
  disabled?: boolean;
  pattern?: string;
  style?: CSSProperties;
  // following props is used in numeric input
  useHandlers?: boolean;
  precision?: number;
  step?: number;
  max?: number;
}

export const InputTextInline = ({
  type = "text",
  value,
  onChange,
  defaultValue,
  className,
  placeholder,
  left,
  right,
  inputClass,
  style,
  pattern,
  readonly,
  disabled,
  precision,
  useHandlers = true,
  step,
  max,
}: Partial<InputProps>) => {
  const wrapClass = classNames("input-inline", className);
  const isTextType = type === "text";

  const onInputChange = isTextType
    ? (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.validity.valid) {
          let newValue = e.target.value;
          if (!isNaN(+newValue) && step) {
            if (+newValue && +newValue < step) {
              onChange(`${step}`);
            } else if (+newValue && +divide(+newValue, step) % 1 !== 0) {
              onChange(newValue.replace(/.$/, "0"));
            } else {
              onChange(newValue);
            }
          } else {
            onChange(newValue);
          }
        }
      }
    : (value: number) => {
        onChange(value);
      };

  const inputComponent = isTextType ? (
    <input
      className={inputClass}
      defaultValue={defaultValue}
      type="text"
      value={value}
      onChange={onInputChange as (e: ChangeEvent<HTMLInputElement>) => void}
      readOnly={readonly}
      disabled={disabled}
      pattern={pattern}
      placeholder={placeholder}
    />
  ) : (
    <NumericInput
      className={inputClass}
      value={+value}
      readOnly={readonly}
      disabled={disabled}
      onChange={onChange}
      precision={precision}
      step={step}
      useHandlers={useHandlers}
      max={max}
    />
  );

  return (
    <div className={wrapClass} style={style}>
      {left && (
        <div className="input-inline__left d-flex d-align-items-center">
          {left}
        </div>
      )}
      {inputComponent}
      {right && (
        <div className="input-inline__right d-flex d-align-items-center">
          {right}
        </div>
      )}
    </div>
  );
};
