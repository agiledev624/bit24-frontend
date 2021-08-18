import React from "react";
import { connect } from "react-redux";

import { OrderFormContainerProps, OrderFormProps } from "./OrderForm.types";
import { isTradeLoaded } from "@/selectors/trade.selectors";
import { WalletType } from "@/constants/balance-enums";
import { OrderFormCalculator, CalculatorBody } from "./OrderForm.Calculator";
import _maxBy from "lodash/maxBy";
import _minBy from "lodash/minBy";
import { getBalances } from "@/selectors/balance.selectors";
import { getAsksSelector, getBidsSelector } from "@/selectors/book.selectors";
import { getLastPriceBySymbol } from "@/selectors/ticker.selectors";
import { isUserLoggedIn } from "@/selectors/auth.selectors";
import { Card, Collapsible, Icon } from "@/ui-components";
import { OrderForm } from "./OrderForm";
import OrderFormInputControlsContainer from "./OrderForm.input-controls.container";
import { OrderType } from "@/constants/order-enums";
import {
  orderValidationFn as derivativeOrderValidationFn,
  submitOrderFn as derivativeSubmitOrderFn,
} from "./OrderForm.derivative.submit-order-helper";
import {
  spotOrderValidationFn,
  spotSubmitOrderFn,
} from "./OrderForm.spot.submit-order-helper";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { toggleBooleanSetting } from "@/actions/ui-setting.actions";
import { getLabelOrderType } from "@/exports/order.utils";
import { Link } from "react-router-dom";
import { RoutePaths } from "@/constants/route-paths";

class OrderFormContainer extends React.PureComponent<
  OrderFormContainerProps,
  Partial<OrderFormContainerProps>
> {
  constructor(props) {
    super(props);

    // this.onLimitBuyClicked = this.onLimitBuyClicked.bind(this);
    this.setParentState = this.setParentState.bind(this);
    this.onSubmitOrder = this.onSubmitOrder.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.closeCalculator = this.closeCalculator.bind(this);
    this.state = { ...props };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let s = {};

    for (let k in prevState) {
      if (nextProps.hasOwnProperty(k) && s[k] !== nextProps[k]) {
        s[k] = nextProps[k];
      }
    }

    if (Object.keys(s).length) {
      return {
        ...prevState,
        ...s,
      };
    }

    return null;
  }

  setParentState(states) {
    this.setState(states);
  }

  onSubmitOrder(
    { clientOrderId, tradeOptions, price, amount, type, tif, stopPrice, side },
    onError,
    state,
    extraData
  ) {
    let { tickerPrice } = this.state;

    const { price: lowestSellPrice = tickerPrice } = _minBy(
      this.props.asks,
      (o) => o.price
    );
    const { price: highestBuyPrice = tickerPrice } = _maxBy(
      this.props.bids,
      (o) => o.price
    );

    const {
      orderValidationFn,
      dispatch,
      submitOrderFn,
      executedLongCash,
      executedLongPosition,
      leverage,
    } = this.props;

    const validParams = {
      clientOrderId,
      tif,
      tradeOptions,
      lowestSellPrice,
      highestBuyPrice,
      side,
      stopPrice: +stopPrice,
      price: +price,
      amount: +amount,
      type,
      onError,
      executedLongCash,
      executedLongPosition,
      leverage,
    };

    if (orderValidationFn(validParams, this.props)) {
      submitOrderFn(
        {
          clientOrderId,
          tradeOptions,
          type,
          side,
          tif,
          stopPrice: +stopPrice,
          price: +price,
          amount: +amount,
          dispatch,
        },
        this.props,
        state,
        extraData
      );
    }
  }

  private renderForm(data: OrderFormProps) {
    const {tradeType} = this.props;
    return <OrderForm {...data} tradeType={tradeType} />;
  }

  closeCalculator() {
    const { dispatch } = this.props;

    dispatch(
      toggleBooleanSetting({
        key: "open_calculator_overlay",
        persist: false,
      })
    );
  }

  render() {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return (
        <div className="orderform__login">
          <div className="orderform__login__logo">
            <Link to="/">
              <span>bit</span>
              <span>24</span>
            </Link>
          </div>
          <div className="orderform__login__socials">
            <Link to="/">
              <Icon id="discord" cssmodule="fab" />
            </Link>
            <Link to="/">
              <Icon id="telegram-plane" cssmodule="fab" />
            </Link>
            <Link to="/">
              <Icon id="twitter" cssmodule="fab" />
            </Link>
          </div>
          <Link to={RoutePaths.LOGIN} className="orderform__login__btn">
            Log in
          </Link>
          <Link to={RoutePaths.REGISTER} className="orderform__register__btn">
            Register Now
          </Link>
        </div>
      );
    }

    const {
      maxLeverage,
      isAuthenticated,
      showCalculator,
      pair,
      tickerPrice,
      balances,
      wallet,
      orderTypes,
      selectedType,
      immediateSubmit,
      tradingFee,
      mmr,
      hidden,
    } = this.state;

    const orderFormProps = {
      maxLeverage,
      wallet,
      pair,
      initialPrice: tickerPrice,
      balances,
      onClickHandler: this.onSubmitOrder,
      isTradeLoaded: this.props.isTradeLoaded,
      isAuthenticated,
      orderTypes,
      selectedType,
      immediateSubmit,
      tradingFee,
      mmr,
      hidden,
    };

    return (
      <Collapsible
        title="New Order"
        toolbar={this._isDerivative() && <OrderFormCalculator />}
        overlay={showCalculator && this._isDerivative() && <CalculatorBody />}
        closeOverlay={this.closeCalculator}
      >
        <OrderFormInputControlsContainer {...orderFormProps}>
          {this.renderForm}
        </OrderFormInputControlsContainer>
      </Collapsible>
    );
  }

  private _isDerivative(): boolean {
    const { wallet } = this.state;

    return wallet === WalletType.DERIVATIVE;
  }
}

