export type TickerModel = {
  ccy: string; // symbol alias
  pair: string; // symbol alias
  symbol: string;
  high: number;
  low: number;
  lastPrice: number;
  bidPrice: number;
  askPrice: number;
  volume: number;
  dailyChangePerc: number;
  niceCcy: string;
  priceChange: number;
  name?: string;
} & TickerMarkPriceModel;

export type TickerMarkPriceModel = {
  symbol: string;
  markPrice?: number;
  indexPrice?: number;
  lastFundingRate?: number;
  nextFundingRate?: number;
  interestRate?: number;
};

export interface TickerConfigModel {
  base: string;
  baseDecimals: number;
  quote: string;
  quoteDecimals: number;
  symbol: string;
  minPrice: number;
  maxPrice: number;
  tickSize: number; // interval price size
  minQty: number;
  maxQty: number;
  stepSize: number; // interval qty size
}
