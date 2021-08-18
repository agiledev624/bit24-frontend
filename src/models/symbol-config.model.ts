// /exchangeInfo
export interface SymbolConfig {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  filters: any[];
}

// /ticker/24hr
export interface DailyTickerChangeModel {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  // bidPrice: "4.00000000",
  // askPrice: "4.00000200",
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  // quoteVolume: 15.30000000,
  // openTime: 1499783499040,
  // closeTime: 1499869899040,
  // firstId: 28385,   // First tradeId
  // lastId: 28460,    // Last tradeId
  // count: 76         // Trade count
}
