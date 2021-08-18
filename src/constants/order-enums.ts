export enum OrderType {
  LIMIT = 1,
  MARKET,
  STOP_MKT,
  STOP_LMT,
  PEG,
  HIDDEN,
  PEG_HIDDEN,
  OCO,
  ICE,
  OCO_ICE,
  BRACKET,
  SNIPER_MKT,
  SNIPER_LIMIT,
  TSM, // TRAILING_STOP_MKT
  TSL, // TRAILING_STOP_LMT
}

/**
 * There will be another TIF:
  DAY = Day order only, only good for this session, when you log out this order will be cancelled
 */
export enum TIF { //  time in force
  FOK = 1, // Fill or Kill
  GTC, // Good till cancel
  IOC, // Immediate or Cancel
  // POO,     // (Post) Make only
  // RED,     // Reduce only
}

export enum TradeOption {
  POO = 1, // (Post) Make only
  RED, // Reduce only
}

/**
 * will be used in Executions to show where you added liquidity or took liquidity
 */
export enum FeeType {
  MAKE = 1,
  TAKE,
}

export enum OrderSide {
  BUY = 1,
  SELL,
  SELLSHORT,
}

export enum OrderStatus {
  REJECTED = -1,
  PENDING = 0,
  OPEN = 1,
  CANCELLED = 2,
  FILLED = 3,
  PARTIALLY_FILLED = 4,
  ADMIN_CANCELLED = 5,
}

export enum StopTrigger {
  LAST_PRICE = 1,
  INDEX,
  MARK,
}

export enum MessageType {
  ORDER_NEW = 1,
  CANCEL_REPLACE,
  MARGIN_CANCEL_REPLACE,
  MARGIN_EXECUTE,
  ORDER_STATUS,
  ORDER_CANCEL,
  MARGIN_CANCEL,
  EXECUTION,
  EXECUTION_PARTIAL,
  MARGIN_EXECUTION,
  MARGIN_PARTIAL_EXECUTION,
  REJECT,
  ORDER_REJECT,
  ORDER_ACK,
  CANCELLED,
  REPLACED,
  QUOTE_FILL,
  QUOTE_FILL_PARTIAL,
  MARGIN_REPLACED,
  CANCEL_REPLACE_REJECT,
}

export enum MarginType {
  CROSS = "cross",
  ISOLATE = "isolate",
}

export enum LastTradePriceType {
  MARK_PRICE = 1,
  LAST_PRICE,
}

export enum ICELayers {
  L2 = 2,
  L3,
  L4,
  L5,
  L6,
  L7,
  L8,
  L9,
  L10,
}
