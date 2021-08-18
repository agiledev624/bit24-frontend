// number of candles expected in WS snapshot
export const SNAPSHOT_CANDLES_NUMBER = 240;

// number of candles that TV requests initially; subtracting 1 just in case,
// to avoid unnecessary REST calls
export const HISTORY_LOOKBACK_CANDLES = SNAPSHOT_CANDLES_NUMBER - 1;
export const CANDLES_FETCH_LIMITS = [1000, 1000, 1000];
export const CANDLES_FETCH_ATTEMPS = 3;
export const CANDLES_FETCH_TIMEOUT = 10 * 1000;
export const CANDLES_FETCH_RETRY_INTERVAL = 5 * 1000;

export const DOUBLE_CLICK_THRESHOLD = 500;

export const INTERVAL = {
  MINUTE: "1",
  MINUTES_5: "5",
  MINUTES_15: "15",
  MINUTES_30: "30",
  HOUR: "60",
  HOURS_2: "120",
  HOURS_4: "240",
  HOURS_12: "720",
  DAY: "D",
  DAY1: "1D",
  WEEK: "W",
  MONTH: "M",
};

const MS_IN_MINUTE = 1000 * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;
const MS_IN_WEEK = MS_IN_DAY * 7;

export const MS_IN_INTERVAL = {
  [INTERVAL.MINUTE]: MS_IN_MINUTE,
  [INTERVAL.MINUTES_5]: MS_IN_MINUTE * 5,
  [INTERVAL.MINUTES_15]: MS_IN_MINUTE * 15,
  [INTERVAL.MINUTES_30]: MS_IN_MINUTE * 30,
  [INTERVAL.HOUR]: MS_IN_HOUR,
  [INTERVAL.HOURS_2]: MS_IN_HOUR * 2,
  [INTERVAL.HOURS_4]: MS_IN_HOUR * 4,
  [INTERVAL.HOURS_12]: MS_IN_HOUR * 12,
  [INTERVAL.DAY]: MS_IN_DAY,
  [INTERVAL.DAY1]: MS_IN_DAY,
  [INTERVAL.WEEK]: MS_IN_WEEK,
  [INTERVAL.MONTH]: MS_IN_WEEK * 4,
};

export const getChartingLibraryPath = () => `/charting_library/`;

export const ANY_SYMBOL_MARK = "ANY";

export const ADD_EMPTY_CANDLE_TO_END_DELAY = 5000;
