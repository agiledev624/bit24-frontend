import React from "react";
import _isFunction from "lodash/isFunction";
import {
  OrderFormControlsProps,
  OrderFormControlsState,
} from "./OrderForm.types";
import {
  ICELayers,
  LastTradePriceType,
  OrderSide,
  OrderType,
  StopTrigger,
  TIF,
  TradeOption,
} from "@/constants/order-enums";
import {
  calculatedTotal,
  getPickedPrice,
  isBuy,
  isMarketOrder,
} from "./OrderForm.helpers";
import { divide, multiply } from "@/exports/math";
import { getAmountDecimals, getMinPrice } from "@/exports/ticker.utils";
import { sliceTo } from "@/exports/format-number";
import { getOrderBookObservable } from "../order-book/OrderBook.subject";
import { Subscription } from "rxjs";
class OrderFormInputControlsContainer extends React.PureComponent<
  Partial<OrderFormControlsProps>,
  OrderFormControlsState
> {
  static defaultProps = {
    selectedType: OrderType.LIMIT,
    orderTypes: [],
  };

  _clientOrderId = null;
  tickerPrice: number = 0;
  subscription: Subscription = null;

  constructor(props) {
    super(props);

    this.state = {
      price: this.props.initialPrice || 0,
      stopPrice: 0,
      amount: 0,
      typeId: OrderType.LIMIT,
      total: 0,
      fund: 0,
      takeProfitTradePriceType: LastTradePriceType.MARK_PRICE,
      stopLossTradePriceType: LastTradePriceType.MARK_PRICE,
      stopLoss: 0,
      takeProfit: 0,
      tif: TIF.GTC,
      tradeOptions: [],
      leverage: 5,
      displaySize: undefined,
      refreshSize: undefined,
      enabledStopTrigger: false,
      selectedCloseTrigger: StopTrigger.LAST_PRICE,
      trailValue: 0,
      offset: 0,
      priceIncrement: 0,
      selectedLayer: 0,
      qtyIncrement: 0,
    };

    this.tickerPrice = this.props.initialPrice;

    this._onOrderBookTransferData = this._onOrderBookTransferData.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onStopPriceChange = this.onStopPriceChange.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onOrderBtnClick = this.onOrderBtnClick.bind(this);
    this.onTotalChange = this.onTotalChange.bind(this);
    this.onBalanceClick = this.onBalanceClick.bind(this);
    this.onOrderTypeChange = this.onOrderTypeChange.bind(this);
    this.onPercQuantityBtnClick = this.onPercQuantityBtnClick.bind(this);
    this.onTIFChange = this.onTIFChange.bind(this);
    this.onTradeOptionChange = this.onTradeOptionChange.bind(this);
    this.onLeverageChange = this.onLeverageChange.bind(this);
    this.onTakeProfitChange = this.onTakeProfitChange.bind(this);
    this.onStopLossChange = this.onStopLossChange.bind(this);
    this.onTakeProfitLastTradePriceTypeChange =
      this.onTakeProfitLastTradePriceTypeChange.bind(this);
    this.onStopLossLastTradePriceTypeChange =
      this.onStopLossLastTradePriceTypeChange.bind(this);
    this.onDisplaySizeChange = this.onDisplaySizeChange.bind(this);
    this.onRefreshSizeChange = this.onRefreshSizeChange.bind(this);
    this.onToggleStopTrigger = this.onToggleStopTrigger.bind(this);
    this.onCloseTriggerOptionChange =
      this.onCloseTriggerOptionChange.bind(this);
    this.onTrailValueChange = this.onTrailValueChange.bind(this);
    this.onOffsetChange = this.onOffsetChange.bind(this);
    this.onPriceIncrementChange = this.onPriceIncrementChange.bind(this);
    this.onLayerChange = this.onLayerChange.bind(this);
    this.onQtyIncrementChange = this.onQtyIncrementChange.bind(this);
  }

  onLayerChange(layer: ICELayers) {
    this.setState({
      selectedLayer: layer,
    });
  }

  onQtyIncrementChange(value: number) {
    this.setState({
      qtyIncrement: value,
    });
  }

  onOffsetChange(value: number) {
    this.setState({
      offset: value,
    });
  }

  onPriceIncrementChange(value: number) {
    this.setState({
      priceIncrement: value,
    });
  }

  onTrailValueChange(value: number) {
    this.setState({
      trailValue: value,
    });
  }

  onToggleStopTrigger(v, e) {
    const isChecked = e.target.checked;
    this.setState({
      enabledStopTrigger: isChecked,
    });
  }

  onCloseTriggerOptionChange(newOption: string) {
    this.setState({
      selectedCloseTrigger: +newOption,
    });
  }

  onDisplaySizeChange(value: number) {
    this.setState({
      displaySize: value,
    });
  }

  onRefreshSizeChange(value: number) {
    this.setState({
      refreshSize: value,
    });
  }

  onTakeProfitChange(value: number) {
    this.setState({
      takeProfit: value,
    });
  }

  onStopLossChange(value: number) {
    console.log("onStopLossChange", value);

    this.setState({
      stopLoss: value,
    });
  }

  onTakeProfitLastTradePriceTypeChange(ltp: LastTradePriceType) {
    this.setState({
      takeProfitTradePriceType: ltp,
    });
  }

  onStopLossLastTradePriceTypeChange(ltp: LastTradePriceType) {
    this.setState({
      stopLossTradePriceType: ltp,
    });
  }

  onLeverageChange(value: number) {
    this.setState({
      leverage: value,
    });
  }

  onTradeOptionChange(values: TradeOption[]) {
    this.setState({
      tradeOptions: values,
    });
  }

  onTIFChange(tif: TIF) {
    if (this.state.tif === tif) {
      return;
    }

    this.setState({ tif });
  }

  onPriceChange(price: number) {
    const { typeId } = this.state;

    this.setState({ price }, () => {
      if (isMarketOrder(typeId)) return;

      // const total = Number(this.state.amount) * Number(this.state.price)
      const total = +multiply(this.state.amount, this.state.price);

      this.setState({
        total,
      });
    });
  }

  onStopPriceChange(price: number) {
    this.setState({
      stopPrice: price,
    });
  }

  onAmountChange(amount: number) {
    const { typeId } = this.state;

    this.setState({ amount }, () => {
      if (isMarketOrder(typeId)) return;

      const total = +multiply(+this.state.amount, this.state.price);

      this.setState({
        total,
      });
    });
  }

  // used by OrderSubmitBtn
  onOrderBtnClick(clientId: number, data, cb) {
    const { side } = data;
    const { price, amount, typeId, stopPrice, tif, tradeOptions } = this.state;

    stopPrice && this.setState({ stopPrice: 0 });
    this.props.onClickHandler(
      {
        clientOrderId: clientId,
        tradeOptions,
        tif,
        side,
        price,
        amount,
        type: typeId,
        stopPrice,
      },
      cb,
      this.state,
      data
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.pair !== prevState.pair ||
      prevState.isTradeLoaded !== nextProps.isTradeLoaded
    ) {
      const { pair } = nextProps;

      return {
        ...prevState,
        price: nextProps.initialPrice | 0,
        isTradeLoaded: nextProps.isTradeLoaded,
        pair,
        stopPrice: 0,
        amount: 0,
        typeId: nextProps.selectedType || OrderType.LIMIT,
        total: 0,
        tif: TIF.GTC,
        refreshSize: undefined,
        displaySize: undefined,
        takeProfit: 0,
        stopLoss: 0,
        takeProfitTradePriceType: LastTradePriceType.MARK_PRICE,
        stopLossTradePriceType: LastTradePriceType.MARK_PRICE,
        tradeOptions: [],
        enabledStopTrigger: false,
        selectedCloseTrigger: StopTrigger.LAST_PRICE,
        trailValue: 0,
        offset: 0,
        priceIncrement: 0,
        qtyIncrement: 0,
        selectedLayer: 0,
      };
    }

    return null;
  }

  onTotalChange(total: number) {
    this._updateAmountByTotal(total);
  }

  onBalanceClick(balance: number, side: OrderSide) {
    // let { isAuthenticated } = this.props;
    // if (!isAuthenticated || !balance)
    //   return;

    if (!balance) return;

    this._updateFieldsByTotal(balance, side);
  }

  onPercQuantityBtnClick(
    balance: number,
    percentage: number = 1,
    side: OrderSide
  ) {
    let { isAuthenticated } = this.props;
    console.log("side", side);

    // if (!isAuthenticated || !balance)
    //   return;
    if (!balance) return;

    if (percentage !== 1) balance = +multiply(balance, percentage);

    this._updateFieldsByTotal(balance, side);
  }

  _updateFieldsByTotal(balance: number, side: OrderSide) {
    if (!side) {
      console.log("derivative");
    }

    let { pair } = this.props;

    if (isBuy(side)) {
      this._updateAmountByTotal(+balance);
    } else {
      const decimalPlaceAmount = getAmountDecimals(pair);

      this.setState(
        {
          amount: +sliceTo(+balance, decimalPlaceAmount),
        },
        () => {
          let { price, typeId, stopPrice, amount } = this.state;

          const total = calculatedTotal({
            typeId,
            price,
            stopPrice,
            tickerPrice: this.tickerPrice,
            amount,
          });

          this.setState({
            total,
          });
        }
      );
    }
  }

  _updateAmountByTotal(total) {
    const { pair } = this.props;

    const decimalPlaceAmount = getAmountDecimals(pair);

    this.setState(
      {
        total: total,
      },
      () => {
        const { price, total, stopPrice, typeId } = this.state;

        const tickerPrice = getPickedPrice({
          typeId,
          tickerPrice: this.tickerPrice,
          price,
          stopPrice,
        });

        // console.warn('this.tickerPrice', this.tickerPrice,'tickerPrice', tickerPrice);

        if (Number(tickerPrice)) {
          let amount = +divide(Number(total), tickerPrice);
          amount = +sliceTo(Number(amount), decimalPlaceAmount);

          this.setState({
            amount,
          });
        }
      }
    );
  }

  onOrderTypeChange(value: string) {
    this.setState({
      typeId: +value,
      stopPrice: 0,
      amount: 0,
      total: 0,
      refreshSize: undefined,
      displaySize: undefined,
      takeProfit: 0,
      stopLoss: 0,
      takeProfitTradePriceType: LastTradePriceType.MARK_PRICE,
      stopLossTradePriceType: LastTradePriceType.MARK_PRICE,
      tradeOptions: [],
      enabledStopTrigger: false,
      selectedCloseTrigger: StopTrigger.LAST_PRICE,
      trailValue: 0,
      offset: 0,
      priceIncrement: 0,
      selectedLayer: undefined,
      qtyIncrement: 0,
    });
  }

  componentDidMount() {
    if (!this.subscription) {
      this.subscription = getOrderBookObservable().subscribe(
        this._onOrderBookTransferData
      );
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  componentDidUpdate(_, prevState) {
    if (
      prevState.pair !== this.state.pair ||
      prevState.isTradeLoaded !== this.state.isTradeLoaded
    ) {
      this._onUpdateTickerPrice({ price: this.state.price });
    }
  }

  _onUpdateTickerPrice({ price }) {
    this.tickerPrice = Number(price);
  }

  _onOrderBookTransferData({ side, price, amount, isQuick }: any) {
    // const { wallet } = this.props;
    // price = Number(sliceTo(price, getPriceDecimals(this.props.pair)));
    // amount = Number(sliceTo(amount, getAmountDecimals(this.props.pair)));

    // // click to BUY -> fill SELL
    // if (wallet !== WalletType.DERIVATIVE && side !== this.props.side) {
    //   this.setState(function (state) {
    //     const total = +multiply(price, amount);
    //     return {
    //       price,
    //       amount,
    //       total
    //     }
    //   });
    // } else {
    //   this.setState(function (state) {
    //     return { price }
    //   });
    // }
    this.setState(
      {
        price,
      },
      () => {
        if (isQuick) {
          this.onOrderBtnClick(Date.now(), { side }, () => {});
        }
      }
    );
  }

  render() {
    const {
      mmr,
      balances,
      pair,
      isAuthenticated,
      orderTypes,
      wallet,
      immediateSubmit,
      maxLeverage,
      hidden,
    } = this.props;

    const props = {
      ...this.state,
      hidden,
      mmr,
      maxLeverage,
      pair,
      balances,
      wallet,
      orderTypes,
      isAuthenticated,
      immediateSubmit,
      onPriceChange: this.onPriceChange,
      onStopPriceChange: this.onStopPriceChange,
      onAmountChange: this.onAmountChange,
      onOrderBtnClick: this.onOrderBtnClick,
      onTotalChange: this.onTotalChange,
      onUpdateAmountByBalancePercent: this.onPercQuantityBtnClick,
      onOrderTypeChange: this.onOrderTypeChange,
      onTIFChange: this.onTIFChange,
      onTradeOptionChange: this.onTradeOptionChange,
      onLeverageChange: this.onLeverageChange,
      onTakeProfitChange: this.onTakeProfitChange,
      onStopLossChange: this.onStopLossChange,
      onTakeProfitLastTradePriceTypeChange:
        this.onTakeProfitLastTradePriceTypeChange,
      onStopLossLastTradePriceTypeChange:
        this.onStopLossLastTradePriceTypeChange,
      onDisplaySizeChange: this.onDisplaySizeChange,
      onRefreshSizeChange: this.onRefreshSizeChange,
      onToggleStopTrigger: this.onToggleStopTrigger,
      onCloseTriggerOptionChange: this.onCloseTriggerOptionChange,
      onTrailValueChange: this.onTrailValueChange,
      onOffsetChange: this.onOffsetChange,
      onPriceIncrementChange: this.onPriceIncrementChange,
      onLayerChange: this.onLayerChange,
      onQtyIncrementChange: this.onQtyIncrementChange,
    };
    return _isFunction(this.props.children) ? this.props.children(props) : null;
  }
}

export default OrderFormInputControlsContainer;
