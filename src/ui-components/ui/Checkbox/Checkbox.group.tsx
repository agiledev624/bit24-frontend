import * as React from "react";
import { InputCheckboxInline } from "../inputs";

interface ICheckboxProps {
  disabled?: boolean;
  value: any;
  label?: string;
}
interface ICheckboxGroupProps {
  children: (Checkbox: React.FC<ICheckboxProps>) => JSX.Element;
  name: string;
  value: any[];
  onChange: (newValue: any[]) => any;
}

const CheckboxGroup: React.FC<ICheckboxGroupProps> = (props) => {
  const { children, name, value: checkedValues, onChange } = props;

  const onCheckboxChange = (
    checkboxValue: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("v", checkboxValue, event);
    if (event.target.checked) {
      onChange(checkedValues.concat(checkboxValue));
    } else {
      onChange(checkedValues.filter((v) => v !== checkboxValue));
    }
  };

  const Checkbox: React.FC<ICheckboxProps> = (checkboxProps) => {
    const { value: cbValue, label } = checkboxProps;

    const checked = checkedValues ? checkedValues.indexOf(cbValue) >= 0 : false;

    return (
      <InputCheckboxInline
        label={label}
        name={name}
        value={cbValue}
        onChange={onCheckboxChange}
        checked={checked}
      />

      // <input
      //   {...rest}
      //   type="checkbox"
      //   name={name}
      //   disabled={disabled}
      //   checked={checked}
      //   onChange={onCheckboxChange.bind(null, cbValue)}
      //   value={cbValue}
      // />
    );
  };

  return children(Checkbox);
};

export default CheckboxGroup;
