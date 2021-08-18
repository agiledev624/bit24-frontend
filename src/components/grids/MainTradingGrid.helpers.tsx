import React, { ReactNode } from "react";
import _omit from "lodash/omit";
import {
  WorkspaceSetting,
  WorkspaceSettingEnum,
} from "@/models/workspace-setting";
import Chart from "../chart";
// import { MarketHistory } from "../market-history";
import { MarketHistory } from "../e-market-history";
import { Markets } from "../e-market";
import { BookSettingDropdown, OrderBook } from "../order-book";
import { Trade } from "../trade";
import { capitalize } from "@/exports";
import { AppTradeType } from "@/constants/trade-type";

export function getCardContentPaddingByKey(key: WorkspaceSettingEnum): boolean {
  switch (key) {
    case WorkspaceSettingEnum.CHART:
    case WorkspaceSettingEnum.MARKET_HISTORY: {
      return false;
    }
    default: {
      return undefined;
    }
  }
}

export function getCardNameByKey(key: WorkspaceSettingEnum): string {
  switch (key) {
    case WorkspaceSettingEnum.TRADE: {
      return "Recent Trades";
    }
    case WorkspaceSettingEnum.ORDERBOOK: {
      return "Order Book";
    }
    case WorkspaceSettingEnum.MARKET_HISTORY: {
      return "Market History";
    }
    default: {
      return capitalize(WorkspaceSettingEnum[key.toUpperCase()]);
    }
  }
}

export function getCardInnerByKey(
  key: WorkspaceSettingEnum,
  symbol: string,
  tradeType: AppTradeType,
  enableWindowPopup?: boolean
): ReactNode {
  switch (key) {
    case WorkspaceSettingEnum.TRADE: {
      return <Trade symbol={symbol} />;
    }
    case WorkspaceSettingEnum.ORDERBOOK: {
      return (
        <OrderBook
          symbol={symbol}
          windowOpen={enableWindowPopup}
          tradeType={tradeType}
        />
      );
    }
    case WorkspaceSettingEnum.MARKET_HISTORY: {
      return <MarketHistory symbol={symbol} tradeType={tradeType} />;
    }
    case WorkspaceSettingEnum.CHART: {
      return <Chart pair={symbol} tradingType={tradeType} />;
    }
    case WorkspaceSettingEnum.MARKET: {
      return <Markets hideColumns={["high_low"]} />;
    }
  }
}

export function getCardToolByKey(
  key: WorkspaceSettingEnum,
  openChildPopup?: () => void
): ReactNode {
  // const icon = <IconButton tooltip="Popup" onClick={openChildPopup} id="window-restore" />;

  switch (key) {
    case WorkspaceSettingEnum.ORDERBOOK: {
      return (
        <>
          <BookSettingDropdown />
          {/* {icon} */}
        </>
      );
    }
    case WorkspaceSettingEnum.CHART:
    case WorkspaceSettingEnum.MARKET_HISTORY: {
      return null;
    }
    default: {
      return null;
    }
  }
}

export function omitWorkspace(workpsaces: WorkspaceSetting): WorkspaceSetting {
  return _omit(workpsaces, [
    WorkspaceSettingEnum.CONTRACT,
    WorkspaceSettingEnum.BALANCE,
    // WorkspaceSettingEnum.MARKET,
    WorkspaceSettingEnum.WATCHLIST,
  ]);
}

export function omitGridProps(props) {
  return _omit(props, ["enabledWorkspaces"]);
}
