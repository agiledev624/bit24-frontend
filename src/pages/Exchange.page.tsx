import { MainTradingGrid } from "@/components/grids";
import OrdersNotifier from "@/components/open-order/Orders.notifier";
import { Subscribers } from "@/components/socket-subcriber";
import TradingControlsCol from "@/components/TradingControlsCol";

import { AppTradeType } from "@/constants/trade-type";
import { WebSocketChannelEnum } from "@/constants/websocket.enums";
import React from "react";

const registeredChannels = [
  WebSocketChannelEnum.MARKET,
  WebSocketChannelEnum.TRADES,
  WebSocketChannelEnum.ORDERBOOK,
  WebSocketChannelEnum.CHART,
];

const ExchangePage = ({ match }) => {
  const tradeType = AppTradeType.SPOT;
  const symbol = match.params.symbol;

  return (
    <div>
      <div className="trading-main-layout">
        <TradingControlsCol tradeType={tradeType} symbol={symbol} />
        <div className="trading-main-free-grid">
          <MainTradingGrid symbol={symbol} tradeType={tradeType} />
        </div>
      </div>
      <Subscribers symbol={symbol} channels={registeredChannels} />
      <OrdersNotifier />
    </div>
  );
};
export default ExchangePage;
