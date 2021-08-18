import { Instrument } from "@/models/instrument.model";
import { SymbolConfig } from "@/models/symbol-config.model";
import { TickerConfigModel } from "@/models/ticker.model";
import { symbolToTickerConfig } from "@/transformers/symbol-to-ticker-config.transformer";
import _get from "lodash/get";
import _set from "lodash/set";
import _includes from "lodash/includes";
import _split from "lodash/split";
import _toUpper from "lodash/toUpper";
import _toLower from "lodash/toLower";

interface CurrencyInfoCollectionType {
  [ccy: string]: TickerConfigModel;
}

let CURRENCY_INFO: CurrencyInfoCollectionType = {};
let CURRENCY_DECIMALS_INFO_MAP = {};

const INSTRUMENT_INFO = {};

export function initInstrument(instrument: Instrument) {
  CURRENCY_DECIMALS_INFO_MAP = {};
  INSTRUMENT_INFO[instrument.symbol] = instrument;
}

export function initCurrency(symbols: SymbolConfig[]) {
  let info = {};
  for (let i = 0; i < symbols.length; i++) {
    const { symbol } = symbols[i];
    info[symbol] = symbolToTickerConfig(symbols[i]);
  }

  CURRENCY_INFO = { ...info };
}

//@ref https://cryptoicons.org
//https://cryptoicons.org/api/:style/:currency/:size/:color
export function getSvgUrl(ccy: string = "", size: number = 24) {
  // return `/resources/crypto-icons/${ccy}.svg`;
  return `https://icons.bitbot.tools/api/${ccy.toLowerCase()}/32x32`;
}

// ------ @deprecated start--------
// export function getSymbols(ccy: string): [string, string] {
//   return [firstInPair(ccy), lastInPair(ccy)];
// }
// export function firstInPair(ccy: string): string {
//   return _get(CURRENCY_INFO, [ccy, 'base'], '');
// }
// export function lastInPair(ccy: string): string {
//   return _get(CURRENCY_INFO, [ccy, 'quote'], '');
// }

// export function getMinAmount(ccy: string): number {
//   return _get(CURRENCY_INFO, [ccy, 'minQty'], getMinNumberByDecimals(8));
// }

// export function getMaxAmount(ccy: string): number {
//   return _get(CURRENCY_INFO, [ccy, 'maxQty'], getMinNumberByDecimals(8));
// }

// export function getMinPrice(ccy: string): number {
//   return _get(CURRENCY_INFO, [ccy, 'minPrice'], 0.1);
// }

// export function getMaxPrice(ccy: string): number {
//   return _get(CURRENCY_INFO, [ccy, 'maxPrice'], getMinNumberByDecimals(8));
// }
// ------ @deprecated end--------

export function getSymbols(ccy: string): string[] {
  if (_includes(ccy, "/")) {
    // XXX/YYY[Y] format
    return _split(ccy, "/", 2);
  }

  return [ccy.slice(0, 3), ccy.slice(3, 7)]; // XXXYYY[Y] format
}

export function firstInPair(pair: string, uppercase: boolean = true): string {
  const [first = "-"] = getSymbols(pair);

  return uppercase ? _toUpper(first) : _toLower(first);
}

export function lastInPair(pair: string, uppercase: boolean = true): string {
  const [, last = "-"] = getSymbols(pair);

  return uppercase ? _toUpper(last) : _toLower(last);
}

export function getMinNumberByDecimals(decimals: number): number {
  let count = decimals - 1 < 0 ? 0 : decimals - 1;

  return Number(`0.${"0".repeat(count)}1`);
}

// find all symbols include both base and counter by given currency
// @ex: ccy: BTC -> symbol list: [{ETHBTC}, {BTCUSDT}, {EOSBTC}....]
// @returns object[]
export function findRelevantsByCurrency(ccy: string) {
  return Object.values(CURRENCY_INFO).filter(
    ({ base, quote }) =>
      ~quote.search(new RegExp(ccy, "i")) || ~base.search(new RegExp(ccy, "i"))
  );
}

export function getAmountDecimals(ccy: string, coinType?: string): number {
  let decimals = _get(CURRENCY_DECIMALS_INFO_MAP, [ccy, "decimalAmount"], null);
  if (decimals === null) {
    decimals = getPrecisionFromNumber(getMinAmount(ccy));
    _set(CURRENCY_DECIMALS_INFO_MAP, [ccy, "decimalAmount"], decimals);
  }

  if (coinType === "USDT") {
    return 2;
  }

  return decimals;
}

export function getPriceDecimals(ccy: string): number {
  let decimals = _get(CURRENCY_DECIMALS_INFO_MAP, [ccy, "decimalPrice"], null);
  if (decimals === null) {
    decimals = getPrecisionFromNumber(getMinPrice(ccy));
    _set(CURRENCY_DECIMALS_INFO_MAP, [ccy, "decimalPrice"], decimals);
  }

  return decimals;
}

export function isValidSymbol(ccy: string): boolean {
  return ccy && INSTRUMENT_INFO.hasOwnProperty(ccy);
}

export function getMinAmount(ccy: string): number {
  return _get(INSTRUMENT_INFO, [ccy, "minSize"]) || getMinNumberByDecimals(8);
}

export function getMaxAmount(ccy: string): number {
  return _get(INSTRUMENT_INFO, [ccy, "maxSize"]) || Number.MAX_SAFE_INTEGER;
}

export function getMinPrice(ccy: string): number {
  return _get(INSTRUMENT_INFO, [ccy, "priceIncrement"]) || 0.1;
}

export function getMaxPrice(ccy: string): number {
  return Number.MAX_SAFE_INTEGER;
}

export function getPrecisionFromNumber(a: number): number {
  if (!isFinite(a)) return 0;
  var e = 1,
    p = 0;
  while (Math.round(a * e) / e !== a) {
    e *= 10;
    p++;
  }
  return p;
}

export function getNiceCCy(ccy: string): string {
  return (
    _get(CURRENCY_INFO, [ccy, "base"], "") +
    "/" +
    _get(CURRENCY_INFO, [ccy, "quote"], "")
  );
}

export function getSymbolId(ccy: string): number {
  return _get(INSTRUMENT_INFO, [ccy, "symbolEnum"], 0);
}
