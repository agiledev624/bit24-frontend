import moment from "moment";
function randRange(min, max) {
  return Math.random() * (max - min) + min;
}
const PAIRS = [
  "ADABTC",
  "BTCUSDT",
  "BTCUSDT",
  "DOGEUSDT",
  "DOGEUSDT",
  "EOSBTC",
  "LINKUSDT",
  "TRXBTC",
  "ZRXUSDT",
  "ZRXUSDT1",
  "ZRXUSDT2",
  "ZRXUSDT3",
  "ZRXUSDT4",
  "ZRXUSDT5",
  "ZRXUSDT6",
];
const TRADE_TYPE = ["spot", "usdt-m", "coin-m"];

const timelineMiliseconds = (desiredStartTime, interval, period) => {
  const periodsInADay = moment.duration(1, "day").as(period);

  const timeLabels = [];
  const startTimeMoment = moment(new Date(desiredStartTime), "hh:mm:ss");
  for (let i = 0; i < periodsInADay; i += interval) {
    startTimeMoment.add(i === 0 ? 0 : interval, period);
    timeLabels.push(
      desiredStartTime + " " + startTimeMoment.format("HH:mm:ss")
    );
  }

  return timeLabels.sort((a, b) => new Date(a) - new Date(b));
};

const getTimeSeriesData = () => {
  const times = timelineMiliseconds("2021-07-27", 1, "hour");
  let data = [];
  times.forEach((t) => data.push({ time: t, volume: randRange(10, 200) }));
  return data;
};

export const genMock = () => {
  let markets = [];
  PAIRS.forEach((p) =>
    markets.push({
      pair: p,
      amount: randRange(12000, 50000000),
      tradeType: TRADE_TYPE[Math.floor(randRange(0, 2))],
      price: randRange(0.00004012, 0.69),
      percent: randRange(-20.0, 20.0),
      series: getTimeSeriesData(),
    })
  );
  return markets;
};
