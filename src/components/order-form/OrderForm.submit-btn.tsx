import React from "react";
import _now from "lodash/now";
import classNames from "classnames";

import { OrderSide } from "@/constants/order-enums";
import { Button } from "@/ui-components";

const BTN_TIMEOUT_IN_MS = 30 * 1000;

interface OrderSubmitButtonProps {
  className: string;
  disabled: boolean;
  side: OrderSide;
  disableLoading: boolean;
  onBtnClickFallback: (
    clientOrderId: number,
    side: OrderSide,
    onFallback: () => void
  ) => void;
  label: string;
}

interface OrderSubmitButtonState {
  btnLoading: boolean;
}

class OrderSubmitButton extends React.PureComponent<
  Partial<OrderSubmitButtonProps>,
  OrderSubmitButtonState
> {
  static defaultProps = {
    onBtnClickFallback: function (clientId, side, cb) {},
    disableLoading: true,
  };

  _btnLoadingTimeoutId = null;
  _clientOrderId = null;

  constructor(props) {
    super(props);

    this.state = {
      btnLoading: false,
    };

    this.onBtnClick = this.onBtnClick.bind(this);
  }

  onBtnClick(e) {
    this._clientOrderId = _now();

    const { disableLoading, side, onBtnClickFallback } = this.props;
    if (disableLoading) {
      onBtnClickFallback(this._clientOrderId, side, () => {});
    } else {
      this._setLoadingBtn(() => {
        onBtnClickFallback(this._clientOrderId, side, () => {
          this.setState({
            btnLoading: false,
          });

          this._clearBtnTimeout();
          this._clientOrderId = null;
        });
      });
    }
  }

  // componentDidMount() {
  //   EventRegister.on(ON_ORDER_SUCCESS, this._onOrderSuccess, this);
  //   EventRegister.on(ON_ORDER_ERROR, this._onOrderError, this);
  // }

  // componentWillUnmount() {
  //   EventRegister.off(ON_ORDER_SUCCESS, this._onOrderSuccess, this);
  //   EventRegister.off(ON_ORDER_ERROR, this._onOrderError, this);

  //   this._clearBtnTimeout();
  //   this._clientOrderId = null;
  // }

  _onOrderSuccess({ clientOrderId, orderSide }) {
    const { disableLoading } = this.props;

    if (disableLoading) {
      return;
    }
    const { side } = this.props;

    if (side !== orderSide || clientOrderId !== this._clientOrderId) return;

    this._clearState();
  }

  _onOrderError() {
    const { disableLoading } = this.props;

    if (disableLoading) {
      return;
    }
    this._clearState();
  }

  _clearState() {
    this.setState({
      btnLoading: false,
    });

    this._clearBtnTimeout();
    this._clientOrderId = null;
  }

  _clearBtnTimeout() {
    if (this._btnLoadingTimeoutId) {
      clearTimeout(this._btnLoadingTimeoutId);
      this._btnLoadingTimeoutId = null;
    }
  }

  _setLoadingBtn(cb) {
    this.setState(
      {
        btnLoading: true,
      },
      () => {
        // init timer
        console.log("init timer");
        this._btnLoadingTimeoutId = setTimeout(() => {
          this.setState({
            btnLoading: false,
          });
          this._clientOrderId = null;

          // toast.error('Request timed out!');
        }, BTN_TIMEOUT_IN_MS);

        cb();
      }
    );
  }

  render() {
    const { btnLoading } = this.state;
    const { disabled, label, className } = this.props;

    const btnClasses = classNames(
      "order-form__button-container-btn",
      className,
      {
        "order-form__button-container-btn--disabled": disabled,
      }
    );

    return (
      <div className="order-form__button-container">
        <Button
          loading={btnLoading}
          classes={btnClasses}
          disabled={disabled}
          onClick={this.onBtnClick}
        >
          {label}
        </Button>
      </div>
    );
  }
}

export default OrderSubmitButton;
