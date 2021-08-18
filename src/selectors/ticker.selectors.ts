import { TickerModel } from "@/models/ticker.model";
import { createSelector } from "reselect";
import _memoize from "lodash/memoize";
import { EMPTY_ARRAY } from "@/exports";
import { getLastTradePrice } from "./trade.selectors";
import { TickerState } from "@/models/ticker-state.model";

const getTickerReducer = (state) => state.ticker;

export const getTickers = createSelector(
  getTickerReducer,
  (ticker) => ticker.items || EMPTY_ARRAY
);

export type TickerObject = {
  [x: string]: TickerModel;
};

/**
 * @return {TickerObject}
 */
export const getTickerObj = createSelector<any, TickerModel[], TickerObject>(
  getTickers,
  (items) =>
    items.reduce((result, ticker: TickerModel) => {
      const { symbol } = ticker;
      return {
        ...result,
        [symbol]: ticker,
      };
    }, {})
);

/**
 * @param {string} symbol
 * @return {(string) => TickerModel}
 */
export const getTickerBySymbol = createSelector<
  any,
  TickerObject,
  (string) => TickerModel
>(getTickerObj, (tickers) => _memoize((symbol: string) => tickers[symbol]));

export const getLastPriceBySymbol = createSelector(
  [getLastTradePrice, getTickerBySymbol],
  (price, fun) => (symbol: string) => {
    return price || (fun(symbol) ? +fun(symbol)["lastPrice"] : 0);
  }
);

export const isInstrumentLoaded = createSelector<any, TickerState, boolean>(
  getTickerReducer,
  (ticker) => ticker.instrumentLoaded
);
