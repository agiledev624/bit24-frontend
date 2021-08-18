import { Icon, InputTextInline, Tooltip } from "@/ui-components";
import React from "react";

class OrderFormInputWithInfo extends React.Component<any> {
  render() {
    const { tooltipContent, ...props } = this.props;

    const right = tooltipContent ? (
      <div className="input-info-ctn">
        <Tooltip tooltipContent={tooltipContent}>
          <Icon id="question-circle" cssmodule="fal" />
        </Tooltip>
      </div>
    ) : null;

    return (
      <div className="order-form__input-winfo_ctn">
        <InputTextInline
          type="text"
          useHandlers={false}
          {...props}
          right={right}
        />
      </div>
    );
  }
}

export default OrderFormInputWithInfo;
