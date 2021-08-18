import { getTheme } from "@/exports";
import { getChartingLibraryPath } from "./Chart.constants";
import { THEMES } from "@/constants/app.constants";

export const TRADING_PRIMITIVE_FONT = "bold 8pt Arial";

export const getChartCssUrl = () =>
  `${getChartingLibraryPath()}chart-${getTheme()}.css`;

export const getChartSettingsKey = () => "chart_settings";

const COLORS = {
  light: {
    bg: "#fafbfa",
    redDark: "#d23017",
    redLight: "#e44e37",
    greenLight: "#11c562",
    greenDark: "#2b984b",
  },
  dark: {
    bg: "#191E21",
    redDark: "#e56846",
    redLight: "rgba(229, 104, 70, 0.9)",
    greenDark: "#35b073",
    greenLight: "rgba(53, 176, 115, 0.9)",
  },

  grayscale1: "#FBFCFE",
  grayscale2: "#F5F6F7",
  grayscale3: "#E6EAEB",
  grayscale4: "#DBDFE3",
  grayscale5: "#BFC3C6",
  grayscale6: "#A4A9AC",
  grayscale7: "#7E8486",
  grayscale8: "#646B6E",
  grayscale9: "#485054",
  grayscale10: "#253135",
  grayscale11: "#212D31",
  grayscale12: "#1B272B",
  grayscale13: "#152023",
  grayscale14: "#111B1E",
  grayscale15: "#0C171A",
};

const DARK_THEME_STYLE = {
  bg: COLORS.dark.bg,
  crosshair: "#626c73",
  short: COLORS.dark.redDark,
  shortFill: COLORS.dark.redDark,
  long: COLORS.dark.greenLight,
  longFill: COLORS.dark.greenLight,
  cta: "#363D52",
  ctaHighlight: "#414A67",
  alert: "#FFD506",
  category: "dark",
  grid: "rgba(0, 0, 0, 0)",
  lineColor: "rgb(26,39,51)",
  textColor: "#999",
  transparency: 65,
  ordersVis: {
    ask: {
      lineColor: COLORS.dark.redLight,
      bodyTextColor: COLORS.dark.redDark,
      quantityTextColor: COLORS.dark.redDark,
      cancelButtonIconColor: COLORS.dark.redDark,
      bodyBorderColor: COLORS.dark.redLight,
      quantityBorderColor: COLORS.dark.redLight,
      cancelButtonBorderColor: COLORS.dark.redLight,
      bodyBackgroundColor: COLORS.dark.bg,
      quantityBackgroundColor: COLORS.dark.bg,
      cancelButtonBackgroundColor: COLORS.dark.bg,
    },
    bid: {
      lineColor: COLORS.dark.greenLight,
      bodyTextColor: COLORS.dark.greenLight,
      quantityTextColor: COLORS.dark.greenLight,
      cancelButtonIconColor: COLORS.dark.greenLight,
      bodyBorderColor: COLORS.dark.greenLight,
      quantityBorderColor: COLORS.dark.greenLight,
      cancelButtonBorderColor: COLORS.dark.greenLight,
      bodyBackgroundColor: COLORS.dark.bg,
      quantityBackgroundColor: COLORS.dark.bg,
      cancelButtonBackgroundColor: COLORS.dark.bg,
    },
  },
  posVis: {
    lineColor: COLORS.grayscale8,
    bodyTextColor: COLORS.grayscale7,
    quantityTextColor: COLORS.grayscale7,
    cancelButtonIconColor: COLORS.grayscale7,
    bodyBorderColor: COLORS.grayscale8,
    quantityBorderColor: COLORS.grayscale8,
    cancelButtonBorderColor: COLORS.grayscale8,
    bodyBackgroundColor: COLORS.grayscale15,
    quantityBackgroundColor: COLORS.grayscale15,
    cancelButtonBackgroundColor: COLORS.grayscale15,
  },
  alerts: {
    lineColor: COLORS.dark.redDark,
    bodyTextColor: COLORS.dark.redDark,
    quantityTextColor: COLORS.dark.redDark,
    cancelButtonIconColor: COLORS.dark.redDark,
    bodyBorderColor: COLORS.dark.greenLight,
    quantityBorderColor: COLORS.dark.greenLight,
    cancelButtonBorderColor: COLORS.dark.greenLight,
    bodyBackgroundColor: COLORS.dark.bg,
    quantityBackgroundColor: COLORS.dark.bg,
    cancelButtonBackgroundColor: COLORS.dark.bg,
  },
};

