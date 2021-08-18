import React from "react";
import moment from "moment";
import { NumberFormat } from "@/ui-components";
import { OrderBookSideEnum } from "@/constants/order-book-enums";
import { greenText, redText } from "@/exports";
import { getAmountDecimals, getPriceDecimals } from "@/exports/ticker.utils";

const hhmmss = function (timestamp: string | number): string {
  return moment(timestamp).format("HH:mm:ss");
};

interface TradeItemProps {
  symbol?: string;
  price: number;
  amount: number;
  date: number | string;
  side: OrderBookSideEnum;
}

export const Item = React.memo(
  ({ symbol, price, amount, date, side }: TradeItemProps) => {
    const pClasses = `trade-history__item__price ${
      side === OrderBookSideEnum.BID ? greenText() : redText()
    }`;

    const priceDecimals = getPriceDecimals(symbol);
    const amountDecimals = getAmountDecimals(symbol);

    return (
      <div className="animsOn d-flex trade-history__item">
        <div className={pClasses}>
          <NumberFormat decimals={priceDecimals} number={price} />
        </div>
        <div className="trade-history__item__amount">
          <NumberFormat decimals={amountDecimals} number={amount} />
        </div>
        <div className="trade-history__item__date">
          <span>{hhmmss(date)}</span>
        </div>
      </div>
    );
  }
);

export const TradeHeader = () => (
  <div className="d-flex d-align-items-center d-justify-content-space-between trade-history__header">
    <div className="trade-history__header__price">
      <span>Price</span>
    </div>
    <div className="trade-history__header__amount">
      <span>Size</span>
    </div>
    <div className="trade-history__header__date">
      <span>Time</span>
    </div>
  </div>
);
