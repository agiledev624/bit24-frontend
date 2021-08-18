import { InputTextInline } from "@/ui-components";
import React, { CSSProperties, ReactNode } from "react";
import classNames from "classnames";

interface ControlGroupInlineProps {
  label: string;
  type?: "text" | "number";
  appendText: string;
  labelClasses?: string;
  defaultValue: string | number;
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  right?: ReactNode;
  inputClass?: string;
  inputWrapperClasses?: string;
  readonly?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  useHandlers: boolean;
  pattern?: string;
}

const marginRight4 = { marginRight: 4 };
export const ControlGroupInline = React.memo(
  ({
    label,
    appendText,
    labelClasses,
    inputWrapperClasses,
    ...props
  }: Partial<Partial<ControlGroupInlineProps>>) => {
    const wrapperClasses = classNames(inputWrapperClasses);

    return (
      <div className="cpn-control-group inline">
        <label className="font-size-9 font-medium" style={marginRight4}>
          <span className={labelClasses}>{label}</span>
        </label>
        <InputTextInline
          className={wrapperClasses}
          {...props}
          right={<div className="append font-size-8">{appendText}</div>}
        />
      </div>
    );
  }
);
