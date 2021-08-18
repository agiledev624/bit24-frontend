import { AppTradeType } from "@/constants/trade-type";
import React, { ReactNode } from "react";
import { isStopOrder } from "@/components/order-form/OrderForm.helpers";
import { OrderItem } from "@/models/order.model";
import { getLabelOrderType, getLabelStopTrigger } from "@/exports/order.utils";
import {
  getAmountDecimals,
  getMinPrice,
  getPriceDecimals,
  lastInPair,
} from "@/exports/ticker.utils";
import GroupInput from "../order-form/OrderForm.group-input";
import { titleCase } from "@/exports";
import { replaceOrder, ReplaceOrderParams } from "@/actions/order.actions";
import { connect } from "react-redux";
import { ConfirmModal, toast } from "@/ui-components";
import { closeModal } from "@/actions/app.actions";
import { IConfirmBodyRenderer } from "@/ui-components/ui/Modal/ConfirmModal";

interface EditOrderBtnProps {
  order: OrderItem;
  symbol: string;
  tradetype: AppTradeType;
  cellType: "price" | "stop-price" | "qty";
  popupId: string;
  submitOrderReplace: (params: ReplaceOrderParams) => void;
  closePopup: (id: string) => void;
}

interface EditOrderBtnState {
  price: number;
  stopPrice: number;
  qty: number;
}

class EditOrderModal
  extends React.PureComponent<EditOrderBtnProps, EditOrderBtnState>
  implements IConfirmBodyRenderer
{
  constructor(props: EditOrderBtnProps) {
    super(props);

    this.state = {
      price: props.order.price,
      stopPrice: props.order.stopPrice,
      qty: props.order.qty,
    };

    this.onStopPriceChange = this.onStopPriceChange.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onQtyChange = this.onQtyChange.bind(this);
    this.onConfirmBtnClick = this.onConfirmBtnClick.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  onConfirmBtnClick(e) {
    e.stopPropagation();

    const { popupId, closePopup } = this.props;

    if (this.validateInput()) {
      const { order, submitOrderReplace } = this.props;
      const k = this._getKey();

      if (this.state[k] !== order[k]) {
        const params = {
          order,
          clientOrderId: Date.now(),
          [k]: +this.getCurrentValue(),
        };

        submitOrderReplace(params);
      }

      closePopup(popupId);
    }
  }

  private validateInput(): boolean {
    const k = this._getKey();
    if (!this.state[k]) {
      toast.error("invalid param.", "Order Rejected");
    }

    return !!+this.state[k];
  }

  private _getKey(): string {
    const { cellType } = this.props;
    return cellType === "stop-price" ? "stopPrice" : cellType;
  }

  onStopPriceChange(value) {
    this.setState({
      stopPrice: value,
    });
  }

  onPriceChange(value) {
    this.setState({
      price: value,
    });
  }

  onQtyChange(value) {
    this.setState({
      qty: value,
    });
  }

  getPopupLblByCellType() {
    return `Edit ${
      this.isStopOrder() ? "Stop" : ""
    } Order ${this.getLblCellType()}`;
  }

  getLblCellType() {
    const { cellType } = this.props;

    switch (cellType) {
      case "qty": {
        return "Size";
      }
      default: {
        return titleCase(cellType);
      }
    }
  }

  renderBody({ renderButtons }): ReactNode {
    const { symbol, order } = this.props;

    return (
      <div className="edit-order__body">
        <div className="edit-order__row">
          <span>Symbol</span>
          <span>{symbol}</span>
        </div>
        <div className="edit-order__row">
          <span>Type</span>
          <span>{getLabelOrderType(order.orderType)}</span>
        </div>
        {this.isStopOrder() && (
          <div className="edit-order__row">
            <span>Trigger</span>
            <span>{getLabelStopTrigger(order.triggerType)}</span>
          </div>
        )}
        <div className="divider"></div>
        {this.renderInput()}
        {renderButtons({ onOKBtnClick: this.onConfirmBtnClick })}
      </div>
    );
  }

  private renderInput(): ReactNode {
    const { symbol, cellType } = this.props;
    const quote = lastInPair(symbol) || "USD";

    const props = {
      pattern: this.getPattern(),
      value: this.getCurrentValue(),
      onChange: this.getHandler(),
      addonAfter: quote,
      addonBefore: this.getLblCellType(),
      step: cellType !== "qty" ? getMinPrice(symbol) : undefined,
    };

    return <GroupInput {...props} />;
  }

  getPattern() {
    const { symbol, cellType } = this.props;
    const numberRegex = "[0-9]+";
    const floatingPointRegex = "[+-]?([0-9]+([.][0-9]{0,8})?|[.][0-9]{1,8})";
    if (cellType === "qty") {
      const decimalPlaceAmount = getAmountDecimals(symbol);
      return decimalPlaceAmount
        ? `^([0-9]+([.][0-9]{0,${decimalPlaceAmount}})?|[.][0-9]{1,${decimalPlaceAmount}})$`
        : decimalPlaceAmount === null
        ? floatingPointRegex
        : numberRegex;
    } else {
      const decimalPlacePrice = getPriceDecimals(symbol);
      return decimalPlacePrice
        ? `^([0-9]+([.][0-9]{0,${decimalPlacePrice}})?|[.][0-9]{1,${decimalPlacePrice}})$`
        : decimalPlacePrice === null
        ? floatingPointRegex
        : numberRegex;
    }
  }

  private getCurrentValue(): number {
    const { cellType } = this.props;
    // const k = this._getKey();
    // return this.state[k];
    switch (cellType) {
      case "qty": {
        return this.state.qty;
      }
      case "price": {
        return this.state.price;
      }
      case "stop-price": {
        return this.state.stopPrice;
      }
    }
  }

  private getHandler() {
    const { cellType } = this.props;

    switch (cellType) {
      case "qty": {
        return this.onQtyChange;
      }
      case "price": {
        return this.onPriceChange;
      }
      case "stop-price": {
        return this.onStopPriceChange;
      }
    }
  }

  private isStopOrder(): boolean {
    const { order } = this.props;

    return isStopOrder(order.orderType);
  }

  render() {
    const { popupId } = this.props;

    return (
      <ConfirmModal
        title={this.getPopupLblByCellType()}
        mId={popupId}
        initWidth={280}
        useLegacyBtns={false}
        popupData={this.getCurrentValue()}
        okText={`Edit ${this.getLblCellType()}`}
      >
        {this.renderBody}
      </ConfirmModal>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitOrderReplace: function (params: ReplaceOrderParams) {
    dispatch(replaceOrder(params));
  },
  closePopup(id) {
    dispatch(closeModal(id));
  },
});

export default connect(null, mapDispatchToProps)(EditOrderModal);
