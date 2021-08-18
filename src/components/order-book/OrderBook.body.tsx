import { WalletType } from "@/constants/balance-enums";
import { OrderBookSideEnum } from "@/constants/order-book-enums";
import { OrderBookModel } from "@/models/book.model";
import React from "react";
import { OrderBookRow } from "./OrderBook.row";

interface BookSideBodyProps {
  maxSumSize: number;
  books: OrderBookModel[];
  headers: string[];
  dualColumn: boolean;
  symbol: string;
  walletType: WalletType;
  side: OrderBookSideEnum;
}

export const BookSideBody = ({
  side,
  walletType,
  symbol,
  maxSumSize,
  books,
  headers,
  dualColumn,
}: BookSideBodyProps) => {
  return (
    <tbody>
      {books.map((bookData: OrderBookModel) => (
        <OrderBookRow
          walletType={walletType}
          symbol={symbol}
          dualColumn={dualColumn}
          headers={headers}
          key={`order-book-${bookData.price}`}
          price={bookData.price}
          size={bookData.size}
          total={bookData.sumSize}
          maxSumSize={maxSumSize}
          side={side}
        />
      ))}
    </tbody>
  );
};
