import {
  getChartCssUrl,
  getChartOverrides,
  getChartStudiesOverrides,
  getBackgroundColor,
  getLoadingScreenStyle,
} from "./Chart.themes";
import { INTERVAL, getChartingLibraryPath } from "./Chart.constants";

export const MIN_HEIGHT = 380;
export const MAX_HEIGHT = 1400;
export const HEIGHT_INCREMENT = 75;

export const CHART_ROOT_ELEMENT = "chart-root";

// all 2 settings above must be false in production
export const ENABLE_CHART_LOGGING = !!process.env.REACT_APP_CHART_LOGGING;
export const DEBUG_MODE = !!process.env.REACT_APP_CHART_DEBUG;

const LOCALE = "en";
const DECIMAL_SIGN = ".";

const ENABLED_FEATURES = [
  "move_logo_to_main_pane",
  // 'caption_buttons_text_if_possible'
];

const DISABLED_FEATURES = [
  "header_symbol_search",
  "header_compare",
  "header_undo_redo",
  "header_screenshot",
  "header_saveload",
  "border_around_the_chart",
  "remove_library_container_border",
  "volume_force_overlay",
  // 'left_toolbar',
  "study_templates",
  // 'header_indicators',
  // 'dont_show_boolean_study_arguments'
];

const TIME_FRAMES = [
  {
    text: "3M",
    resolution: INTERVAL.HOURS_12,
    description: "3 Months",
  },
  {
    text: "1M",
    resolution: INTERVAL.HOURS_4,
    description: "1 Month",
  },
  {
    text: "7D",
    resolution: INTERVAL.HOUR,
    description: "7 Days",
  },
  {
    text: "3D",
    resolution: INTERVAL.MINUTES_30,
    description: "3 Days",
  },
  {
    text: "1h",
    resolution: INTERVAL.MINUTE,
    description: "1 Hour",
  },
];

interface ConfigOptions {
  pair: string;
  //https://github.com/tradingview/charting_library/wiki/Widget-Constructor#datafeed
  datafeed: Object;
  interval: string;
  chartSettings: any;
  saveLoadAdapter?: any;
}
// configuration that's passed to TV widget constructor
export function getConfig(opts: Partial<ConfigOptions> = {}) {
  const { pair, datafeed, interval, chartSettings, saveLoadAdapter } = opts;

  const adapter = undefined;

  let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone === "Asia/Saigon") {
    timezone = "Asia/Bangkok";
  }

  return {
    debug: DEBUG_MODE,
    symbol: pair,
    datafeed,
    interval,
    timezone,
    saved_data: chartSettings,
    save_load_adapter: adapter,
    container_id: CHART_ROOT_ELEMENT,
    fullscreen: false,
    autosize: true,
    library_path: `${getChartingLibraryPath()}`,
    locale: LOCALE,
    // datafeedUrl: 'https://demo_feed.tradingview.com',
    // chartsStorageUrl: 'https://saveload.tradingview.com',
    // chartsStorageApiVersion: '1.1',
    // clientId: 'tradingview.com',
    // userId: 'public_user_id',
    numeric_formatting: { decimal_sign: DECIMAL_SIGN },
    // charts_storage_url: storageUrl,
    // charts_storage_api_version: CHARTS_STORAGE_API_VERSION,
    custom_css_url: getChartCssUrl(),
    overrides: getChartOverrides(),
    studies_overrides: getChartStudiesOverrides(),
    //  Regression Trend-related functionality is not implemented yet, so it's hidden for a while
    drawings_access: {
      type: "black",
      tools: [
        {
          name: "Regression Trend",
        },
      ],
    },
    enabled_features: ENABLED_FEATURES,
    disabled_features: DISABLED_FEATURES,
    time_frames: TIME_FRAMES,
    // override default auto_save throttling interval because throttling is manually implemented in chart.js
    auto_save_delay: 1,
    toolbar_bg: getBackgroundColor(),
    loading_screen: getLoadingScreenStyle(),
    favorites: {
      intervals: ["1", "5", "15", "30", "60", "D"],
      chartTypes: ["Line"],
    },
  };
}

// export const RESOLUTION_MAP = {
// 	[INTERVAL.MINUTE]: '1m',
// 	[INTERVAL.MINUTES_5]: '5m',
// 	[INTERVAL.MINUTES_15]: '15m',
// 	[INTERVAL.MINUTES_30]: '30m',
// 	[INTERVAL.HOUR]: '1h',
// 	[INTERVAL.HOURS_2]: '2h',
// 	[INTERVAL.HOURS_4]: '4h',
// 	[INTERVAL.DAY]: 'D',
// 	[INTERVAL.DAY1]: 'D',
// 	[INTERVAL.WEEK]: '1W',
// 	[INTERVAL.MONTH]: '1W'
// }

// binance
export const RESOLUTION_MAP = {
  [INTERVAL.MINUTE]: "1m",
  [INTERVAL.MINUTES_5]: "5m",
  [INTERVAL.MINUTES_15]: "15m",
  [INTERVAL.MINUTES_30]: "30m",
  [INTERVAL.HOUR]: "1h",
  [INTERVAL.HOURS_2]: "2h",
  [INTERVAL.HOURS_4]: "4h",
  //D -> w
  [INTERVAL.DAY]: "1w",
  [INTERVAL.DAY1]: "1d",
  [INTERVAL.WEEK]: "1w",
  [INTERVAL.MONTH]: "1M",
};
export const SUPPORTED_RESOLUTIONS = Array.from(
  new Set(Object.keys(RESOLUTION_MAP))
);

export const SYMBOL_INFO = {
  timezone: "UTC",
  minmov: 1,
  session: "24x7",
  has_intraday: true,
  has_no_volume: false,
  supported_resolutions: SUPPORTED_RESOLUTIONS,
};

export const SERVER_SIDE_CUSTOMIZATION = {
  exchanges: [],
  symbols_types: [],
  supported_resolutions: SUPPORTED_RESOLUTIONS,
  supports_search: false,
  supports_group_request: false,
  supports_marks: true,
  supports_timescale_marks: true,
};
