import { LastTradePriceType } from "@/constants/order-enums";
import { SelectDropdown } from "@/ui-components";
import React from "react";

interface OrderFormTIFOptionsProps {
  onLastTradePriceTypeChange: (ltp: LastTradePriceType) => void;
  selected: LastTradePriceType | null;
}

const defaultOptions = [
  {
    label: "Mark Price",
    value: LastTradePriceType.MARK_PRICE,
  },
  {
    label: "Last Price",
    value: LastTradePriceType.LAST_PRICE,
  },
];

export class OrderFormLastTradePriceOptions extends React.PureComponent<OrderFormTIFOptionsProps> {
  constructor(props) {
    super(props);
    this.onOptionChange = this.onOptionChange.bind(this);
  }

  onOptionChange({ value }) {
    const { onLastTradePriceTypeChange } = this.props;

    onLastTradePriceTypeChange(value);
  }

  render() {
    const { selected } = this.props;

    return (
      <SelectDropdown
        options={defaultOptions}
        value={selected}
        onChange={this.onOptionChange}
        controlClassName="price-dropdown"
        menuClassName="price-dropdown-menu"
      />
    );
  }
}
