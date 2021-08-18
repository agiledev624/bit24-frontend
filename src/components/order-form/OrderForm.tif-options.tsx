import { TIF } from "@/constants/order-enums";
import { SelectDropdown } from "@/ui-components";
import React from "react";

interface OrderFormTIFOptionsProps {
  onTIFChange: (tif: TIF) => void;
  selected: TIF | null;
}

const defaultOptions = [
  {
    label: "GTC",
    value: TIF.GTC,
  },
  {
    label: "FOK",
    value: TIF.FOK,
  },
  {
    label: "IOC",
    value: TIF.IOC,
  },
];

export class OrderFormTIFOptions extends React.PureComponent<OrderFormTIFOptionsProps> {
  constructor(props) {
    super(props);
    this.onTIFChange = this.onTIFChange.bind(this);
  }

  onTIFChange({ value }) {
    const { onTIFChange } = this.props;

    onTIFChange(value);
  }

  render() {
    const { selected } = this.props;

    return (
      <SelectDropdown
        options={defaultOptions}
        value={selected}
        onChange={this.onTIFChange}
      />
    );
  }
}
