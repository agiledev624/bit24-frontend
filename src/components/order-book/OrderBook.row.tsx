import { shallowCompareArrays, shallowCompareObjects } from "@/exports";
import React from "react";
import { getOrderBookCellByHeader } from "./OrderBook.helpers";
import _omit from "lodash/omit";
import { WalletType } from "@/constants/balance-enums";
import { OrderBookSubject } from "./OrderBook.subject";
import { OrderBookSideEnum } from "@/constants/order-book-enums";

interface OrderBookRowProps {
  headers: string[];
  price: number;
  size: number;
  total: number;
  maxSumSize: number;
  dualColumn: boolean;
  symbol: string;
  walletType: WalletType;
  side: OrderBookSideEnum;
}

export class OrderBookRow extends React.Component<OrderBookRowProps> {
  constructor(props) {
    super(props);

    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick() {
    const { price, side } = this.props;
    OrderBookSubject.next({ price, side, isQuick: false });
  }

  shouldComponentUpdate(nextProps) {
    const omittedPrev = _omit(this.props, ["headers"]);
    const omittedProps = _omit(nextProps, ["headers"]);
    return !(
      shallowCompareArrays(this.props.headers, nextProps.headers) &&
      shallowCompareObjects(omittedPrev, omittedProps)
    );
  }

  render() {
    const {
      walletType,
      headers,
      price,
      size,
      total,
      symbol,
      maxSumSize,
      dualColumn,
    } = this.props;

    return (
      <tr className="clickable" onClick={this.onRowClick}>
        {headers.map((header: string) =>
          getOrderBookCellByHeader(header, dualColumn, {
            walletType,
            symbol,
            price,
            size,
            total,
            maxSumSize,
          })
        )}
      </tr>
    );
  }
}
