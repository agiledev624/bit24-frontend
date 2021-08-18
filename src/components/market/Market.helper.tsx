import { AppTradeType } from "@/constants/trade-type";
import { capitalize } from "@/exports";
import { WorkspaceSettingEnum } from "@/models/workspace-setting";

export function getWorkspaceLabel(
  name: string,
  tradeType: string = AppTradeType.SPOT
): string {
  switch (name) {
    case WorkspaceSettingEnum.CONTRACT: {
      return "Contract Details";
    }
    case WorkspaceSettingEnum.TRADE: {
      return "Recent Trades";
    }
    case WorkspaceSettingEnum.ORDERBOOK: {
      return "Order Book";
    }
    case WorkspaceSettingEnum.BALANCE: {
      return "Balances";
    }
    case WorkspaceSettingEnum.MARKET: {
      return "Market";
    }
    case WorkspaceSettingEnum.MARKET_HISTORY: {
      if (tradeType === AppTradeType.SPOT) {
        return "Open Orders";
      }
      return "Positions & Open Orders";
    }
    default: {
      return capitalize(name);
    }
  }
}
