export const d_cols = [
  {
    dataKey: "pair",
    title: "Pair/24H Vol",
    disableSort: true,
    minWidth: 55,
    maxWidth: 100,
  },
  {
    dataKey: "lastPrice",
    disableSort: true,
    title: "Price/24H%",
    minWidth: 55,
    width: 55,
    flexGrow: 1,
    headerStyle: {
      textAlign: "right",
    },
  },
  {
    title: "24H Chart",
    dataKey: "chart",
    width: 73,
    disableSort: true,
    minWidth: 73,
    flexGrow: 1,
  },
  {
    dataKey: "high_low",
    disableSort: true,
    title: "24H High/Low",
    width: 65,
    flexGrow: 1,
  },
];

export const d_rows = [
  {
    dailyChangePerc: 2.23, // Price/24H%
    high: 0.00004256,
    lastPrice: 0.058899,
    low: 0.00003812,
    ccy: "ADABTC", // Pair
    priceChange: 0.00004012, // Price/24H%
    volume: 23123123.7, //24H Vol
    tradeType: "Spot",
    // chart_24h: {
    //   "2021-07-20 09:10:23": 0.023,
    //   "2021-07-20 10:20:23": 0.323,
    //   "2021-07-20 11:30:23": 0.003,
    //   "2021-07-20 12:40:23": 0.023,
    //   "2021-07-20 13:50:23": 0.022,
    //   "2021-07-20 14:10:23": 0.001,
    //   "2021-07-20 15:20:23": 0.02,
    //   "2021-07-20 16:30:23": 0.053,
    // },
  },
  {
    dailyChangePerc: -4.64, // Price/24H%
    high: 34156.3,
    lastPrice: 0.058899,
    low: 31138.9,
    ccy: "BTCUSDT", // Pair
    priceChange: 32881.9, // Price/24H%
    volume: 4123123123, //24H Vol
    tradeType: "USDT-M",
    // chart_24h: {
    //   "2021-07-20 09:10:23": 32342.3,
    //   "2021-07-20 10:20:23": 31422.6,
    //   "2021-07-20 11:30:23": 35992.3,
    //   "2021-07-20 12:40:23": 29343.2,
    //   "2021-07-20 13:50:23": 29873.9,
    //   "2021-07-20 14:10:23": 30032.3,
    //   "2021-07-20 15:20:23": 31234.5,
    //   "2021-07-20 16:30:23": 31111.1,
    // },
  },
  {
    dailyChangePerc: -4.64, // Price/24H%
    high: 34156.3,
    lastPrice: 0.058899,
    low: 31138.9,
    ccy: "BTCUSDT", // Pair
    priceChange: 32881.9, // Price/24H%
    volume: 823223625, //24H Vol
    tradeType: "Coin-M",
    // chart_24h: {
    //   "2021-07-20 09:10:23": 32342.3,
    //   "2021-07-20 10:20:23": 31422.6,
    //   "2021-07-20 11:30:23": 35992.3,
    //   "2021-07-20 12:40:23": 29343.2,
    //   "2021-07-20 13:50:23": 29873.9,
    //   "2021-07-20 14:10:23": 30032.3,
    //   "2021-07-20 15:20:23": 31234.5,
    //   "2021-07-20 16:30:23": 31111.1,
    // },
  },
];
