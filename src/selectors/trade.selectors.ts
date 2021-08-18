import { EMPTY_ARRAY } from "@/exports";
import { createSelector } from "reselect";
import _head from "lodash/head";
import { TradeItemModel } from "@/models/trade.model";

const getTradeReducer = (state) => state.trade;

export const getTrades = createSelector(
  getTradeReducer,
  (trade) => trade.items || EMPTY_ARRAY
);

export const getLastTradePrice = createSelector<any, TradeItemModel[], number>(
  getTrades,
  (trades) => (trades.length > 0 ? _head(trades).price : 0)
);

export const isTradeLoaded = createSelector(
  getTradeReducer,
  (trade) => trade.initialized
);
