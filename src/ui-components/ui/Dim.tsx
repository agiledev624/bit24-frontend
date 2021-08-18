import React, { ReactNode } from "react";

interface DimProps {
  amount?: number;
  style?: Object;
  block?: boolean;
  small?: boolean;
  children: ReactNode;
}

export const Dim = React.memo(
  ({ amount = 50, block, style, small, children }: DimProps) => {
    var classes = `show${amount}`;
    var Wrapper = !block ? "span" : "div";

    if (small) {
      classes += ` font-size-90`;
    }

    return React.createElement(
      Wrapper,
      {
        className: classes,
        style,
      },
      children
    );
  }
);
