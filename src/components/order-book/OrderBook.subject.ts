import { OrderBookSideEnum } from "@/constants/order-book-enums";
import { OrderSide } from "@/constants/order-enums";
import { shallowCompareObjects } from "@/exports";
import { Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

type OrderBookTransferData = {
  price: number;
  side: OrderBookSideEnum | OrderSide;
  amount?: number;
  isQuick?: boolean;
};
export const OrderBookSubject = new Subject<OrderBookTransferData>();

export const getOrderBookObservable = () =>
  OrderBookSubject.asObservable().pipe(
    distinctUntilChanged((prev, current) =>
      shallowCompareObjects(prev, current)
    )
  );
