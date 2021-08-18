import { ICELayers, OrderType } from "@/constants/order-enums";
import { AppTradeType } from "@/constants/trade-type";
import {
  getAmountDecimals,
  getMinPrice,
  getPriceDecimals,
  getSymbols,
} from "@/exports/ticker.utils";
import { Tabs, InputCheckboxInline, SelectDropdown } from "@/ui-components";
import React from "react";
import OrderFormCollapseArea from "./OrderForm.collapse-area";
import GroupInput from "./OrderForm.group-input";
import {
  shouldDisplayLayers,
  shouldDisplayPriceIncreAndOffset,
  shouldDisplayStandaloneOffset,
  shouldDisplayStandaloneStopPrice,
  shouldDisplayStopPriceField,
  shouldDisplayStopTriggerGroup,
  shouldDisplayTIFOptions,
  shouldDisplayTPnSLGroups,
  shouldDisplayTrailValueField,
  shouldHidePriceField,
} from "./OrderForm.helpers";
import OrderFormInputWithInfo from "./OrderForm.input-with-info";
import { OrderFormLastTradePriceOptions } from "./OrderForm.lastTradePrice-options";
import OrderFormQuantityButtons from "./OrderForm.quantity-buttons";
import OrderFormStopTrigger from "./OrderForm.stop-trigger";
import { OrderFormTIFOptions } from "./OrderForm.tif-options";
import { OrderFormTradeOptions } from "./OrderForm.trade-options";
import { OrderFormInputDataFlows } from "./OrderForm.types";

export default class OrderFormInputs extends React.Component<
  Partial<OrderFormInputDataFlows>,
  any
