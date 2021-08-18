import React, { ReactNode, useCallback } from "react";
import classNames from "classnames";

interface InputInlineProps {
  label: ReactNode;
  checked: boolean;
  value: any;
  radioClasses?: string;
  name?: string;
}

type InputRadioProps = InputInlineProps & {
  onChange: (value: any) => void;
};

export const InputRadioInline = ({
  radioClasses,
  label,
  checked,
  value,
  onChange,
}: Partial<InputRadioProps>) => {
  const handleOnChange = useCallback(
    (e) => {
      e.stopPropagation();

      onChange(value);
    },
    [onChange, value]
  );

  const radioCls = classNames("radio-input", radioClasses);
  const markCls = classNames("radio-checkmark", radioClasses, {
    checked,
  });

  return (
    <label className={radioCls}>
      <div className="radio-container">
        <input
          type="radio"
          checked={checked}
          value={value}
          onChange={handleOnChange}
        />
        <span className={markCls}></span>
      </div>
      {label}
    </label>
  );
};

type InputCheckboxProps = InputInlineProps & {
  onChange: (value: any, e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const InputCheckboxInline = ({
  radioClasses,
  name,
  label,
  checked,
  value,
  onChange,
}: Partial<InputCheckboxProps>) => {
  const handleOnChange = useCallback(
    (e) => {
      e.stopPropagation();
      onChange(value, e);
    },
    [onChange, value]
  );

  const radioCls = classNames("checkbox-input", radioClasses);
  const markCls = classNames("checkbox-checkmark", radioClasses, {
    checked,
  });

  return (
    <label className={radioCls}>
      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={checked}
          name={name}
          value={value}
          onChange={handleOnChange}
        />
        <span className={markCls}></span>
      </div>
      {label}
    </label>
  );
};
