import ResizeSensor from "@/ui-components/ResizeSensor";
import React from "react";
import { connect } from "react-redux";
import { OrderBook } from "./OrderBook";
import { OrderBookModel } from "@/models/book.model";
import { getDisplayOrderBookData } from "./OrderBook.helpers";
import { initBook } from "@/actions/book.action";
import {
  getAsksSelector,
  getBidsSelector,
  getBookMaxSumsize,
} from "@/selectors/book.selectors";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { getLastPriceBySymbol } from "@/selectors/ticker.selectors";
import { AppTradeType } from "@/constants/trade-type";

interface OrderBookContainerProps {
  symbol: string;
  lastPrice: number;
  bids: OrderBookModel[];
  asks: OrderBookModel[];
  dualColumn: boolean;
  enabled1Click: boolean;
  showDepth: boolean;
  maxSumSize: number;
  loadBook: ({ symbol, limit }: { symbol: string; limit?: number }) => void;
  windowOpen?: boolean;
  tradeType: AppTradeType;
}

interface OrderBookContainerState {
  width: number;
  height: number;
}

class OrderBookContainer extends React.PureComponent<
  Partial<OrderBookContainerProps>,
  OrderBookContainerState
> {
  state = {
    width: 0,
    height: 0,
  };

  onResize = (dimension) => {
    const { width, height } = dimension;

    this.setState({
      width,
      height,
    });
  };

  componentDidUpdate(prevProps: Partial<OrderBookContainerProps>) {
    if (this.props.symbol !== prevProps.symbol) {
      const { symbol, loadBook } = this.props;
      loadBook({ symbol });
    }
  }

  componentDidMount() {
    const { symbol, loadBook } = this.props;
    loadBook({ symbol });
  }

  render() {
    const {
      symbol,
      lastPrice,
      dualColumn,
      showDepth,
      maxSumSize,
      bids: b,
      asks: a,
      windowOpen,
      enabled1Click,
      tradeType,
    } = this.props;

    const { width, height } = this.state;
    const { bids, asks } = getDisplayOrderBookData({
      bids: b,
      asks: a,
      width,
      dualColumn,
      height,
    });

    const bookProps = {
      symbol,
      lastPrice,
      dualColumn,
      showDepth,
      bids,
      asks,
      maxSumSize,
      width,
      windowOpen,
      enabled1Click,
      tradeType,
    };

    return (
      <ResizeSensor onResize={this.onResize}>
        <OrderBook {...bookProps} />
      </ResizeSensor>
    );
  }
}

const mapStateToProps = (state, props: Partial<OrderBookContainerProps>) => {
  return {
    lastPrice: getLastPriceBySymbol(state)(props.symbol),
    bids: getBidsSelector(state),
    asks: getAsksSelector(state),
    maxSumSize: getBookMaxSumsize(state),
    dualColumn: getSetting(state)("orderbook_dual_column"),
    showDepth: getSetting(state)("orderbook_show_depth"),
    enabled1Click: getSetting(state)("orderbook_1_click"),
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadBook: function ({ symbol, limit }: { symbol: string; limit?: number }) {
    dispatch(initBook({ symbol, limit }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer);
