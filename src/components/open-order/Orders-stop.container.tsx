import { OrderType } from "@/constants/order-enums";
import { getStopOrdersArray } from "@/selectors/order.selectors";
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
  stopPrice: 1.5,
  ccy: "BTC",
  orderType: OrderType.STOP_LMT,
  side: 1,
  clientOrderId: Date.now(),
  qty: amount ? amount : 2.112,
  price: 2.01,
  status: 1,
  createdAt: Date.now(),
});

const o = [a()];

const mapStateToProps = (state) => ({
  orders: getStopOrdersArray(state),
  // orders: [],
  orderKind: OrderKind.STOP,
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
