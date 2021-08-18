import React, { ReactNode } from "react";
import classNames from "classnames";

interface RadioGroupProps {
  name: string;
  selectedValue: string | number | any;
  onChange: (value: string | number | any) => void;
  children: ReactNode;
  className?: string;
  type: "checkbox" | "radio";
}
export class RadioGroup extends React.Component<Partial<RadioGroupProps>> {
  static defaultProps = {
    type: "radio",
  };

  render() {
    const { className, type, name, selectedValue, onChange, ...rest } =
      this.props;

    const childrenWithProps = React.Children.map(
      this.props.children,
      (child) => {
        // @ts-ignore
        if (typeof child.type === "string") return child;

        // checking isValidElement is the safe way and avoids a typescript error too
        const props = { name, selectedValue, onChange, type };
        if (React.isValidElement(child)) {
          return React.cloneElement(child, props);
        }
        return child;
      }
    );

    const groupCls = classNames(
      "d-flex d-justify-content-space-between d-align-items-center",
      className
    );
    return (
      <div className={groupCls} role="radiogroup" {...rest}>
        {childrenWithProps}
      </div>
    );
  }
}
