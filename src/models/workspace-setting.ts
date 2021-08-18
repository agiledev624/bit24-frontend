export enum WorkspaceSettingEnum {
  CHART = "chart",
  CONTRACT = "contract",
  BALANCE = "balance",
  ORDERBOOK = "orderbook",
  MARKET = "market",
  TRADE = "trade",
  WATCHLIST = "watchlist",
  MARKET_HISTORY = "marketHistory",
}

export type WorkspaceSetting = {
  [s in WorkspaceSettingEnum]?: boolean;
};
