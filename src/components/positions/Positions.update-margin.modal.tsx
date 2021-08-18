import React, { ReactNode } from "react";
import {
  getAmountDecimals,
  getMinPrice,
  getPriceDecimals,
  getSymbols,
  lastInPair,
} from "@/exports/ticker.utils";
import GroupInput from "../order-form/OrderForm.group-input";
import { connect } from "react-redux";
import {
  ConfirmModal,
  ControlGroupInline,
  InputRadioInline,
  NumberFormat,
  toast,
} from "@/ui-components";
import { closeModal } from "@/actions/app.actions";
import { IConfirmBodyRenderer } from "@/ui-components/ui/Modal/ConfirmModal";

interface EditOrderBtnProps {
  marginPrice: number;
  leverage: number;
  availableMargin: number;
  liqPrice: number;
  symbol: string;
  popupId: string;
  submit: (margin: number, isIncrease: boolean) => void;
  closePopup: (id: string) => void;
}

enum SubmitMarginType {
  INCREASE = 1,
  DECREASE,
}

interface EditOrderBtnState {
  marginPrice: number;
  selectedType: SubmitMarginType;
}

class UpdateMarginModal
  extends React.PureComponent<EditOrderBtnProps, EditOrderBtnState>
  implements IConfirmBodyRenderer
{
  constructor(props: EditOrderBtnProps) {
    super(props);

    this.state = {
      marginPrice: props.marginPrice,
      selectedType: SubmitMarginType.INCREASE,
    };

    this.onTypeChange = this.onTypeChange.bind(this);
    this.onMarginPriceChange = this.onMarginPriceChange.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.onConfirmBtnClick = this.onConfirmBtnClick.bind(this);
  }

  onTypeChange(selectedType: SubmitMarginType) {
    this.setState({
      selectedType,
    });
  }

  onConfirmBtnClick(e) {
    e.stopPropagation();

    const { popupId, closePopup, submit } = this.props;

    if (this.validateInput()) {
      const { selectedType, marginPrice } = this.state;

      submit(+marginPrice, selectedType === SubmitMarginType.INCREASE);

      closePopup(popupId);
    }
  }

  private validateInput(): boolean {
    if (!+this.state.marginPrice) {
      toast.error("invalid margin price.");
    }

    return !!+this.state.marginPrice;
  }

  onMarginPriceChange(value) {
    this.setState({
      marginPrice: value,
    });
  }

  renderBody({ renderButtons }): ReactNode {
    const { symbol, liqPrice, leverage, availableMargin } = this.props;
    const { selectedType, marginPrice } = this.state;
    const [base, quote] = getSymbols(symbol);

    const numberRegex = "[0-9]+";
    const floatingPointRegex = "[+-]?([0-9]+([.][0-9]{0,8})?|[.][0-9]{1,8})";
    const decimalPlacePrice = getPriceDecimals(symbol);
    const regex = decimalPlacePrice
      ? `^([0-9]+([.][0-9]{0,${decimalPlacePrice}})?|[.][0-9]{1,${decimalPlacePrice}})$`
      : decimalPlacePrice === null
      ? floatingPointRegex
      : numberRegex;

    return (
      <div className="position__edit__body__ctn">
        <div className="d-flex d-justify-content-space-around mt-10 mb-10">
          <InputRadioInline
            value={SubmitMarginType.INCREASE}
            checked={selectedType === SubmitMarginType.INCREASE}
            onChange={this.onTypeChange}
            label="Increase (+)"
          />
          <InputRadioInline
            value={SubmitMarginType.DECREASE}
            checked={selectedType === SubmitMarginType.DECREASE}
            onChange={this.onTypeChange}
            label="Decrease (-)"
          />
        </div>
        <div className="position__edit__body__row">
          <div className="position__edit__body__row__title">+ Margin</div>
          <div className="position__edit__body__row__value">
            <GroupInput
              addonAfter={base}
              onChange={this.onMarginPriceChange}
              value={marginPrice}
              pattern={regex}
            />
          </div>
        </div>
        <div className="position__edit__body__row">
          <div className="position__edit__body__row__title">Liq. Price</div>
          <div className="position__edit__body__row__value">
            <NumberFormat classes="text--blue" number={liqPrice} decimals={2} />
          </div>
        </div>
        <div className="position__edit__body__row">
          <div className="position__edit__body__row__title">
            Current Leverage
          </div>
          <div className="position__edit__body__row__value">{leverage}x</div>
        </div>
        <div className="position__edit__body__row">
          <div className="position__edit__body__row__title">
            Assigned Margin
          </div>
          <div className="position__edit__body__row__value">
            <NumberFormat number={this.props.marginPrice} decimals={2} />{" "}
            {quote}
          </div>
        </div>
        <div className="position__edit__body__row">
          <div className="position__edit__body__row__title">Avail. Margin</div>
          <div className="position__edit__body__row__value">
            <NumberFormat number={availableMargin} decimals={2} /> {quote}
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
        title="Add/Remove Margin"
        mId={popupId}
        initWidth={280}
        useLegacyBtns={false}
        popupData={this.state}
        okText="Add Margin"
      >
        {this.renderBody}
      </ConfirmModal>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  submit: function (marginPrice: number, isIncrease: boolean) {
    // dispatch(replaceOrder(params));
  },
  closePopup(id) {
    dispatch(closeModal(id));
  },
});

export default connect(null, mapDispatchToProps)(UpdateMarginModal);
