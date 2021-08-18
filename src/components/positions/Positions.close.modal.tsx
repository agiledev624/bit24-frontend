import { OrderSide } from "@/constants/order-enums";
import { greenText, redText } from "@/exports";
import { multiply } from "@/exports/math";
import {
  getAmountDecimals,
  getPriceDecimals,
  getSymbols,
} from "@/exports/ticker.utils";
import React, { ReactNode } from "react";
import GroupInput from "../order-form/OrderForm.group-input";
import OrderFormQuantityButtons from "../order-form/OrderForm.quantity-buttons";
import _get from "lodash/get";
import { connect } from "react-redux";
import { updateUISetting } from "@/actions/ui-setting.actions";
import { ConfirmModal, InputCheckboxInline } from "@/ui-components";
import { closeModal } from "@/actions/app.actions";

interface PositionCloseLimitModalProps {
  position: any;
  symbol: string;
  confirmFunc: (price: number, qty: number) => void;
  confirmDisablePopup: (key: string) => void;
  balance: number;
  isMarket: boolean;
  closePopup: (id: string) => void;
}

interface PositionCloseLimitModalState {
  disablePopup: boolean;
  price: string;
  qty: string;
}

class PositionCloseModal extends React.Component<
  Partial<PositionCloseLimitModalProps>,
  PositionCloseLimitModalState
> {
  constructor(props) {
    super(props);

    this.onPriceChange = this.onPriceChange.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onPercQuantityBtnClick = this.onPercQuantityBtnClick.bind(this);
    this.onConfirmBtnClick = this.onConfirmBtnClick.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);

    this.state = {
      price: _get(props, ["position", "entryPrice"], ""),
      qty: _get(props, ["position", "size"], ""),
      disablePopup: false,
    };
  }

  onCheckboxChange(v, e) {
    this.setState({
      disablePopup: !this.state.disablePopup,
    });
  }

  onConfirmBtnClick(e) {
    e.stopPropagation();
    const { disablePopup, price, qty } = this.state;
    const { confirmFunc, confirmDisablePopup, isMarket, closePopup } =
      this.props;

    confirmFunc(+price, +qty);

    if (disablePopup) {
      const key = isMarket
        ? "enabled_position_close_market_popup"
        : "enabled_position_close_limit_popup";
      confirmDisablePopup(key);
    }
    const mid = isMarket
      ? "position_market_close_popup"
      : "position_limit_close_popup";
    closePopup(mid);
  }

  onPriceChange(value: string) {
    this.setState({
      price: value,
    });
  }

  onAmountChange(value: string) {
    this.setState({
      qty: value,
    });
  }

  onPercQuantityBtnClick(_: number, percentage: number = 1) {
    // if (!balance)
    //   return;

    if (percentage !== 1) {
      this.setState({
        qty: multiply(+this.state.qty, percentage),
      });
    } else {
      this.setState({
        qty: this.props.position.size,
      });
    }
  }

  renderBody({ renderButtons }): ReactNode {
    const { symbol, position, balance, isMarket } = this.props;

    const { price, qty, disablePopup } = this.state;
    const [base, quote] = getSymbols(symbol);

    const numberRegex = "[0-9]+";
    const floatingPointRegex = "[+-]?([0-9]+([.][0-9]{0,8})?|[.][0-9]{1,8})";
    const decimalPlacePrice = getPriceDecimals(symbol);
    const decimalPlaceAmount = getAmountDecimals(symbol);
    const priceRegex = decimalPlacePrice
      ? `^([0-9]+([.][0-9]{0,${decimalPlacePrice}})?|[.][0-9]{1,${decimalPlacePrice}})$`
      : decimalPlacePrice === null
      ? floatingPointRegex
      : numberRegex;
    const amountRegex = decimalPlaceAmount
      ? `^([0-9]+([.][0-9]{0,${decimalPlaceAmount}})?|[.][0-9]{1,${decimalPlaceAmount}})$`
      : decimalPlaceAmount === null
      ? floatingPointRegex
      : numberRegex;
    const side = position.side || OrderSide.BUY;

    return (
      <div className="edit-order__body position__edit__body__ctn">
        {!isMarket && (
          <div className="position__edit__body__row">
            <GroupInput
              addonAfter={quote}
              addonBefore="Close Price"
              onChange={this.onPriceChange}
              value={price}
              pattern={priceRegex}
            />
          </div>
        )}
        <div className="position__edit__body__row">
          <GroupInput
            addonAfter={quote}
            addonBefore="Close Size"
            onChange={this.onAmountChange}
            value={qty}
            pattern={amountRegex}
          />
        </div>
        <div className="position__edit__body__row">
          <OrderFormQuantityButtons
            balance={balance}
            side={side}
            onClick={this.onPercQuantityBtnClick}
          />
        </div>
        <div className="summary">
          <div className="edit-order__row">
            <span>Est. Profit</span>
            <span className={greenText()}>0.001 {base}</span>
          </div>
          <div className="edit-order__row">
            <span>Est. Loss</span>
            <span className={redText()}>---</span>
          </div>
        </div>
        {renderButtons({ onOKBtnClick: this.onConfirmBtnClick })}
        <div className="d-flex font-size-11 d-justify-content-flex-end font-semi-bold d-align-items-center">
          <InputCheckboxInline
            value="1"
            checked={disablePopup}
            onChange={this.onCheckboxChange}
            label="Don't show again"
          />
        </div>
      </div>
    );
  }

  render() {
    const { isMarket } = this.props;
    const mid = isMarket
      ? "position_market_close_popup"
      : "position_limit_close_popup";

    return (
      <ConfirmModal
        title={`${isMarket ? "Market" : "Limit"} Close Position`}
        mId={mid}
        useLegacyBtns={false}
        initWidth={280}
        okText={`${isMarket ? "Market" : "Limit"} Close`}
        popupData={this.state}
      >
        {this.renderBody}
      </ConfirmModal>
    );
  }
}

const mapStateToProps = (state) => ({
  // wait real balance data
  balance: 0,
});
const mapDispatchToProps = (dispatch) => ({
  confirmDisablePopup(key) {
    dispatch(
      updateUISetting({
        key: key,
        value: false,
        persist: false,
      })
    );
  },
  closePopup(id) {
    dispatch(closeModal(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PositionCloseModal);
