import { formatNumber, greenText, redText } from "@/exports";
import { usePrevious } from "@/hooks";
import React, { ReactNode } from "react";
import classNames from "classnames";

interface NumberAndDecimals {
  number: number;
  decimals?: number;
  suffix?: string | ReactNode;
  prefix?: string;
  classes?: string;
}

export const NumberFormat = React.memo(
  ({ number, decimals = 0, classes, suffix, prefix }: NumberAndDecimals) => (
    <span className={classes}>
      {prefix}
      {formatNumber({ number, decimals })}
      {suffix}
    </span>
  )
);

export const NumberFormatExtent = React.memo(
  ({ number, decimals = 0, classes, suffix }: NumberAndDecimals) => {
    const cls = classNames(
      "number-text",
      classes,
      number > 0 ? greenText() : redText()
    );
    return (
      <span className={cls}>
        {number > 0 ? "+" : ""}
        {formatNumber({ number, decimals })}
        {suffix}
      </span>
    );
  }
);

interface NumberDiffProps extends NumberAndDecimals {
  upClass?: string;
  downClass?: string;
}

export const NumberDiff = React.memo(
  ({
    number,
    decimals = 0,
    suffix,
    classes,
    upClass = greenText(),
    downClass = redText(),
  }: NumberDiffProps) => {
    const previousNumber = usePrevious(number);
    const cls = classNames("number-text", classes, {
      [upClass]: number - Number(previousNumber) > 0,
      [downClass]: number - Number(previousNumber) < 0,
    });

    return (
      <NumberFormat
        number={number}
        decimals={decimals}
        classes={cls}
        suffix={suffix}
      />
    );
  }
);