> {
  constructor(props) {
    super(props);
    this.state = {
      layers: Object.values(ICELayers)
        .filter((v) => !isNaN(+v))
        .map((v) => ({
          label: `${v}`,
          value: v,
        })),
    };
    this.onLayerChange = this.onLayerChange.bind(this);
  }

  onLayerChange({ value }) {
    const { onLayerChange } = this.props;

    onLayerChange(value);
  }

  render() {
    const { layers } = this.state;

    const {
      orderTypes,
      side,
      pair,
      typeId,
      price,
      amount,
      stopPrice,
      tif,
      balance,
      tradeOptions,
      stopLoss,
      takeProfit,
      takeProfitTradePriceType,
      stopLossTradePriceType,
      trailValue,
      onStopPriceChange,
      onAmountChange,
      onUpdateAmountByBalancePercent,
      onPriceChange,
      onOrderTypeChange,
      onTIFChange,
      onTradeOptionChange,
      onTakeProfitLastTradePriceTypeChange,
      onStopLossLastTradePriceTypeChange,
      onStopLossChange,
      onTakeProfitChange,
      enabledStopTrigger,
      onToggleStopTrigger,
      selectedCloseTrigger,
      onCloseTriggerOptionChange,
      onTrailValueChange,
      offset,
      onOffsetChange,
      priceIncrement,
      onPriceIncrementChange,
      qtyIncrement,
      selectedLayer,
      onQtyIncrementChange,
      tradeType,
    } = this.props;
    const [base, quote] = getSymbols(pair);
    const decimalPlacePrice = getPriceDecimals(pair);
    const decimalPlaceAmount = getAmountDecimals(pair);
    const numberRegex = "[0-9]+";
    const floatingPointRegex = "[+-]?([0-9]+([.][0-9]{0,8})?|[.][0-9]{1,8})";
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
    const step = getMinPrice(pair);
    return (
      <div>
        {orderTypes.length ? (
          <div className="mb-10 tabs-order-type_ctn">
            <Tabs
              elements={orderTypes}
              selected={`${typeId}`}
              onChange={onOrderTypeChange}
              tabClassName="tab-order-type"
              containerClassName="tabs-order-type"
            />
          </div>
        ) : null}

        {!shouldHidePriceField(typeId) && (
          <div className="mb-10">
            <GroupInput
              pattern={priceRegex}
              value={price}
              onChange={onPriceChange}
              addonAfter={quote}
              addonBefore={"Price"}
              step={step}
            />
          </div>
        )}

        {shouldDisplayStopPriceField(typeId) && (
          <div className="mb-10">
            <GroupInput
              value={stopPrice}
              pattern={priceRegex}
              onChange={onStopPriceChange}
              addonAfter={quote}
              addonBefore={"Stop Price"}
              step={step}
            />
          </div>
        )}
        {shouldDisplayPriceIncreAndOffset(typeId) && (
          <div className="mb-10 order-form__input-wraper--1-1">
            <OrderFormInputWithInfo
              pattern={priceRegex}
              placeholder="Price Increment"
              value={priceIncrement || ""}
              onChange={onPriceIncrementChange}
            />
            <OrderFormInputWithInfo
              pattern={priceRegex}
              placeholder="Offset"
              value={offset || ""}
              onChange={onOffsetChange}
            />
          </div>
        )}
        {shouldDisplayStandaloneOffset(typeId) && (
          <div className="mb-10">
            <GroupInput
              value={offset}
              pattern={priceRegex}
              onChange={onOffsetChange}
              addonBefore={"Offset"}
            />
          </div>
        )}
        <div className="mb-10">
          <GroupInput
            value={amount}
            pattern={amountRegex}
            onChange={onAmountChange}
            addonAfter={base}
            addonBefore={"Quantity"}
          />
        </div>
        {shouldDisplayTrailValueField(typeId) && (
          <div className="mb-10">
            <GroupInput
              value={trailValue}
              pattern={amountRegex}
              onChange={onTrailValueChange}
              addonAfter={base}
              addonBefore={"Trail Value"}
            />
          </div>
        )}
        {shouldDisplayLayers(typeId) && (
          <div className="mb-10 order-form__input-wraper--1-1">
            <SelectDropdown
              placeholder="Layers"
              options={layers}
              value={selectedLayer}
              onChange={this.onLayerChange}
            />
            <OrderFormInputWithInfo
              pattern={amountRegex}
              placeholder="Offset"
              value={qtyIncrement || ""}
              onChange={onQtyIncrementChange}
            />
          </div>
        )}
        <div className="mb-10">
          <OrderFormQuantityButtons
            balance={balance}
            side={side}
            onClick={onUpdateAmountByBalancePercent}
          />
        </div>
        {shouldDisplayTIFOptions(typeId) && (
          <div className="mb-10 d-flex d-justify-content-space-between">
            <InputCheckboxInline
              value={OrderType.HIDDEN}
              checked={typeId === OrderType.HIDDEN}
              onChange={onOrderTypeChange}
              label="Hidden"
            />
            <OrderFormTradeOptions
              orderType={typeId}
              selectedOptions={tradeOptions}
              onTradeOptionChange={onTradeOptionChange}
            />
            <OrderFormTIFOptions selected={tif} onTIFChange={onTIFChange} />
          </div>
        )}
        {shouldDisplayStopTriggerGroup(typeId) && (
          <OrderFormStopTrigger
            enabledStopTrigger={enabledStopTrigger}
            onToggleStopTrigger={onToggleStopTrigger}
            selectedCloseTrigger={selectedCloseTrigger}
            onCloseTriggerOptionChange={onCloseTriggerOptionChange}
          />
        )}
        {shouldDisplayStandaloneStopPrice(typeId) && (
          <div className="mb-10">
            <OrderFormInputWithInfo
              inputClass="border-radius"
              placeholder="Stop Price"
              value={stopPrice || ""}
              pattern={priceRegex}
              onChange={onStopPriceChange}
            />
          </div>
        )}
        {shouldDisplayTPnSLGroups(typeId) && (
          <OrderFormCollapseArea
            title="Add Take Profit / Stop Loss"
            expandedTitle="Remove Take Profit / Stop Loss"
          >
            <div className="order-form__input-wraper--2-1">
              <GroupInput
                value={takeProfit}
                pattern={priceRegex}
                onChange={onTakeProfitChange}
                addonAfter={quote}
                addonBefore={"Take Profit"}
              />
              {tradeType !== AppTradeType.SPOT && (
                <OrderFormLastTradePriceOptions
                  selected={takeProfitTradePriceType}
                  onLastTradePriceTypeChange={
                    onTakeProfitLastTradePriceTypeChange
                  }
                />
              )}
            </div>
            <div className="order-form__input-wraper--2-1">
              <GroupInput
                value={stopLoss}
                pattern={priceRegex}
                onChange={onStopLossChange}
                addonAfter={quote}
                addonBefore={"Stop Loss"}
              />
              {tradeType !== AppTradeType.SPOT && (
                <OrderFormLastTradePriceOptions
                  selected={stopLossTradePriceType}
                  onLastTradePriceTypeChange={
                    onStopLossLastTradePriceTypeChange
                  }
                />
              )}
            </div>
          </OrderFormCollapseArea>
        )}
      </div>
    );
  }
}
