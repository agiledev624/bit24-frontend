import { UI_SETTING_STORAGE_KEY } from "@/constants/storage-keys";
import { AppTradeType } from "@/constants/trade-type";
import Storage from "@/internals/Storage";
import { WorkspaceSetting } from "@/models/workspace-setting";
import { updateThemeVariables } from "@/exports";

export const defaultWorkspace: WorkspaceSetting = {
  chart: true,
  contract: true,
  balance: true,
  market: true,
  orderbook: true,
  trade: true,
  watchlist: true,
  marketHistory: true,
};

export const DEFAULT_USER_SETTINGS_MAP = {
  chart_settings: null,
  chart_height: 500,
  chart_interval: "30",
  show_chart_orders: true,
  show_chart_positions: true,
  show_chart_alerts: true,
  show_desktop_alerts: false,
  theme: "dark-theme",
  current_chart_theme: "dark-theme",
  favorite_symbols: [],
  ticker_favorites_only: false,
  charts_list: [],
  last_symbol: "BTCUSDT",
  last_trade_type: AppTradeType.SPOT,
  hidden_balance: false,
  display_balance_grid: false,
  orderbook_dual_column: false,
  orderbook_1_click: false,
  show_orderbook_1_click_confirm_popup: true,
  orderbook_scrollable: false,
  orderbook_show_depth: true,
  orderbook_zoom_level: 0,
  alerts: [],
  tables_sorting: {},
  balances_overlay: "",
  show_small_balances: false,
  total_equivalent_currency: "USDT",
  // workspace setting
  enabled_workspaces: defaultWorkspace,
  // local setting
  open_dialog_ids: [],
  current_dialog_data: null,
  open_calculator_overlay: false,

  // orders
  // filter_by_symbol: false,
  // filter_by_side: 'all',
  // filter_by_type: 'all',
  // collapsed_order_groups: [],
  enabled_order_confirm_popup: true,

  // positions
  enabled_position_close_limit_popup: true,
  enabled_position_close_market_popup: true,
};

export function getDefaultUserSetting() {
  const defaultSetting = Storage.get(UI_SETTING_STORAGE_KEY) || {};
  updateThemeVariables(defaultSetting?.theme || "dark-theme");
  return Object.assign({}, DEFAULT_USER_SETTINGS_MAP, defaultSetting);
}
