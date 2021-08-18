import React from "react";
import { Orders, StopOrders } from "../open-order";
import { OrderHistory } from "../order-history/OrderHistory";
import { Positions } from "../positions/Positions";
import { TradeHistory } from "../trade-history/TradeHistory";

export const MarketHistory = ({
  symbol,
  selected,
  tradeType,
  eye,
  isLoggedIn,
}) => {
  if (selected === "open-order") {
    return <Orders tradeType={tradeType} />;
  } else if (selected === "stop-order") {
    return <StopOrders tradeType={tradeType} />;
  } else if (selected === "positions") {
    return <Positions symbol={symbol} eye={eye} />;
  } else if (selected === "order-history") {
    return <OrderHistory />;
  } else if (selected === "trade-history") {
    return <TradeHistory tradeType={tradeType} />;
  } else {
    return null;
  }
};
