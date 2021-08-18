import { getNiceCCy } from "@/exports/ticker.utils";
import {
  DailyTickerChangeModel,
  SymbolConfig,
} from "@/models/symbol-config.model";
import { TickerConfigModel, TickerModel } from "@/models/ticker.model";
import _get from "lodash/get";

/**
 * SymbolConfig is what's getting from requesting exchangeInfo
 */
export function symbolToTickerConfig(sc: SymbolConfig): TickerConfigModel {
  const {
    symbol,
    baseAsset,
    baseAssetPrecision,
    quoteAsset,
    quotePrecision,
    filters = [],
  } = sc;
  let priceFilter =
    filters.find(({ filterType }) => filterType === "PRICE_FILTER") || {};
  let qtyFilter =
    filters.find(({ filterType }) => filterType === "LOT_SIZE") || {};

  return {
    symbol,
    base: baseAsset,
    baseDecimals: baseAssetPrecision,
    quote: quoteAsset,
    quoteDecimals: quotePrecision,
    minPrice: +_get(priceFilter, "minPrice", 0.001),
    maxPrice: +_get(priceFilter, "maxPrice", 0.01),
    tickSize: +_get(priceFilter, "tickSize", 0.001),
    minQty: +_get(qtyFilter, "minQty", 0.001),
    maxQty: +_get(qtyFilter, "maxQty", 0.01),
    stepSize: +_get(qtyFilter, "stepSize", 0.001),
  };
}

export function dailyChangeToTicker(data: DailyTickerChangeModel): TickerModel {
  return {
    bidPrice: 0,
    askPrice: 0,
    ccy: data.symbol,
    pair: data.symbol,
    symbol: data.symbol,
    dailyChangePerc: +data.priceChangePercent,
    high: +data.highPrice,
    low: +data.lowPrice,
    priceChange: +data.priceChange,
    lastPrice: +data.lastPrice,
    niceCcy: getNiceCCy(data.symbol),
    volume: +data.volume,
  };
}
