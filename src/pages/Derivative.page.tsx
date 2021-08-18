import { AppTradeType } from "@/constants/trade-type";
import React, { useEffect } from "react";
import { MainTradingGrid } from "@/components/grids";
import { Subscribers } from "@/components/socket-subcriber";
import { WebSocketChannelEnum } from "@/constants/websocket.enums";
import TradingControlsCol from "@/components/TradingControlsCol";
import { useDispatch } from "react-redux";
import { getFutureTicker } from "@/actions/ticker.actions";
import OrdersNotifier from "@/components/open-order/Orders.notifier";
import InstrumentRequester from "@/components/Instrument-requester";
import { WalletType } from "@/constants/balance-enums";

const registeredChannels = [
  WebSocketChannelEnum.MARKET,
  WebSocketChannelEnum.TRADES,
  WebSocketChannelEnum.ORDERBOOK,
  WebSocketChannelEnum.CHART,
];

const DerivativePage = ({ match }) => {
  const symbol = match.params.symbol;
  const tradeType = AppTradeType.DERIVATIVE;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFutureTicker(symbol));
  }, [symbol, dispatch]);

  return (
    <InstrumentRequester tradeType={WalletType.DERIVATIVE}>
      <div className="trading-main-layout">
        <TradingControlsCol tradeType={tradeType} symbol={symbol} />
        <div className="trading-main-free-grid">
          <MainTradingGrid symbol={symbol} tradeType={tradeType} />
        </div>
      </div>
      <Subscribers symbol={symbol} channels={registeredChannels} />
      <OrdersNotifier />
    </InstrumentRequester>
  );
};

export default DerivativePage;
