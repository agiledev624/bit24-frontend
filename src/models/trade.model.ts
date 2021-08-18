import { OrderBookSideEnum } from "@/constants/order-book-enums";

export interface TradeItemModel {
  id: number;
  price: number;
  amount: number;
  date: number;
  side: OrderBookSideEnum;
}
