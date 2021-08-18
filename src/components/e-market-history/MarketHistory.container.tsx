import React, { useState, useCallback } from "react";
import ResizeSensor from "@/ui-components/ResizeSensor";
import { toggleWorkspaceSetting } from "@/actions/ui-setting.actions";
import { AppTradeType } from "@/constants/trade-type";
import { WorkspaceSettingEnum } from "@/models/workspace-setting";
import { PositionsHistory } from "./PositionsHistory";
import { OrderHistory } from "./OrderHistory";
import { TradeHistory } from "./TradeHistory";
import { OpenOrdersHistory } from "./OpenOrdersHistory";
import { StopOrdersHistory } from "./StopOrdersHistory";
import {
  getOpenOrdersCount,
  getStopOrdersCount,
} from "@/selectors/order.selectors";
import { connect } from "react-redux";
// import { MarketHistory } from "./MarketHistory";
import { getMarketHistoryTabsConfig } from "./MarketHistory.TabsConfig";
import { Card, IconButton, Tabs } from "@/ui-components";
import Eye from "@/ui-components/icons/eye";
import EyeOff from "@/ui-components/icons/eye-off";

const MarketHistory = React.memo(
  ({ symbol, selected, tradeType, isLoggedIn, eye }: any) => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const onResize = ({ width, height }) => {
      setSize({ width, height });
    };
    const kindOfHistory = useCallback(() => {
      if (selected === "positions") {
        return <PositionsHistory size={size} eye={eye} />;
      }
      if (selected === "open-order") {
        return <OpenOrdersHistory size={size} />;
      }
      if (selected === "stop-order") {
        return <StopOrdersHistory size={size} tradeType={tradeType} />;
      }
      if (selected === "order-history") {
        return <OrderHistory size={size} />;
      }
      if (selected === "trade-history") {
        return <TradeHistory size={size} tradeType={tradeType} />;
      }
      return null;
    }, [size, selected, eye]);

    return <ResizeSensor onResize={onResize}>{kindOfHistory()}</ResizeSensor>;
  }
);

interface MarketHistoryContainerProps {
  symbol: string;
  tradeType: AppTradeType;
  totalOpenOrders: number;
  totalStopOrders: number;
  totalPositions: number;
  closeCard: (e: any) => void;
  isLoggedIn: boolean;
}

const MarketHistoryContainer = React.memo(
  ({
    isLoggedIn,
    tradeType,
    symbol,
    totalOpenOrders,
    totalStopOrders,
    totalPositions,
    closeCard,
  }: Partial<MarketHistoryContainerProps>) => {
    const [selected, setSelected] = useState(
      tradeType === AppTradeType.DERIVATIVE ? "positions" : "open-order"
    );
    const [eye, setEye] = useState(true);
    const tabsConfigs = getMarketHistoryTabsConfig({
      tradeType,
      totalEntryOrders: totalOpenOrders,
      totalStopOrders,
      totalEntryPositions: totalPositions,
    });

    const toggleEye = () => setEye(!eye);

    return (
      <Card
        className="market-history"
        closable={true}
        resizable={true}
        onClose={closeCard}
        title={
          <Tabs
            elements={tabsConfigs}
            selected={selected}
            onChange={(to) => setSelected(to)}
          />
        }
        rightTool={
          tradeType === "spot" ? (
            <></>
          ) : eye ? (
            <Eye id="eye" className="eye" onClick={toggleEye} />
          ) : (
            <EyeOff id="eye-slash" className="eye" onClick={toggleEye} />
          )
        }
      >
        <MarketHistory
          symbol={symbol}
          selected={selected}
          eye={eye}
          tradeType={tradeType}
          isLoggedIn={isLoggedIn}
        />
      </Card>
    );
  }
);

const mapStateToProps = (state) => ({
  totalStopOrders: getStopOrdersCount(state),
  totalOpenOrders: getOpenOrdersCount(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeCard(e) {
    dispatch(
      toggleWorkspaceSetting({
        key: WorkspaceSettingEnum.MARKET_HISTORY,
        persist: false,
      })
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketHistoryContainer);

// const MarketHistory = ({ symbol, selected, tradeType, height, isLoggedIn }) => {
//   return <OrderHistory height={height} />
//   // if (selected === "open-order") {
//   //   return <Orders tradeType={tradeType} />;
//   // } else if (selected === "stop-order") {
//   //   return <StopOrders tradeType={tradeType} />;
//   // } else if (selected === "positions") {
//   //   return <Positions symbol={symbol} />;
//   // } else if (selected === "order-history") {
//   //   return <OrderHistory />;
//   // } else if (selected === "trade-history") {
//   //   return <TradeHistory />;
//   // } else {
//   //   return null;
//   // }
// };
