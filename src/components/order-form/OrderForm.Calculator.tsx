import { toggleBooleanSetting } from "@/actions/ui-setting.actions";
import { OrderSide } from "@/constants/order-enums";
import {
  IconButton,
  RadioButton,
  RadioGroup,
  Tabs,
  TabTypes,
} from "@/ui-components";
import React, { useState } from "react";
import { connect } from "react-redux";
import GroupInput from "./OrderForm.group-input";

const tabConfig = [
  {
    title: "Profit/Loss",
    to: "profit",
  },
  {
    title: "Liq.Price",
    to: "liquidation",
  },
];

const ProfitBody = React.memo(() => {
  const [side, setSide] = useState(OrderSide.BUY);

  return (
    <div className="calculator">
      <RadioGroup
        className="choose-side choose-side--border-bottom"
        selectedValue={side}
        onChange={setSide}
      >
        <div className="font-size-11 title">Side</div>
        <RadioButton label="Long" value={OrderSide.BUY} />
        <RadioButton label="Short" value={OrderSide.SELL} />
      </RadioGroup>
      <div className="mb-10">
        <GroupInput
          value={0}
          pattern={""}
          onChange={() => {}}
          addonAfter={"USD"}
          addonBefore={"Quantity"}
        />
      </div>
      <div className="mb-10">
        <GroupInput
          value={0}
          pattern={""}
          onChange={() => {}}
          addonAfter={"USD"}
          addonBefore={"Entry Price"}
        />
      </div>
      <div className="mb-10">
        <GroupInput
          value={0}
          pattern={""}
          onChange={() => {}}
          addonAfter={"USD"}
          addonBefore={"Exit Price"}
        />
      </div>
      <div className="mb-10">
        <GroupInput
          value={0}
          pattern={""}
          onChange={() => {}}
          addonBefore={"Leverage"}
        />
      </div>
      <div className="result">
        <div className="d-flex d-justify-content-space-between d-align-items-center">
          <div className="font-bold">Profit/Loss</div>
          <div className="font-bold">0.0000 BTC</div>
        </div>
        <div className="d-flex d-justify-content-space-between d-align-items-center mt-5">
          <div className="font-bold">Risk/Reward</div>
          <div className="font-bold">0.00x</div>
        </div>
      </div>
    </div>
  );
});

const LiqBody = React.memo(() => {
  const [side, setSide] = useState(OrderSide.BUY);
  const [margin, setMargin] = useState("isolated");

  return (
    <div className="calculator liquid">
      <RadioGroup
        className="choose-side"
        selectedValue={side}
        onChange={setSide}
      >
        <div className="font-size-11 title">Side</div>
        <RadioButton label="Long" value={OrderSide.BUY} />
        <RadioButton label="Short" value={OrderSide.SELL} />
      </RadioGroup>
      <RadioGroup
        className="choose-side choose-side--border-bottom"
        selectedValue={margin}
        onChange={setMargin}
      >
        <div className="font-size-11 title">Margin</div>
        <RadioButton label="Isolated" value="isolated" />
        <RadioButton label="Cross" value="cross" />
      </RadioGroup>

      <div className="mb-10">
        <GroupInput
          value={0}
          pattern={""}
          onChange={() => {}}
          addonAfter={"USD"}
          addonBefore={"Quantity"}
        />
      </div>
      <div className="mb-10">
        <GroupInput
          value={0}
          pattern={""}
          onChange={() => {}}
          addonAfter={"USD"}
          addonBefore={"Entry Price"}
        />
      </div>
      <div className="mb-10">
        <GroupInput
          value={0}
          pattern={""}
          onChange={() => {}}
          addonBefore={"Leverage"}
        />
      </div>
      <div className="result">
        <div className="d-flex d-justify-content-space-between d-align-items-center">
          <div className="font-bold font-size-10">Liquidation Price</div>
          <div className="font-bold font-size-10">0.0000 BTC</div>
        </div>
      </div>
    </div>
  );
});

interface ProfitCalculatorState {
  selected: string;
}
export class CalculatorBody extends React.Component<
  any,
  ProfitCalculatorState
> {
  state = {
    selected: "profit",
  };

  constructor(props) {
    super(props);

    this.onTabChanges = this.onTabChanges.bind(this);
  }

  onTabChanges(tab: string) {
    this.setState({
      selected: tab,
    });
  }

  getBodyByType(type: string) {
    switch (type) {
      case "profit": {
        return <ProfitBody />;
      }
      case "liquidation": {
        return <LiqBody />;
      }
    }
  }

  render() {
    const { selected } = this.state;

    return (
      <div className="calculator__container">
        <div className="calculator-header-tools__container">
          <Tabs
            elements={tabConfig}
            selected={selected}
            onChange={this.onTabChanges}
            tabType={TabTypes.RADIO_BUTTONS}
            containerClassName="border-radius"
          />
        </div>
        {this.getBodyByType(selected)}
      </div>
    );
  }
}

const CalculatorIcon = ({ toggleCalculator }) => {
  return (
    <IconButton cssmodule="fas" id="calculator" onClick={toggleCalculator} />
  );
};

const mapDispatchToProps = (dispatch) => ({
  toggleCalculator() {
    dispatch(
      toggleBooleanSetting({
        key: "open_calculator_overlay",
        persist: false,
      })
    );
  },
});

export const OrderFormCalculator = connect(
  null,
  mapDispatchToProps
)(CalculatorIcon);
