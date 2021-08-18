import { OrderSide } from "@/constants/order-enums";
import { InputTextInline, Tooltip } from "@/ui-components";
import React from "react";

interface Props {
  options: { label: string; value: number }[];
  onClick: (balance: number, percent: number, side: any) => void;
  balance: number;
  side?: OrderSide;
}

const QuantityButtons = ({
  side,
  balance,
  options,
  onClick,
}: Partial<Props>) => {
  const className = "order-form__quantity__ctn";

  return (
    <div className={className}>
      {options.map(({ label, value }) => (
        <Tooltip key={label} tooltipContent={`Use ${label} balance`}>
          <span
            className="order-form-tag"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClick(balance, value, side);
            }}
          >
            {label}
          </span>
        </Tooltip>
      ))}
      {/* <span>
        <InputTextInline
          max={100}
          onChange={(value) => {
            onClick(balance, +value / 100, side);
          }}
          useHandlers={false}
          type="number"
        />
      </span> */}
    </div>
  );
};

QuantityButtons.defaultProps = {
  options: [
    {
      label: "25%",
      value: 0.25,
    },
    {
      label: "50%",
      value: 0.5,
    },
    {
      label: "75%",
      value: 0.75,
    },
    {
      label: "100%",
      value: 1,
    },
  ],
};

export default React.memo(QuantityButtons);
