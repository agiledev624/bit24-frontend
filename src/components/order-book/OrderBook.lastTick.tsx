import React from "react";
import { useRouteToTradeType } from "@/hooks";
import { AppTradeType } from "@/constants/trade-type";
import { LastTick } from "../LastTick";

interface OrderBookLastTickProps {
  price: number;
  symbol: string;
}

export const OrderBookLastTick = React.memo(
  ({ price, symbol }: OrderBookLastTickProps) => {
    const tradeType = useRouteToTradeType();

    return (
      <div className="lastPriceWidget">
        <span className="lastTick">
          <LastTick price={price} symbol={symbol} />
        </span>
        {tradeType === AppTradeType.DERIVATIVE && (
          <div className="limits nowrap">
            <span>10876.87</span>
            <span className="fairPrice">
              /{" "}
              <a href="/app/fairPriceMarking" className="tooltipWrapper">
                10876.69
              </a>
            </span>
          </div>
        )}
      </div>
    );
  }
);
