import { OrderBookStartLayer } from "@/constants/order-book-enums";
import {
  MessageType,
  OrderSide,
  OrderStatus,
  OrderType,
  StopTrigger,
  TIF,
} from "@/constants/order-enums";
import { SymbolType, SymbolValue } from "@/constants/symbol-enums";

export type OrderItem = {
  orderId: string;
  clientOrderId: string;
  symbolEnum: SymbolValue;
  orderType: OrderType;
  symbolType: SymbolType;
  price: number;
  side: OrderSide;
  qty: number;
  tif: TIF;
  stopPrice: number;
  origPrice: number;
  symbol: string;
  cancelShares: number;
  execId: number;
  execShares: number;
  remainQty: number;
  execFee: number;
  expiredDate: string;
  tradeId: number;
  displaySize: number;
  refreshSize: number;
  layers: OrderBookStartLayer;
  sizeIncrement: number;
  priceIncrement: number;
  priceOffset: number;
  execPrice: number;
  status: OrderStatus;
  takeProfitPrice: number;
  triggerType: StopTrigger;
};

export type TransactionModel = OrderItem & {
  rejectReason: number;
  orderMessageType: MessageType;
};
