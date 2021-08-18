import { WalletType } from "@/constants/balance-enums";
import { TickerMarkPriceModel } from "@/models/ticker.model";
import { TOGGLE_FAVOR_SYMBOL } from "./ui-setting.actions";

export const TICKER_INIT = "@ticker/INIT";
export const TICKER_INITIALIZED = "@ticker/INITIALIZED";
export const TICKER_RECEIVED_UPDATE = "@ticker/RECEIVED_UPDATE";

// future
export const GET_TICKER_FUTURE = "@ticker/GET_TICKER_FUTURE";
export const TICKER_FUTURE_UPDATE = "@ticker/TICKER_FUTURE_UPDATE";

// instrument
export const INSTRUMENT_REQUEST = "@ticker/INSTRUMENT_REQUEST";
export const INSTRUMENT_RECEIVED_UPDATE = "@ticker/INSTRUMENT_RECEIVED_UPDATE";

export function requestInstrument(walletType: WalletType) {
  console.log("instrument", walletType);
  return {
    type: INSTRUMENT_REQUEST,
    payload: walletType,
  };
}

export function updateInstrument(data, isLoaded) {
  return {
    type: INSTRUMENT_RECEIVED_UPDATE,
    payload: {
      instrument: data,
      finished: isLoaded,
    },
  };
}

export function initTickers() {
  return {
    type: TICKER_INIT,
  };
}

export function getFutureTicker(symbol: string) {
  return {
    type: GET_TICKER_FUTURE,
    payload: symbol,
  };
}

export function updateFutureTicker(ticker: TickerMarkPriceModel) {
  return {
    type: TICKER_FUTURE_UPDATE,
    payload: ticker,
  };
}

export function toggleFavoriteSymbol(ccy: string, persist?) {
  return {
    type: TOGGLE_FAVOR_SYMBOL,
    payload: { symbol: ccy, persist },
  };
}

/**
  "e": "24hrTicker",   Event type
  "E": 123456789,      Event time
  "s": "BNBBTC",       Symbol
  "p": "0.0015",       Price change
  "P": "250.00",       Price change percent
  "w": "0.0018",       Weighted average price
  "x": "0.0009",       First trade(F)-1 price (first trade before the 24hr rolling window)
  "c": "0.0025",       Last price
  "Q": "10",           Last quantity
  "b": "0.0024",       Best bid price
  "B": "10",           Best bid quantity
  "a": "0.0026",       Best ask price
  "A": "100",          Best ask quantity
  "o": "0.0010",       Open price
  "h": "0.0025",       High price
  "l": "0.0010",       Low price
  "v": "10000",        Total traded base asset volume
  "q": "18",           Total traded quote asset volume
  "O": 0,              Statistics open time
  "C": 86400000,       Statistics close time
  "F": 0,              First trade ID
  "L": 18150,          Last trade Id
  "n": 18151           Total number of trades
*/
export function tickerUpdate(batchTickers = []) {
  const data = batchTickers.reduce((ticker, rawData) => {
    const {
      s: symbol,
      h,
      l,
      c: lastPrice,
      p: priceChange,
      P: dailyChangePerc,
      v: volume,
    } = rawData;
    ticker[symbol] = {
      symbol,
      high: h,
      low: l,
      lastPrice,
      volume,
      dailyChangePerc,
      priceChange,
    };

    return ticker;
  }, {});

  return {
    type: TICKER_RECEIVED_UPDATE,
    payload: data,
  };
}

export function tickerUpdate2(ticker) {
  return {
    type: TICKER_RECEIVED_UPDATE,
    payload: ticker,
  };
}
