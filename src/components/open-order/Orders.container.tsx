import { OrderType } from "@/constants/order-enums";
import { getOpenOrdersArray } from "@/selectors/order.selectors";
import { connect } from "react-redux";
import Orders from "./Orders";
import { OrderKind } from "./Orders.columns";
import { mapDispatchToProps } from "./orders.map-dispatch-to-props";

const a = (amount?: number) => ({
  id: 1,
  uuid: 1,
  symbol: "BTCUSDT",
  pair: "BTCUSDT",
  tradeType: 1,
  execShares: 1,
  avgPrice: 2,
  stopPrice: 0,
  ccy: "BTC",
  orderType: OrderType.PEG_HIDDEN,
  side: 1,
  clientOrderId: Date.now(),
  qty: amount ? amount : 2.112,
  price: 2.01,
  status: 1,
  createdAt: Date.now(),
});

const o = [
  {
    id: 1,
    uuid: 1,
    symbol: "BTCUSDT",
    pair: "BTCUSDT",
    tradeType: 1,
    execShares: 1,
    avgPrice: 2,
    stopPrice: 0,
    ccy: "BTC",
    orderType: OrderType.PEG_HIDDEN,
    side: 1,
    clientOrderId: Date.now(),
    qty: 11.5,
    price: 2.01,
    status: 1,
    createdAt: Date.now(),
  },
  {
    id: 2,
    uuid: 2,
    symbol: "BTCUSDT",
    pair: "BTCUSDT",
    tradeType: 1,
    execShares: 2.4,
    avgPrice: 1.2,
    stopPrice: 0,
    ccy: "BTC",
    orderType: OrderType.LIMIT,
    takeProfitPrice: 1.3,
    stopLossPrice: 0.4,
    side: 1,
    clientOrderId: Date.now(),
    qty: 4.12,
    price: 3.01,
    status: 1,
    createdAt: Date.now(),
  },
];

const mapStateToProps = (state) => ({
  orders: getOpenOrdersArray(state),
  orderKind: OrderKind.OPEN,
  // orders: [],
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
