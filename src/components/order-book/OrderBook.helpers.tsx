import React from "react";
import {
  BookCellContainsBar,
  BookCellNumber,
  BookCellSize,
  QuickOrderBtn,
} from "./OrderBook.cell";
import { OrderBookModel } from "@/models/book.model";
import { getAmountDecimals, getPriceDecimals } from "@/exports/ticker.utils";
import { OrderSide } from "@/constants/order-enums";

enum OrderBookHeaderTypes {
  PRICE = "price",
  SIZE = "size",
  TOTAL = "total",
  BUY = "buy-btn",
  SELL = "sell-btn",
}

/**
 * [Single column]
 * Price - Side - Total
 * x--------x-------x    ASKS
 * x--------x-------x
 * |||||||||||||||||||
 * x--------x-------x    BIDS
 * x--------x-------x
 *
 * [Dual Column] => isReverse mode: dual column && side === isBid
 * BIDS                  ASKS
 * Total - Size -Price | Price - Side - Total
 * x--------x-------x  | x--------x-------x
 * x--------x-------x  | x--------x-------x
 * x--------x-------x  | x--------x-------x
 */
export function getHeaders({
  width,
  isBid,
  dualColumn,
  enabled1Click,
}): string[] {
  let headers = [
    OrderBookHeaderTypes.PRICE,
    OrderBookHeaderTypes.SIZE,
    OrderBookHeaderTypes.TOTAL,
  ];
  if (enabled1Click) {
    headers = dualColumn
      ? [...headers, OrderBookHeaderTypes.BUY, OrderBookHeaderTypes.SELL]
      : [OrderBookHeaderTypes.SELL, OrderBookHeaderTypes.BUY, ...headers];
  }

  // display number of columns by container's width
  // only dual-column mode can show/hide column by container's width
  // default = 2
  if (dualColumn) {
    const isReverse = dualColumn && isBid;
    const orginalDirections =
      width < 500
        ? headers.filter((header) => header !== OrderBookHeaderTypes.TOTAL)
        : headers;
    return isReverse ? orginalDirections.reverse() : orginalDirections;
  }

  return headers;
}

export function getCellClassByHeader(header: string) {
  switch (header) {
    case OrderBookHeaderTypes.PRICE: {
      return "price";
    }
    case OrderBookHeaderTypes.SIZE: {
      return "size";
    }
    case OrderBookHeaderTypes.TOTAL: {
      return "sumSize";
    }
    case OrderBookHeaderTypes.BUY:
    case OrderBookHeaderTypes.SELL: {
      return "btn";
    }
  }
}

export function getHeaderLabel(header: string): string {
  switch (header) {
    case OrderBookHeaderTypes.BUY:
    case OrderBookHeaderTypes.SELL: {
      return "";
    }
    default: {
      return header;
    }
  }
}

export function getHeaderColWidth(header: string): string {
  switch (header) {
    case OrderBookHeaderTypes.BUY:
    case OrderBookHeaderTypes.SELL: {
      return `20px`;
    }
    default: {
      return undefined;
    }
  }
}

export function getOrderBookCellByHeader(
  header: string,
  dualColumn: boolean,
  { walletType, price, size, total, symbol, maxSumSize }
) {
  const classes = getCellClassByHeader(header);
  const priceDecimals = getPriceDecimals(symbol);
  const amountDecimals = getAmountDecimals(symbol);

  switch (header) {
    case OrderBookHeaderTypes.PRICE: {
      if (dualColumn) {
        const depthPerc = !maxSumSize ? 0 : (total / maxSumSize) * 100;

        return (
          <BookCellContainsBar
            classes={classes}
            key={`td-price-${price}`}
            data={price}
            decimals={priceDecimals}
            depthPerc={depthPerc}
          />
        );
      } else {
        return (
          <BookCellNumber
            classes={classes}
            key={`td-price-${price}`}
            data={price}
            decimals={priceDecimals}
          />
        );
      }
    }
    case OrderBookHeaderTypes.SIZE: {
      return (
        <BookCellSize
          classes={classes}
          key={`td-size-${price}`}
          data={size}
          decimals={amountDecimals}
        />
      );
    }
    case OrderBookHeaderTypes.TOTAL: {
      if (!dualColumn) {
        const depthPerc = !maxSumSize ? 0 : (total / maxSumSize) * 100;

        return (
          <BookCellContainsBar
            classes={classes}
            key={`td-sumsize-${price}`}
            data={total}
            depthPerc={depthPerc}
            decimals={amountDecimals}
          />
        );
      } else {
        return (
          <BookCellNumber
            classes={classes}
            key={`td-sumsize-${price}`}
            data={total}
            decimals={amountDecimals}
          />
        );
      }
    }
    case OrderBookHeaderTypes.BUY:
    case OrderBookHeaderTypes.SELL: {
      const side =
        header === OrderBookHeaderTypes.BUY ? OrderSide.BUY : OrderSide.SELL;

      return (
        <QuickOrderBtn
          key={`td-btn-${side}-${price}`}
          classes="td-order-btn"
          side={side}
          price={price}
          qty={size}
          symbol={symbol}
          walletType={walletType}
        />
      );
    }
  }
}

type OrderBookGeneralData = {
  bids: OrderBookModel[];
  asks: OrderBookModel[];
};

const BORDER_SPACING = 2;
const BOOK_ROW_HEIGHT = 20 + BORDER_SPACING;
const BOOK_HEAD_HEIGHT = 20;
const BOOK_LAST_PRICE_HEIGHT = 24;

export function getDisplayOrderBookData({
  width,
  height,
  dualColumn,
  bids,
  asks,
}: OrderBookGeneralData & {
  width: number;
  height: number;
  dualColumn?: boolean;
}): OrderBookGeneralData {
  let b = bids,
    a = asks;

  const calculableHeight = height - BOOK_HEAD_HEIGHT - BOOK_LAST_PRICE_HEIGHT;
  const numberOfRows = calculableHeight / BOOK_ROW_HEIGHT || 1;

  if (height) {
    if (!dualColumn) {
      const numberOfRowsPerSide = Math.floor(numberOfRows / 2) || 1;
      b = bids.slice(0, numberOfRowsPerSide);
      a = asks.slice(0, numberOfRowsPerSide).reverse();
    } else {
      a = asks.slice(0, numberOfRows);
      b = bids.slice(0, numberOfRows);
    }
  }

  return { bids: b, asks: a };
}
