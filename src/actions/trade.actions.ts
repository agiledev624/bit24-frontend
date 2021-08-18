import { OrderBookSideEnum } from "@/constants/order-book-enums";

export const TRADE_INIT = "@trade/TRADE_INIT";
export const TRADE_INITIALIZED = "@trade/TRADE_INITIALIZED";
export const TRADE_RECEIVED_UPDATE = "@trade/RECEIVED_UPDATE";

/**
 *   "e": "trade",     // Event type
  "E": 123456789,   // Event time
  "s": "BNBBTC",    // Symbol
  "t": 12345,       // Trade ID
  "p": "0.001",     // Price
  "q": "100",       // Quantity
  "b": 88,          // Buyer order ID
  "a": 50,          // Seller order ID
  "T": 123456785,   // Trade time
  "m": true,        // Is the buyer the market maker?
  "M": true         // Ignore
*/
export function tradeUpdate(batchTrades = []) {
  const data = batchTrades.map((trade) => {
    const { m: isBuyer, l: id, T: tradeTime, p: price, q: amount } = trade;

    return {
      id,
      date: tradeTime,
      price: +price,
      amount: +amount,
      side: isBuyer ? OrderBookSideEnum.BID : OrderBookSideEnum.ASK,
    };
  });

  return {
    type: TRADE_RECEIVED_UPDATE,
    payload: data,
  };
}

export function tradeUpdate2(batchTrades = []) {
  return {
    type: TRADE_RECEIVED_UPDATE,
    payload: batchTrades,
  };
}

export function requestInitTrades(symbol, limit = 100) {
  return {
    type: TRADE_INIT,
    payload: { symbol, limit },
  };
}

/**
 * [{
    "id": 28457,
    "price": "4.00000100",
    "qty": "12.00000000",
    "quoteQty": "48.000012",
    "time": 1499865549590,
    "isBuyerMaker": true,
    "isBestMatch": true
  }]
 */
export function tradeInitliazed(trades) {
  const data = [];

  for (let i = trades.length - 1; i >= 0; i--) {
    const { id, price, qty, time, isBuyerMaker } = trades[i];

    data.push({
      id,
      date: time,
      price: +price,
      amount: +qty,
      side: isBuyerMaker ? OrderBookSideEnum.BID : OrderBookSideEnum.ASK,
    });
  }

  return {
    type: TRADE_INITIALIZED,
    payload: data,
  };
}