const LIGHT_THEME_STYLE = {
  bg: COLORS.light.bg,
  crosshair: "#888888",
  short: COLORS.light.redDark,
  shortFill: COLORS.light.redLight,
  long: COLORS.light.greenDark,
  longFill: COLORS.light.greenLight,
  cta: "#FBFBFB",
  ctaHighlight: "#F5F5F5",
  alert: "#FFD506",
  category: "light",
  grid: "#E6E6E6",
  lineColor: "#555",
  textColor: "#999",
  transparency: 60,
  ordersVis: {
    ask: {
      lineColor: COLORS.light.redDark,
      bodyTextColor: COLORS.light.redDark,
      quantityTextColor: COLORS.light.redDark,
      cancelButtonIconColor: COLORS.light.redDark,
      bodyBorderColor: COLORS.light.redDark,
      quantityBorderColor: COLORS.light.redDark,
      cancelButtonBorderColor: COLORS.light.redDark,
      bodyBackgroundColor: COLORS.grayscale2,
      quantityBackgroundColor: COLORS.grayscale2,
      cancelButtonBackgroundColor: COLORS.grayscale2,
    },
    bid: {
      lineColor: COLORS.light.greenDark,
      bodyTextColor: COLORS.light.greenDark,
      quantityTextColor: COLORS.light.greenDark,
      cancelButtonIconColor: COLORS.light.greenDark,
      bodyBorderColor: COLORS.light.greenDark,
      quantityBorderColor: COLORS.light.greenDark,
      cancelButtonBorderColor: COLORS.light.greenDark,
      bodyBackgroundColor: COLORS.grayscale2,
      quantityBackgroundColor: COLORS.grayscale2,
      cancelButtonBackgroundColor: COLORS.grayscale2,
    },
  },
  posVis: {
    lineColor: COLORS.grayscale7,
    bodyTextColor: COLORS.grayscale7,
    quantityTextColor: COLORS.grayscale7,
    cancelButtonIconColor: COLORS.grayscale7,
    bodyBorderColor: COLORS.grayscale6,
    quantityBorderColor: COLORS.grayscale6,
    cancelButtonBorderColor: COLORS.grayscale6,
    bodyBackgroundColor: COLORS.grayscale2,
    quantityBackgroundColor: COLORS.grayscale2,
    cancelButtonBackgroundColor: COLORS.grayscale2,
  },
  alerts: {
    lineColor: COLORS.light.redDark,
    bodyTextColor: COLORS.light.redDark,
    quantityTextColor: COLORS.light.redDark,
    cancelButtonIconColor: COLORS.light.redDark,
    bodyBorderColor: COLORS.light.greenLight,
    quantityBorderColor: COLORS.light.greenLight,
    cancelButtonBorderColor: COLORS.light.greenLight,
    bodyBackgroundColor: "#FBFBFB",
    quantityBackgroundColor: "#FBFBFB",
    cancelButtonBackgroundColor: "#FBFBFB",
  },
};

const THEME_MAP = {
  [THEMES.LIGHT_THEME]: LIGHT_THEME_STYLE,
  [THEMES.DARK_THEME]: DARK_THEME_STYLE,
};

export function getCurrentStyle() {
  return THEME_MAP[getTheme()];
}

export const getBackgroundColor = () => getCurrentStyle().bg;

export function getChartOverrides() {
  const style = getCurrentStyle();
  return {
    "paneProperties.background": style.bg,
    "paneProperties.vertGridProperties.color": style.grid,
    "paneProperties.horzGridProperties.color": style.grid,
    "paneProperties.crossHairProperties.color": style.crosshair,
    "paneProperties.topMargin": 14,
    "scalesProperties.backgroundColor": style.bg,
    "scalesProperties.lineColor": style.lineColor,
    "scalesProperties.textColor": style.textColor,
    "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",

    volumePaneSize: "large",
    "symbolWatermarkProperties.transparency": 90,

    "mainSeriesProperties.style": 1,
    "mainSeriesProperties.priceLineWidth": 1,

    //  Candles styles
    "mainSeriesProperties.candleStyle.upColor": style.long,
    "mainSeriesProperties.candleStyle.downColor": style.short,
    "mainSeriesProperties.candleStyle.drawWick": true,
    "mainSeriesProperties.candleStyle.drawBorder": true,
    "mainSeriesProperties.candleStyle.borderColor": "#C400CB",
    "mainSeriesProperties.candleStyle.borderUpColor": style.long,
    "mainSeriesProperties.candleStyle.borderDownColor": style.short,
    "mainSeriesProperties.candleStyle.wickUpColor": style.long,
    "mainSeriesProperties.candleStyle.wickDownColor": style.short,

    // Hollow Candles styles
    "mainSeriesProperties.hollowCandleStyle.upColor": style.long,
    "mainSeriesProperties.hollowCandleStyle.downColor": style.short,
    "mainSeriesProperties.hollowCandleStyle.drawWick": true,
    "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
    "mainSeriesProperties.hollowCandleStyle.borderColor": "#C400CB",
    "mainSeriesProperties.hollowCandleStyle.borderUpColor": style.long,
    "mainSeriesProperties.hollowCandleStyle.borderDownColor": style.short,
    "mainSeriesProperties.hollowCandleStyle.wickUpColor": style.long,
    "mainSeriesProperties.hollowCandleStyle.wickDownColor": style.short,

    "study_Overlay@tv-basicstudies.barStyle.upColor": "blue",
    "study_Overlay@tv-basicstudies.barStyle.downColor": "blue",

    "study_Overlay@tv-basicstudies.lineStyle.color": "blue",

    "study_Overlay@tv-basicstudies.areaStyle.color1": "blue",
    "study_Overlay@tv-basicstudies.areaStyle.color2": "blue",
    "study_Overlay@tv-basicstudies.areaStyle.linecolor": "blue",
  };
}

// https://github.com/tradingview/charting_library/wiki/Studies-Overrides
export function getChartStudiesOverrides() {
  const style = getCurrentStyle();

  return {
    "volume.volume.color.0": style.short,
    "volume.volume.color.1": style.long,
    "volume.volume.transparency": style.transparency,
  };
}

export function getLoadingScreenStyle() {
  const style = getCurrentStyle();

  return {
    backgroundColor: style.bg,
    foregroundColor: style.textColor,
  };
}
