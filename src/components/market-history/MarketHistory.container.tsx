import { toggleWorkspaceSetting } from "@/actions/ui-setting.actions";
import { AppTradeType } from "@/constants/trade-type";
import { WorkspaceSettingEnum } from "@/models/workspace-setting";
import {
  getOpenOrdersCount,
  getStopOrdersCount,
} from "@/selectors/order.selectors";
import { Card, IconButton, Tabs } from "@/ui-components";
import React, { useState } from "react";
import { connect } from "react-redux";
import { MarketHistory } from "./MarketHistory";
import { getMarketHistoryTabsConfig } from "./MarketHistory.TabsConfig";

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
    const [eye, setEye] = useState(false);
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
        rightTool={<IconButton id="eye" onClick={toggleEye} />}
      >
        <MarketHistory
          symbol={symbol}
          eye={eye}
          selected={selected}
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
