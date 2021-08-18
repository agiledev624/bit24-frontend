import React from "react";
import classNames from "classnames";

interface RadioButtonProps {
  value: string | number;
  selectedValue: string | number | boolean;
  name: string;
  onChange: (value: string | number | boolean) => void;
  className?: string;
  label?: string;
  type: "checkbox" | "radio";
}

export class RadioButton extends React.PureComponent<
  Partial<RadioButtonProps>
> {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, onChange } = this.props;

    onChange(value);
  }

  render() {
    const { type, value, name, selectedValue, className, label } = this.props;
    const checked = this.props.value === selectedValue;

    const radioCls = classNames(`${type}-input`, className);
    const markCls = classNames(`${type}-checkmark`, className, {
      checked,
    });

    return (
      <label className={radioCls}>
        <div className={`${type}-container`}>
          <input
            onChange={this.onChange}
            value={value}
            checked={checked}
            type={type}
            name={name}
          />
          <span className={markCls}></span>
        </div>
        <span>{label}</span>
      </label>
    );
  }
}
