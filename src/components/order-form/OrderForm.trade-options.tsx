import { OrderType, TradeOption } from "@/constants/order-enums";
import CheckboxGroup from "@/ui-components/ui/Checkbox/Checkbox.group";
import React from "react";

interface OrderFormTradeOptionsProps {
  orderType: OrderType;
  onTradeOptionChange: (options: TradeOption[]) => void;
  selectedOptions: TradeOption[];
}

export class OrderFormTradeOptions extends React.PureComponent<OrderFormTradeOptionsProps> {
  constructor(props) {
    super(props);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.renderCheckboxes = this.renderCheckboxes.bind(this);
  }

  onCheckboxChange(values: TradeOption[]) {
    const { onTradeOptionChange } = this.props;

    onTradeOptionChange(values);
  }

  renderCheckboxes(Checkbox) {
    const { orderType } = this.props;
    return (
      <>
        {orderType !== OrderType.SNIPER_LIMIT &&
        orderType !== OrderType.SNIPER_MKT ? (
          <Checkbox value={TradeOption.POO} label="Post" />
        ) : null}
        <Checkbox value={TradeOption.RED} label="Reduce" />
      </>
    );
  }
  render() {
    const { selectedOptions } = this.props;

    return (
      <CheckboxGroup
        name="tradeOptions"
        value={selectedOptions}
        onChange={this.onCheckboxChange}
      >
        {this.renderCheckboxes}
      </CheckboxGroup>
    );
  }
}
