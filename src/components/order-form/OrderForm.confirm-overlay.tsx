import { updateUISetting } from "@/actions/ui-setting.actions";
import { WalletType } from "@/constants/balance-enums";
import { MarginType, OrderSide, OrderType, TIF } from "@/constants/order-enums";
import { formatNumber, greenText, redText } from "@/exports";
import {
  calculateLP,
  getLabelOrderSide,
  getLabelOrderType,
  getLabelTIF,
} from "@/exports/order.utils";
import {
  getAmountDecimals,
  getPriceDecimals,
  getSymbols,
} from "@/exports/ticker.utils";
import { Button, InputCheckboxInline, NumberFormat } from "@/ui-components";
import React from "react";
import { connect } from "react-redux";
import { isBuy, isMarketOrder } from "./OrderForm.helpers";
import OrderSubmitButton from "./OrderForm.submit-btn";

interface OrderFormConfirmOverlayProps {
  side: OrderSide;
  price: number;
  orderType: OrderType;
  amount: number;
  total: number;
  marginType: string;
  leverage: number;
  mmr: number;
  tif: TIF;
  wallet: WalletType;
  symbol: string;
  closeOverlay: () => void;
  sendOrder: (clientOrderId: number, side: OrderSide, cb) => void;
  label: string;
  sendDisableConfirm: () => void;
}

class OrderFormConfirmOverlay extends React.Component<
  OrderFormConfirmOverlayProps,
  any
> {
  state = {
    disableOverlay: false,
  };

  constructor(props) {
    super(props);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onConfirmBtnClick = this.onConfirmBtnClick.bind(this);
  }

  onConfirmBtnClick(clientOrderId, side, cb) {
    const { sendOrder, sendDisableConfirm, closeOverlay } = this.props;
    const { disableOverlay } = this.state;
    sendOrder(clientOrderId, side, cb);
    closeOverlay();

    if (disableOverlay) {
      sendDisableConfirm();
    }
  }

  onCheckboxChange(v, e) {
    this.setState({
      disableOverlay: !this.state.disableOverlay,
    });
  }

  render() {
    const {
      orderType,
      side,
      price,
      amount,
      total,
      symbol,
      marginType,
      leverage,
      wallet,
      tif,
      mmr,
      closeOverlay,
      label,
    } = this.props;
    const { disableOverlay } = this.state;

    if (!side) return null;

    const decimalAmount = getAmountDecimals(symbol);
    const decimalPrice = getPriceDecimals(symbol);
    const [base, quote] = getSymbols(symbol);
    const sideCcy =
      wallet === WalletType.DERIVATIVE ? quote : isBuy(side) ? base : quote;
    const marginTypeText =
      marginType === MarginType.CROSS ? "Cross" : `Isolate ${leverage}x`;

    const colorClassName = isBuy(side) ? greenText() : redText();
    return (
      <div className="order-form__confirm-overlay">
        <h5>
          <span className={colorClassName}>
            {getLabelOrderType(orderType)} {getLabelOrderSide(side)}{" "}
            <span className="font-bold">
              <NumberFormat number={amount} decimals={decimalAmount} />
            </span>
          </span>
          <span className="font-bold"> {sideCcy}</span> at a price of{" "}
          <span className="font-bold">
            {isMarketOrder(orderType) ? (
              "Market Price"
            ) : (
              <NumberFormat number={price} decimals={decimalPrice} />
            )}
          </span>
        </h5>
        <div className="d-flex d-align-items-center d-justify-content-space-between mb-10">
          <span className="font-bold show-soft">Order Value</span>
          <span className="font-semi-bold">
            {total} {sideCcy}
          </span>
        </div>
        <div className="d-flex d-align-items-center d-justify-content-space-between mb-10">
          <span className="font-bold show-soft">Margin Type</span>
          <span className="font-semi-bold">{marginTypeText}</span>
        </div>
        <div className="d-flex d-align-items-center d-justify-content-space-between mb-10">
          <span className="font-bold show-soft">Estimated Liq. Price</span>
          <span className="font-semi-bold">
            {formatNumber({
              number: calculateLP({
                leverage,
                price,
                amount,
                mmr,
                marginType,
                side,
              }),
              decimals: decimalPrice,
            })}{" "}
            {sideCcy}
          </span>
        </div>
        <div className="d-flex d-align-items-center d-justify-content-space-between mb-10">
          <span className="font-bold show-soft">Time in Force</span>
          <span className="font-semi-bold">{getLabelTIF(tif)}</span>
        </div>
        <div
          className={`btn-order__wrapper derivative-order-btns mb-10 ${
            !isBuy(side) ? "btn_order_btns--sell" : ""
          }`}
        >
          <div className="order-form__button-container">
            <Button classes="btn btn-cancel gray" onClick={closeOverlay}>
              Cancel
            </Button>
          </div>
          <OrderSubmitButton
            className={`btn ${getLabelOrderSide(side)}`.toLocaleLowerCase()}
            side={side}
            onBtnClickFallback={this.onConfirmBtnClick}
            label={label}
          />
        </div>
        <div className="d-flex font-size-11 d-justify-content-flex-end font-semi-bold d-align-items-center">
          <InputCheckboxInline
            value="1"
            checked={disableOverlay}
            onChange={this.onCheckboxChange}
            label="Don't show again"
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendDisableConfirm() {
    dispatch(
      updateUISetting({
        key: "enabled_order_confirm_popup",
        value: false,
        persist: true,
      })
    );
  },
});

export default connect(null, mapDispatchToProps)(OrderFormConfirmOverlay);