function _generateOrderTypeDropdownItem(type: OrderType) {
  return {
    title: getLabelOrderType(type),
    to: `${type}`,
  };
}

function _generateOrderTypeSubItem(type: OrderType) {
  return {
    label: getLabelOrderType(type),
    value: `${type}`,
  };
}
const orderTypes = [
  ...[OrderType.LIMIT, OrderType.MARKET].map(_generateOrderTypeDropdownItem),
  {
    title: "Other",
    to: "other",
    dropdownOptions: [
      OrderType.STOP_LMT,
      OrderType.STOP_MKT,
      OrderType.TSL,
      OrderType.TSM,
      OrderType.PEG,
      OrderType.OCO,
      OrderType.ICE,
      OrderType.BRACKET,
      OrderType.PEG_HIDDEN,
      OrderType.OCO_ICE,
      OrderType.SNIPER_MKT,
      OrderType.SNIPER_LIMIT,
    ].map(_generateOrderTypeSubItem),
  },
];

const mapStateToProps = (state, props) => {
  const { wallet } = props;
  const orderValidFunc =
    wallet === WalletType.DERIVATIVE
      ? derivativeOrderValidationFn
      : spotOrderValidationFn;
  const submitOrderFunc =
    wallet === WalletType.DERIVATIVE
      ? derivativeSubmitOrderFn
      : spotSubmitOrderFn;

  return {
    balances: getBalances(state),
    bids: getBidsSelector(state),
    asks: getAsksSelector(state),
    maxLeverage: 150,
    isLoggedIn: isUserLoggedIn(state),
    // position: getPositionBySymbol(state, props.pair),
    tickerPrice: getLastPriceBySymbol(state)(props.pair),
    isAuthenticated: isUserLoggedIn(state),
    isTradeLoaded: isTradeLoaded(state),
    tradingFee: 0,
    orderTypes,
    executedLongCash: state.user.executedLongCash,
    executedLongPosition: state.user.executedLongPosition,
    leverage: state.user.leverage,
    mmr: state.user.mmr,
    orderValidationFn: orderValidFunc,
    submitOrderFn: submitOrderFunc,
    showCalculator:
      wallet === WalletType.DERIVATIVE &&
      getSetting(state)("open_calculator_overlay"),
    immediateSubmit:
      wallet === WalletType.DERIVATIVE &&
      !getSetting(state)("enabled_order_confirm_popup"),
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const ConnectedContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderFormContainer);

export default ConnectedContainer;
