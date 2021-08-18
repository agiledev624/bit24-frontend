import { WalletType } from "@/constants/balance-enums";
import {
  MessageType,
  OrderSide,
  OrderType,
  TIF,
  TradeOption,
} from "@/constants/order-enums";
import { SymbolType, SymbolValue } from "@/constants/symbol-enums";
import { WebSocketKindEnum } from "@/constants/websocket.enums";
import { getSymbolId } from "@/exports/ticker.utils";
import { OrderItem } from "@/models/order.model";
import { TransactionManner } from "@/packets/transaction.packet";
import { sendWsData } from "./ws.actions";

export const ORDER_NEW = "@order/ORDER_NEW";

export const ORDER_NEW_ACCEPTED = "@order/ORDER_NEW_ACCEPTED";
export const ORDER_UPDATED = "@order/ORDER_UPDATED";

export const ORDER_EXECUTION = "@order/ORDER_EXECUTION";
export const EXECUTION_PARTIAL = "@order/EXECUTION_PARTIAL";
export const ORDER_REJECTED = "@order/ORDER_REJECTED";
export const ORDER_CANCELLED = "@order/ORDER_CANCELLED";

export function orderUpdated(msgType: MessageType, newOrder: OrderItem) {
  return {
    type: ORDER_UPDATED,
    payload: {
      msgType,
      newOrder,
    },
  };
}

export function newOrderAccepted(newOrder: OrderItem) {
  return {
    type: ORDER_NEW_ACCEPTED,
    payload: newOrder,
  };
}

interface NewOrderParams {
  tradeOptions?: TradeOption[];
  clientOrderId: number;
  type: OrderType;
  pair: string;
  side: OrderSide;
  price: number;
  amount: number;
  stopPrice?: number;
  tif?: TIF;
  symbolType?: WalletType;
}

export function submitNewOrder({
  tradeOptions,
  clientOrderId,
  type,
  pair,
  side,
  price,
  amount,
  stopPrice,
  tif = TIF.GTC,
  symbolType,
}: NewOrderParams) {
  // console.log('>>>>>>>> submit new order params <<<<<<<',
  // { tradeOptions,
  //   clientOrderId,
  //   ordertype: type,
  //   pair,
  //   side,
  //   price,
  //   amount,
  //   stopPrice,
  //   tif
  // });
  const symbolEnum = getSymbolId(pair) || SymbolValue.BTC;

  const params = {
    orderMessageType: MessageType.ORDER_NEW,
    accountId: 100500,
    clientOrderId: clientOrderId,
    symbolEnum: SymbolValue.BTC,
    symbol: "BTC",
    orderType: type,
    symbolType: SymbolType.SPOT,
    price: price,
    side,
    qty: amount,
    tif,
    sendingTime: Date.now(),
    stopPrice,
  };
  const order = TransactionManner.send(params);

  // console.log('transaction buffer:', order);
  console.log(
    ">>> origin data for submit new Order",
    TransactionManner.read(order)
  );
  console.log("transaction reader:", TransactionManner.read(order, true));

  return sendWsData(WebSocketKindEnum.ORDERS, order);
}

export function cancelOrder({ clientOrderId, order }) {
  console.log(">>> origin order", { ...order });
  const params = {
    ...order,
    symbolEnum: SymbolValue.BTC,
    orderMessageType: MessageType.ORDER_CANCEL,
    clientOrderId: Date.now(),
    side: order.side,
    sendingTime: Date.now(),
    orderId: order.clientOrderId,
    origPrice: order.price,
  };
  const orderPacket = TransactionManner.send(params);

  console.log(">>> origin data for canceling Order", { ...order });
  console.log("transaction reader:", TransactionManner.read(orderPacket, true));

  return sendWsData(WebSocketKindEnum.ORDERS, orderPacket);
}

export interface ReplaceOrderParams {
  clientOrderId: number;
  order: OrderItem;
  price?: number;
  qty?: number;
  stopPrice?: number;
  sl?: number;
  tp?: number;
}

export function replaceOrder({
  clientOrderId,
  order,
  price,
  qty,
  stopPrice,
  sl,
  tp,
}: ReplaceOrderParams) {
  const params = {
    ...order,
    symbolEnum: SymbolValue.BTC,
    orderMessageType: MessageType.ORDER_CANCEL,
    clientOrderId,
    orderId: order.clientOrderId,
    price: price || order.price,
    qty: qty || order.qty,
    stopPrice: stopPrice || order.stopPrice,
    // sl: price || order.price,
    tp: tp || order.takeProfitPrice,
    // symbolEnum: SymbolValue.BTC,
    // orderType: type,
    // symbolType: SymbolType.SPOT,
    // price: price,
    // side,
    // qty: amount,
    // tif,
    // sendingTime: Date.now(),
    // stopPrice,
    // symbol: 'Bitcoin'
  };
  const orderSender = TransactionManner.send(params);

  // console.log('transaction buffer:', order);
  console.log(
    "[replace order] transaction reader:",
    TransactionManner.read(orderSender, true)
  );

  return sendWsData(WebSocketKindEnum.ORDERS, orderSender);
}
