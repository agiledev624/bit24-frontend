import { getPriceDecimals } from "@/exports/ticker.utils";
import { fromFetch } from "rxjs/fetch";
import { delay, retryWhen, take, timeout } from "rxjs/operators";
import { getConfig, RESOLUTION_MAP, SYMBOL_INFO } from "./Chart.config";
import {
  MS_IN_INTERVAL,
  CANDLES_FETCH_LIMITS,
  CANDLES_FETCH_ATTEMPS,
} from "./Chart.constants";

function addEmptyCandles(candles, interval, start = null, end = null) {
  if (!Array.isArray(candles) || candles.length === 0) {
    return candles;
  }

  let earliestTime = candles[0].time,
    lastPrice = candles[0].close;

  const intervalMilliseconds = getMsInInterval(interval);
  if (start) {
    lastPrice = 0;
    while (earliestTime - intervalMilliseconds >= start) {
      earliestTime -= intervalMilliseconds;
    }
  }

  let time = earliestTime;
  let index = 0;
  const result = [];
  let latestTime = candles[candles.length - 1].time;

  if (end) {
    while (latestTime + intervalMilliseconds <= end) {
      latestTime += intervalMilliseconds;
    }
  }

  while (time <= latestTime) {
    const candle = candles[index];

    if (candle !== undefined && candle.time === time) {
      index += 1;
      lastPrice = candle.close;
      result.push(candle);
    } else {
      result.push(generateEmptyCandle(time, lastPrice));
    }

    time += intervalMilliseconds;
  }

  return result;
}

export function createChartWidget(additionalConfig) {
  const config = getConfig(additionalConfig);
  //@ts-ignore
  const { TradingView = {} } = window;
  const { widget } = TradingView;
  // eslint-disable-next-line new-cap
  return new widget(config);
}

export function convertCandleToTVFormat(candle) {
  return {
    ...candle,
    time: candle.mts,
  };
}

export function generateEmptyCandle(time, price) {
  return {
    time,
    open: price,
    close: price,
    high: price,
    low: price,
    volume: 0,
  };
}

export const getMsInInterval = (interval) => MS_IN_INTERVAL[interval];

export function extractCandlesFromSnapshot(
  candles: number[],
  interval: string,
  endTime: number
) {
  if (!candles) {
    return null;
  }

  return addEmptyCandles(
    // timestamp array
    Object.keys(candles)
      //@ts-ignore
      .sort((a, b) => a - b)
      .map((timestamp) => convertCandleToTVFormat(candles[timestamp])),
    interval,
    null,
    endTime
  );
}

export function getEarliestCandleTime(candles) {
  if (!Array.isArray(candles) || candles.length === 0) {
    return Number.NaN;
  }

  return candles[0].time;
}

export function getNumberOfDecimalsByPrice(price, significantDigits = 5) {
  return Math.max(0, significantDigits - 1 - Math.floor(Math.log10(price)));
}

// Translates the resolution that tradingview knows about to the resolution that bitfinex side needs
export function generateSymbolKey(resolution, pair) {
  const translatedResolution = RESOLUTION_MAP[resolution];

  return `symbol=${pair}&interval=${translatedResolution}`;
}

function determineFetchLimit(start, end, interval) {
  const estimatedNumberOfCandles = Math.ceil(
    (end - start) / getMsInInterval(interval)
  );

  const maxLimit = CANDLES_FETCH_LIMITS[CANDLES_FETCH_LIMITS.length - 1];

  return CANDLES_FETCH_LIMITS.find(
    (item) => item > estimatedNumberOfCandles || item === maxLimit
  );
}

const historyURL = (resolution, symbol) =>
  `https://api.binance.com/api/v3/klines?${generateSymbolKey(
    resolution,
    symbol
  )}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchCandlesAsync(
  start,
  end,
  interval,
  pair,
  onSuccess,
  onError
) {
  const limit = determineFetchLimit(start, end, interval);

  // const startInSeconds = Math.round(start / 1000);
  // const endInSeconds = Math.round(end / 1000);

  const url = `${historyURL(interval, pair)}&endTime=${end}&limit=${limit}`;
  let attemptsLeft = CANDLES_FETCH_ATTEMPS;
  let error = {};

  fromFetch(url, {
    selector: (response) => response.json(),
  })
    .pipe(
      retryWhen((errors) =>
        errors.pipe(delay(1000), take(CANDLES_FETCH_ATTEMPS))
      ),
      timeout(3000)
    )
    .subscribe(
      (data) => {
        //@ts-ignore
        let candles = (data || [])
          .sort((a, b) => a[0] - b[0])
          .map((item) => ({
            time: item[0],
            open: +item[1],
            high: +item[2],
            low: +item[3],
            close: +item[4],
            volume: Math.abs(item[5]),
          }));

        const hasMoreData = candles.length >= limit;

        return onSuccess(candles, hasMoreData);
        // error = { statusText: message };
      },
      (error) => {
        const errorStr = JSON.stringify(error);
        console.error("[chart.utils] errors:", errorStr);
        onError(errorStr);
      }
    );
}

export function executeAsync(func, ...args) {
  setTimeout(func.bind(null, ...args), 0);
}

export function getSymbolData(pair) {
  //TV may add prefix ":" resulting in "xx:ETHBTC" instead of ETHBTC
  var split_data = pair.split(/[:/]/);
  const symbolName = split_data[split_data.length - 1];
  const numberOfDecimals = getPriceDecimals(symbolName);
  const priceScale = 10 ** numberOfDecimals;

  return {
    ...SYMBOL_INFO,
    name: symbolName,
    // "ticker" is optional according to the docs, but "Heikin Ashi" doesn't work if "ticker" is not provided
    ticker: symbolName,
    description: symbolName,
    pricescale: priceScale,
  };
}
