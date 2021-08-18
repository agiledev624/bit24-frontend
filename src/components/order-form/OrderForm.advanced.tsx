import { OrderType } from "@/constants/order-enums";
import { getPriceDecimals } from "@/exports/ticker.utils";
import React from "react";
import OrderFormCollapseArea from "./OrderForm.collapse-area";
import { shouldDisplayAdvancedGroups } from "./OrderForm.helpers";
import OrderFormInputWithInfo from "./OrderForm.input-with-info";

interface OrderFormAdvancedProps {
  pair: string;
  typeId: OrderType;
  displaySize?: number;
  refreshSize?: number;
  onDisplaySizeChange: (n: number) => void;
  onRefreshSizeChange: (n: number) => void;
}

class OrderFormAdvanced extends React.PureComponent<OrderFormAdvancedProps> {
  render() {
    const {
      pair,
      typeId,
      displaySize,
      onDisplaySizeChange,
      refreshSize,
      onRefreshSizeChange,
    } = this.props;
    const numberRegex = "[0-9]+";
    const floatingPointRegex = "[+-]?([0-9]+([.][0-9]{0,8})?|[.][0-9]{1,8})";
    const decimalPlacePrice = getPriceDecimals(pair);
    const priceRegex = decimalPlacePrice
      ? `^([0-9]+([.][0-9]{0,${decimalPlacePrice}})?|[.][0-9]{1,${decimalPlacePrice}})$`
      : decimalPlacePrice === null
      ? floatingPointRegex
      : numberRegex;

    return shouldDisplayAdvancedGroups(typeId) ? (
      <OrderFormCollapseArea title="Advanced">
        <div className="order-form__input-wraper--1-1">
          <OrderFormInputWithInfo
            pattern={priceRegex}
            placeholder="Display Size"
            value={displaySize || ""}
            onChange={onDisplaySizeChange}
            tooltipContent="Value entered will be shown on Order Book rather than the size of your entire order."
          />
          <OrderFormInputWithInfo
            pattern={priceRegex}
            placeholder="Refresh Size"
            value={refreshSize || ""}
            onChange={onRefreshSizeChange}
            tooltipContent="???"
          />
        </div>
      </OrderFormCollapseArea>
    ) : null;
  }
}

export default OrderFormAdvanced;
