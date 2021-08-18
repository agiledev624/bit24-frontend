import React from "react";
import { AnimateOnUpdate, Button, NumberFormat } from "@/ui-components";
import classNames from "classnames";
import { usePrevious } from "@/hooks";
import { WalletType } from "@/constants/balance-enums";
import { OrderSide, OrderType, TIF } from "@/constants/order-enums";
import { connect } from "react-redux";
import { submitNewOrder } from "@/actions/order.actions";
import { OrderBookSubject } from "./OrderBook.subject";

interface Props {
  data: number;
  classes: string;
  decimals: number;
}

interface CellContainsBarProps extends Props {
  depthPerc: number;
}

export const BookCellContainsBar = ({
  data,
  classes,
  decimals = 0,
  depthPerc,
}: CellContainsBarProps) => (
  <td className={classes}>
    <div>
      <div className="depthBar" style={{ width: `${depthPerc}%` }}></div>
      <span className="output">
        <NumberFormat decimals={decimals} number={data} />
      </span>
    </div>
  </td>
);

export const BookCellNumber = ({ data, classes, decimals = 0 }: Props) => (
  <td className={classes}>
    <div>
      <NumberFormat decimals={decimals} number={data} />
    </div>
  </td>
);

export const BookCellSize = ({ data, classes, decimals = 0 }: Props) => {
  const lastValue = usePrevious(data) || 0;

  const animateClasses = classNames({
    isNew: lastValue && lastValue !== data,
    highlightDec: lastValue && data - lastValue < 0,
    highlightInc: lastValue && data - lastValue > 0,
  });

  return (
    <AnimateOnUpdate
      customTag="td"
      baseClassName={classes}
      animationClassName={animateClasses}
      animate={lastValue && lastValue !== data}
    >
      <NumberFormat decimals={decimals} number={data} />
    </AnimateOnUpdate>
  );
};

interface QuickOrderBtnProps {
  price: number;
  qty: number;
  symbol: string;
  walletType: WalletType;
  side: OrderSide;
  classes: string;
}
export class QuickOrderBtn extends React.PureComponent<QuickOrderBtnProps> {
  constructor(props) {
    super(props);

    this.onBtnClick = this.onBtnClick.bind(this);
  }

  onBtnClick(e) {
    e.stopPropagation();

    const { price, qty, side } = this.props;
    OrderBookSubject.next({
      price,
      side,
      amount: qty,
      isQuick: true,
    });
  }

  render() {
    const { side, classes } = this.props;
    const lbl = side === OrderSide.BUY ? "Buy" : "Sell";
    const cls = classNames("ui-button", lbl.toLowerCase());

    return (
      <td className={classes}>
        <button onDoubleClick={this.onBtnClick} className={cls}>
          {lbl}
        </button>
      </td>
    );
  }
}
