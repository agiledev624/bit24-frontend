import React from "react";
import className from "classnames";
import { OrderBookSide } from "./OrderBook.side";
import { OrderBookSideEnum } from "@/constants/order-book-enums";
import { OrderBookModel } from "@/models/book.model";
import { OrderBookLastTick } from "./OrderBook.lastTick";
import { WalletType } from "@/constants/balance-enums";

export interface OrderBookProps {
  symbol: string;
  lastPrice: number;
  width: number;
  bids: OrderBookModel[];
  asks: OrderBookModel[];
  dualColumn?: boolean;
  showDepth?: boolean;
  maxSumSize: number;
  windowOpen?: boolean;
  enabled1Click?: boolean;
  walletType: WalletType;
}

function getSideData(
  bids: OrderBookModel[],
  asks: OrderBookModel[],
  side: OrderBookSideEnum
): OrderBookModel[] {
  return side === OrderBookSideEnum.ASK ? asks : bids;
}

export const OrderBook = ({
  symbol,
  width,
  lastPrice,
  bids,
  asks,
  dualColumn,
  showDepth,
  enabled1Click,
  maxSumSize,
  windowOpen,
  walletType,
}: Partial<OrderBookProps>) => {
  const bookClass = className(
    "orderBook",
    dualColumn ? "dualColumn" : "singleColumn",
    {
      "scroll-y": windowOpen,
      "show-order-btns": enabled1Click,
    }
  );

  const leftSide = dualColumn ? OrderBookSideEnum.BID : OrderBookSideEnum.ASK;
  const rightSide =
    leftSide === OrderBookSideEnum.ASK
      ? OrderBookSideEnum.BID
      : OrderBookSideEnum.ASK;

  const generalSideProps = {
    width,
    symbol,
    dualColumn,
    maxSumSize,
    showDepth,
    enabled1Click,
    walletType,
  };

  const lastTick = <OrderBookLastTick price={lastPrice} symbol={symbol} />;

  const body = (
    <>
      <OrderBookSide
        {...generalSideProps}
        books={getSideData(bids, asks, leftSide)}
        side={leftSide}
      />
      {!dualColumn && lastTick}
      <OrderBookSide
        {...generalSideProps}
        books={getSideData(bids, asks, rightSide)}
        side={rightSide}
      />
    </>
  );

  return (
    <div className={bookClass}>
      {dualColumn && lastTick}
      {dualColumn ? <div className="d-flex">{body}</div> : body}
    </div>
  );
};
