import { Icon, NumberDiff } from "@/ui-components";
import React from "react";
import classNames from "classnames";
import { usePrevious } from "@/hooks";
import { getPriceDecimals } from "@/exports/ticker.utils";
import { greenText, redText } from "@/exports";

export const LastTick = React.memo(
  ({ price, symbol, showNumber = true }: any) => {
    const prevValue = usePrevious(price);
    const decimals = getPriceDecimals(symbol);

    const diff = price - (prevValue || 0);

    const icon = <Icon id="triangle" cssmodule="fa" />;
    const classes = classNames(
      "cpn-lastTick",
      diff > 0 ? greenText() : diff < 0 ? redText() : "",
      {
        "price-down": !(diff >= 0),
      }
    );

    return showNumber ? (
      <NumberDiff
        classes={classes}
        number={price}
        decimals={decimals}
        suffix={icon}
      />
    ) : (
      <div className={classes}>{icon}</div>
    );
  }
);
