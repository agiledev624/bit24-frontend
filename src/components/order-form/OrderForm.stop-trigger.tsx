import { StopTrigger } from "@/constants/order-enums";
import { InputCheckboxInline, Tabs, TabTypes } from "@/ui-components";
import React from "react";

interface OrderFormStopTriggerProps {
  enabledStopTrigger: boolean;
  onToggleStopTrigger: (v, e) => void;
  selectedCloseTrigger: StopTrigger;
  onCloseTriggerOptionChange: (option: string) => void;
}

class OrderFormStopTrigger extends React.PureComponent<OrderFormStopTriggerProps> {
  state = {
    tabs: [
      {
        title: "Last",
        to: `${StopTrigger.LAST_PRICE}`,
      },
      {
        title: "Index",
        to: `${StopTrigger.INDEX}`,
      },
      {
        title: "Mark",
        to: `${StopTrigger.MARK}`,
      },
    ],
  };

  render() {
    const {
      enabledStopTrigger,
      onToggleStopTrigger,
      selectedCloseTrigger,
      onCloseTriggerOptionChange,
    } = this.props;

    return (
      <div className="order-form__close-trigger-ctn">
        <InputCheckboxInline
          checked={enabledStopTrigger}
          onChange={onToggleStopTrigger}
          label="Close on Trigger"
        />
        <Tabs
          disabled={!enabledStopTrigger}
          elements={this.state.tabs}
          selected={`${selectedCloseTrigger}`}
          onChange={onCloseTriggerOptionChange}
          tabType={TabTypes.RADIO_BUTTONS}
          containerClassName="border-radius"
        />
      </div>
    );
  }
}

export default OrderFormStopTrigger;
