export enum WebSocketKindEnum {
  ADMIN_RISK = 1,
  ORDERS, // for orders, positions, ....
  MARKET, // for market data, historical data ...
}

export enum WebSocketKindStateEnum {
  IDLE = 0, // there's no websocket instance or closed
  CONNECTING = 1,
  OPENED = 2,
  AUTHORIZED = 3,
}

export enum WebSocketChannelEnum {
  MARKET = 1,
  TRADES = 2,
  ORDERBOOK = 3,
  CHART = 4,
}

export const WebSocketChannelParams = {
  [WebSocketChannelEnum.MARKET]: "!ticker@arr",
  [WebSocketChannelEnum.TRADES]: "<symbol>@aggTrade",
  [WebSocketChannelEnum.ORDERBOOK]: "<symbol>@depth<level>@<speed>ms", // level: 5, 10, 20 | speed: default = 100ms
  [WebSocketChannelEnum.CHART]: "<symbol>@kline_<interval>m", //interval: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
};

export enum PacketHeaderMessageType {
  CLIENT_LOGIN = "H",
  EXEC_REPORT = "V",
  TRANSACTION = "T",
  SUBSCRIBE = "s",
  UNSUBSCRIBE = "u",
  RISK_ACCOUNT = "R",
  RISK_USER_SYMBOL = "N",
  INSTRUMENT = "Q",
  INSTRUMENT_REQUEST = "Y",
  BOOK_10 = "O", // ten level data
  BOOK_20 = "S", // 20 level data
  BOOK_30 = "U", // 30 level data
}
