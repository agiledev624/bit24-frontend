import { OrderSide } from "./order-enums";

export enum OrderBookStyleEnum {
  SINGLE_COL = 1,
  DUAL_COL = 2,
}

export enum OrderBookSideEnum {
  BID = OrderSide.BUY,
  ASK = OrderSide.SELL,
}

// top 5, 10, 20 bids, asks update
export enum OrderBookDepthLimitEnum {
  LVL1 = 5,
  LVL2 = 10,
  LVL3 = 50,
}

// order book layer means the number of layer will get from server
// StartSlayer = 1 means you get all 60 price layers, 30 buy/30 sell.
// StartLayer = 2 means you get buy/sell layers starting at the Layer 10
// and StartLayer = 3 means you get 10 layers starting at layer 20.
export enum OrderBookStartLayer {
  L1 = 1,
  L2 = 2,
  L3 = 3,
}
