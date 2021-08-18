import { walletNameFromId } from "@/constants/balance-enums";
import { MarginType, OrderSide, OrderType } from "@/constants/order-enums";
import { formatNumber, greenText, redText } from "@/exports";
import {
  getAmountDecimals,
  getPriceDecimals,
  getSymbols,
} from "@/exports/ticker.utils";
import { Button, Tabs, TabTypes, toast } from "@/ui-components";
import { InputRangeSlider } from "@/ui-components/ui/inputs";
import React from "react";
import OrderFormInputs from "./OrderForm.inputs";
import OrderSubmitButton from "./OrderForm.submit-btn";
import { OrderFormProps } from "./OrderForm.types";
import _get from "lodash/get";
import OrderFormAdvanced from "./OrderForm.advanced";

interface OrderFormDerivativeState {
  selectedTab: string;
  leverage: number;
  tabs: any[];
  showSlider: boolean;
}
export class OrderFormDerivative extends React.Component<
  Partial<OrderFormProps>,
  OrderFormDerivativeState
> {
  constructor(props) {
    super(props);

    this.onTabChanged = this.onTabChanged.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.onConfirmBtnClick = this.onConfirmBtnClick.bind(this);
    this.onCancelBtnClick = this.onCancelBtnClick.bind(this);
    this.onMinusBtnClick = this.onMinusBtnClick.bind(this);
    this.onPlusBtnClick = this.onPlusBtnClick.bind(this);
    this.onLeverageInputChange = this.onLeverageInputChange.bind(this);

    this.state = {
      selectedTab: "cross",
      leverage: props.leverage,
      showSlider: false,
      tabs: [
        {
          title: "Cross",
          to: "cross",
        },
        {
          title: `Isolated (${props.leverage}x)`,
          to: "isolate",
        },
      ],
    };
  }

  onLeverageInputChange(e) {
    if (!e.target.validity.valid) return;

    const { maxLeverage } = this.props;

    if (e.target.value > maxLeverage || e.target.value < 1) return;

    this.setState({
      leverage: e.target.value,
    });
  }

  onPlusBtnClick(e) {
    const { maxLeverage } = this.props;

    if (this.state.leverage + 1 > maxLeverage) {
      return;
    }

    this.setState({
      leverage: this.state.leverage + 1,
    });
  }

  onMinusBtnClick(e) {
    if (this.state.leverage - 1 < 1) {
      return;
    }

    this.setState({
      leverage: this.state.leverage - 1,
    });
  }

  private onCancelBtnClick(e) {
    this.setState({
      showSlider: false,
      leverage: this.props.leverage,
    });
  }

  private onConfirmBtnClick(e) {
    this.setState({
      tabs: this.state.tabs.map((tab) => {
        if (tab.to === "isolate") {
          return {
            ...tab,
            title: `Isolated (${this.state.leverage}x)`,
          };
        }

        return tab;
      }),
      showSlider: false,
    });
  }

  private onSliderChange(value: number) {
    this.setState({
      leverage: value,
    });
  }

  private onTabChanged(to: string) {
    this.setState(
      {
        selectedTab: to,
        showSlider: to === "isolate",
      },
      () => {
        // reset to LIMIT type
        // const { onOrderTypeChange } = this.props;
        // onOrderTypeChange(`${OrderType.LIMIT}`);
      }
    );
  }

  private renderTab() {
    return (
      <Tabs
        elements={this.state.tabs}
        selected={this.state.selectedTab}
        onChange={this.onTabChanged}
        tabType={TabTypes.RADIO_BUTTONS}
        containerClassName="border-radius order-form-derivative__trade-tabs"
      />
    );
  }

  private sendOrder(clientOrderId: number, side: OrderSide, cb) {
    const { onOrderBtnClick } = this.props;

    onOrderBtnClick(
      clientOrderId,
      {
        side,
        selectedLeverage: this.state.leverage,
        marginType: this.state.selectedTab as MarginType,
      },
      cb
    );
  }

  private renderForm() {
    const {
      total,
      balances,
      wallet,
      pair,
      typeId,
      onRefreshSizeChange,
      onDisplaySizeChange,
      displaySize,
      refreshSize,
      hidden,
    } = this.props;
    const [, quote] = getSymbols(pair);
    const balanceCCy = quote;

    const balanceAmount = _get(
      balances,
      [balanceCCy, walletNameFromId(wallet), "available"],
      0
    );

    return (
      <>
        <OrderFormInputs balance={balanceAmount} {...this.props} />
        <div className="btn-order__wrapper derivative-order-btns mb-10">
          <OrderSubmitButton
            className="btn text-center buy"
            side={OrderSide.BUY}
            onBtnClickFallback={this.sendOrder}
            label="BUY / LONG"
          />
          <OrderSubmitButton
            className="btn text-center sell"
            side={OrderSide.SELL}
            onBtnClickFallback={this.sendOrder}
            label="SELL / SHORT"
          />
        </div>
        <div className="d-flex font-size-11 d-justify-content-space-between font-semi-bold">
          <div className="d-flex d-flex-direction-column">
            <div className="text--white mb-4">Order Value</div>
            <div className="number-text">
              {hidden ? (
                <div className="text--cool-grey-50">●●●●●●●●●●</div>
              ) : (
                <>
                  {formatNumber({
                    number: total,
                    decimals: getAmountDecimals(pair),
                  })}{" "}
                  USDT
                </>
              )}
            </div>
          </div>
          <div className="d-flex d-flex-direction-column">
            <div className="text-right text--white mb-4">Available Margin</div>
            <div className="number-text text-right">
              {hidden ? (
                <div className="text--cool-grey-50">●●●●●●●●●●</div>
              ) : (
                <>
                  {formatNumber({
                    number: 0,
                    decimals: getAmountDecimals(pair),
                  })}{" "}
                  USDT
                </>
              )}
            </div>
          </div>
        </div>
        <OrderFormAdvanced
          pair={pair}
          typeId={typeId}
          displaySize={displaySize}
          refreshSize={refreshSize}
          onDisplaySizeChange={onDisplaySizeChange}
          onRefreshSizeChange={onRefreshSizeChange}
        />
      </>
    );
  }

  private renderLeverage() {
    const { maxLeverage } = this.props;
    const { leverage } = this.state;
    const numberRegex = "[0-9]+";

    return (
      <div className="adjust-leverage">
        <div className="font-medium title">Adjust Leverage</div>
        <div className="input-inline">
          <div className="prepend clickable" onClick={this.onMinusBtnClick}>
            <i className={`fa fa-minus ${redText()}`} />
          </div>
          <div className="input">
            <input
              type="text"
              pattern={numberRegex}
              value={leverage}
              onChange={this.onLeverageInputChange}
            />
            <span>x</span>
          </div>
          <div className="append clickable" onClick={this.onPlusBtnClick}>
            <i className={`fa fa-plus ${greenText()}`} />
          </div>
        </div>
        <div className="slider__ctn">
          <InputRangeSlider
            value={leverage}
            min={1}
            max={maxLeverage}
            onChange={this.onSliderChange}
          />
        </div>
        <div className="btn-list">
          <Button classes="btn btn-cancel" onClick={this.onCancelBtnClick}>
            <span className="text--white">Cancel</span>
          </Button>
          <Button classes="btn primary" onClick={this.onConfirmBtnClick}>
            <span className="text--white">Confirm</span>
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { selectedTab } = this.state;

    return (
      <div className="order-form__wrapper">
        <div className="mb-10">{this.renderTab()}</div>
        <div className="order-form__body__ctn">
          {this.renderForm()}
          {selectedTab === "isolate" &&
            this.state.showSlider &&
            this.renderLeverage()}
        </div>
      </div>
    );
  }
}
