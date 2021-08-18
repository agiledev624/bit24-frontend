import { closeModal } from "@/actions/app.actions";
import { LastTradePriceType } from "@/constants/order-enums";
import { greenText, redText } from "@/exports";
import { getPriceDecimals, lastInPair } from "@/exports/ticker.utils";
import { ConfirmModal } from "@/ui-components";
import { IConfirmBodyRenderer } from "@/ui-components/ui/Modal/ConfirmModal";
import React, { ReactNode } from "react";
import { connect } from "react-redux";
import GroupInput from "../order-form/OrderForm.group-input";
import { OrderFormLastTradePriceOptions } from "../order-form/OrderForm.lastTradePrice-options";

interface TPSLModalState {
  takeProfit: number;
  stopLoss: number;
  takeProfitTradePriceType: LastTradePriceType;
  stopLossTradePriceType: LastTradePriceType;
}

type TPSLModalProps = TPSLModalState & {
  symbol: string;
  popupId: string;
  closePopup: (mId: string) => void;
  sendSubmit: (data: TPSLModalState) => void;
};

class TPSLModal
  extends React.PureComponent<Partial<TPSLModalProps>, TPSLModalState>
  implements IConfirmBodyRenderer
{
  static defaultProps = {
    takeProfitTradePriceType: LastTradePriceType.LAST_PRICE,
    stopLossTradePriceType: LastTradePriceType.LAST_PRICE,
  };

  constructor(props) {
    super(props);

    this.state = {
      takeProfit: props.takeProfit,
      stopLoss: props.stopLoss,
      takeProfitTradePriceType: props.takeProfitTradePriceType,
      stopLossTradePriceType: props.stopLossTradePriceType,
    };

    this.onTakeProfitLastTradePriceTypeChange =
      this.onTakeProfitLastTradePriceTypeChange.bind(this);
    this.onStopLossLastTradePriceTypeChange =
      this.onStopLossLastTradePriceTypeChange.bind(this);
    this.onStopLossChange = this.onStopLossChange.bind(this);
    this.onTakeProfitChange = this.onTakeProfitChange.bind(this);
    this.onConfirmBtnClick = this.onConfirmBtnClick.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  onConfirmBtnClick(e) {
    e.stopPropagation();

    const { popupId, closePopup, sendSubmit } = this.props;

    sendSubmit(this.state);
    closePopup(popupId);
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

  renderBody({ renderButtons }): ReactNode {
    const {
      takeProfit,
      stopLoss,
      takeProfitTradePriceType,
      stopLossTradePriceType,
    } = this.state;
    const { symbol } = this.props;
    const quote = lastInPair(symbol);
    const decimalPlacePrice = getPriceDecimals(symbol);
    const numberRegex = "[0-9]+";
    const floatingPointRegex = "[+-]?([0-9]+([.][0-9]{0,8})?|[.][0-9]{1,8})";
    const priceRegex = decimalPlacePrice
      ? `^([0-9]+([.][0-9]{0,${decimalPlacePrice}})?|[.][0-9]{1,${decimalPlacePrice}})$`
      : decimalPlacePrice === null
      ? floatingPointRegex
      : numberRegex;

    return (
      <div className="edit-order__body tpsl-body__ctn">
        <div className="edit-order__row">
          <span>Symbol</span>
          <span>{symbol}</span>
        </div>
        <div className="edit-order__row">
          <span>Entry Price</span>
          <span>9550.0</span>
        </div>
        <div className="edit-order__row">
          <span>Mark Price</span>
          <span>9550.4</span>
        </div>
        <div className="divider"></div>
        <div className="order-form__input-wraper--2-1">
          <GroupInput
            value={takeProfit === undefined ? "" : takeProfit}
            pattern={priceRegex}
            onChange={this.onTakeProfitChange}
            addonAfter={quote}
            addonBefore={"Take Profit"}
          />
          <OrderFormLastTradePriceOptions
            selected={takeProfitTradePriceType}
            onLastTradePriceTypeChange={
              this.onTakeProfitLastTradePriceTypeChange
            }
          />
        </div>
        <div className="order-form__input-wraper--2-1">
          <GroupInput
            value={stopLoss === undefined ? "" : stopLoss}
            pattern={priceRegex}
            onChange={this.onStopLossChange}
            addonAfter={quote}
            addonBefore={"Stop Loss"}
          />
          <OrderFormLastTradePriceOptions
            selected={stopLossTradePriceType}
            onLastTradePriceTypeChange={this.onStopLossLastTradePriceTypeChange}
          />
        </div>
        <div className="divider mt-10"></div>
        <div className="summary">
          <div className="edit-order__row">
            <span>Est. Profit</span>
            <span className={greenText()}>0.001 BTC</span>
          </div>
          <div className="edit-order__row">
            <span>Est. Loss</span>
            <span className={redText()}>0.001 BTC</span>
          </div>
        </div>
        {renderButtons({ onOKBtnClick: this.onConfirmBtnClick })}
      </div>
    );
  }

  render() {
    const { popupId } = this.props;

    return (
      <ConfirmModal
        title="Take Profit/Stop Loss"
        mId={popupId}
        initWidth={280}
        useLegacyBtns={false}
        popupData={this.state}
        okText="Confirm"
      >
        {this.renderBody}
      </ConfirmModal>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  closePopup(id) {
    dispatch(closeModal(id));
  },
});
export default connect(null, mapDispatchToProps)(TPSLModal);
