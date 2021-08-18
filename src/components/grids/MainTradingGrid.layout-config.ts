import { WorkspaceSettingEnum } from "@/models/workspace-setting";

export const GRID_ROW_HEIGHT = 10;

//@todo: add more breakpoints for trading
export const MainGridBreakPoints = {
  lg: 1600,
  md: 1000,
  // sm: 768,
  // xs: 480,
  // xxs: 0
};

export const COLS = {
  lg: 24,
  md: 24,
  // sm: 6,
  // xs: 4
};

const lgLayout = [
  {
    i: WorkspaceSettingEnum.ORDERBOOK,
    x: 0,
    y: 0,
    w: 6,
    h: 60,
    minH: 14,
    minW: 5,
  },
  { i: WorkspaceSettingEnum.TRADE, x: 0, y: 20, w: 6, h: 36, minH: 6, minW: 5 },
  {
    i: WorkspaceSettingEnum.MARKET_HISTORY,
    x: 15,
    y: 48,
    w: 18,
    h: 36,
    minH: 8,
    minW: 8,
  },
  {
    i: WorkspaceSettingEnum.CHART,
    x: 6,
    y: 0,
    w: 13,
    h: 60,
    minW: 6,
    minH: 20,
  },
  {
    i: WorkspaceSettingEnum.MARKET,
    x: 20,
    y: 0,
    w: 5,
    h: 60,
    minW: 4,
    minH: 20,
  },
];

const mdLayout = [
  {
    i: WorkspaceSettingEnum.ORDERBOOK,
    x: 0,
    y: 0,
    w: 6,
    h: 43,
    minH: 14,
    minW: 5,
  },
  { i: WorkspaceSettingEnum.TRADE, x: 0, y: 20, w: 6, h: 20, minH: 6, minW: 5 },
  {
    i: WorkspaceSettingEnum.MARKET_HISTORY,
    x: 6,
    y: 48,
    w: 18,
    h: 20,
    minH: 8,
    minW: 5,
  },
  {
    i: WorkspaceSettingEnum.CHART,
    x: 6,
    y: 0,
    w: 13,
    h: 43,
    minW: 3,
    minH: 20,
  },
  {
    i: WorkspaceSettingEnum.MARKET,
    x: 20,
    y: 0,
    w: 5,
    h: 43,
    minW: 3,
    minH: 20,
  },
];

// // 12 cols
// // rowHeight = 10
// // OrderBook: h = 16
// // Trade: h = 12
// // Chart: h = 28
// // Market history: 8
// const mdLayout = [
//   { i: WorkspaceSettingEnum.CHART, x: 0, y: 0, w: 9, h: 28, minW: 2, minH: 2 },
//   { i: WorkspaceSettingEnum.ORDERBOOK, x: 9, y: 0, w: 3, h: 15, minH: 2 },
//   { i: WorkspaceSettingEnum.TRADE, x: 9, y: 15, w: 3, h: 13, minH: 2 },
//   { i: WorkspaceSettingEnum.MARKET_HISTORY, x: 0, y: 28, w: 12, h: 6, minH: 2 },
// ];

// 6 cols
// rowHeight = 10
// OrderBook: h = 16
// Trade: h = 12
// Chart: h = 28
// Market history: 8
const smLayout = [
  { i: WorkspaceSettingEnum.CHART, x: 0, y: 0, w: 6, h: 20, minW: 2, minH: 2 },
  {
    i: WorkspaceSettingEnum.MARKET,
    x: 18,
    y: 0,
    w: 6,
    h: 43,
    minW: 4,
    minH: 20,
  },
  { i: WorkspaceSettingEnum.ORDERBOOK, x: 0, y: 20, w: 3, h: 10, minH: 2 },
  { i: WorkspaceSettingEnum.TRADE, x: 3, y: 20, w: 3, h: 10, minH: 2 },
  { i: WorkspaceSettingEnum.MARKET_HISTORY, x: 0, y: 40, w: 6, h: 6, minH: 2 },
];

// 4 cols
// rowHeight = 10
// OrderBook: h = 16
// Trade: h = 12
// Chart: h = 28
// Market history: 8
const xsLayout = [
  { i: WorkspaceSettingEnum.CHART, x: 0, y: 0, w: 4, h: 12, minW: 2, minH: 2 },
  { i: WorkspaceSettingEnum.ORDERBOOK, x: 0, y: 12, w: 4, h: 8, minH: 2 },
  { i: WorkspaceSettingEnum.TRADE, x: 0, y: 20, w: 4, h: 5, minH: 2 },
  { i: WorkspaceSettingEnum.MARKET_HISTORY, x: 0, y: 25, w: 4, h: 6, minH: 2 },
];

export const MainGridLayout = {
  lg: lgLayout,
  md: mdLayout,
  // sm: smLayout,
  // sm: smLayout,
  // xs: xsLayout,
};
