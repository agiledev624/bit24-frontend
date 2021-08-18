import { OrderBookModel } from "@/models/book.model";
import React, { useMemo } from "react";
import classNames from "classnames";
import { OrderBookSideEnum } from "@/constants/order-book-enums";
import { getHeaderColWidth, getHeaders } from "./OrderBook.helpers";
import { BookSideHeader } from "./OrderBook.header";
import { BookSideBody } from "./OrderBook.body";
import { WalletType } from "@/constants/balance-enums";

interface BookSideProps {
  dualColumn: boolean;
  maxSumSize: number;
  books: OrderBookModel[];
  side?: OrderBookSideEnum;
  width?: number;
  height?: number;
  symbol: string;
  showDepth: boolean;
  enabled1Click: boolean;
  walletType: WalletType;
}

const TableColGroup = ({ headers }) => (
  <colgroup>
    {headers.map((header) => {
      const w = getHeaderColWidth(header);
      if (w) {
        return <col key={header} style={{ width: w }} />;
      } else {
        return <col key={header} />;
      }
    })}
  </colgroup>
);
export const OrderBookSide = ({
  symbol,
  dualColumn,
  books,
  side,
  width,
  maxSumSize,
  showDepth,
  enabled1Click,
  walletType,
}: BookSideProps) => {
  const isBid = side === OrderBookSideEnum.BID;
  const headers = useMemo(
    () => getHeaders({ width, dualColumn, isBid, enabled1Click }),
    [width, dualColumn, isBid, enabled1Click]
  );

  const tableClasses = classNames(
    "table-container",
    "table",
    "orderBookTable",
    "no-hacks",
    "table-stripped",
    {
      asks: !isBid,
      bids: isBid,
    }
  );

  return (
    <div className={tableClasses}>
      <div className="table-container-inner">
        <table cellSpacing="0" className="animsOn">
          <TableColGroup headers={headers} />
          <BookSideHeader headers={headers} />
          <BookSideBody
            walletType={walletType}
            symbol={symbol}
            maxSumSize={maxSumSize}
            dualColumn={dualColumn}
            books={books}
            headers={headers}
            side={side}
          />
        </table>
      </div>
    </div>
  );
};
