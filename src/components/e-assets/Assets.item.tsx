import React from "react";
import { Icon, Button, NumberFormat, Tooltip } from "@/ui-components";

interface Props {
  hidden?: boolean;
  icon?: React.ReactNode;
  currency: string;
  totalAmount: {
    spot: number;
    derivative: number;
  };
  availableAmount: {
    spot: number;
    derivative: number;
  };
}

const decimalCount = (ccy: string) => {
  const DECIMAL = {
    BTC: 8,
    USDT: 2,
  };
  return DECIMAL[ccy] || 4;
};

export default function AssetsItem({
  hidden,
  icon,
  currency,
  totalAmount,
  availableAmount,
}: Props) {
  return (
    <div className="e-assets__item">
      <div className="e-assets__item__title">
        <div className="e-assets__item__title__col">
          <div>{icon} </div>
          <div className="ml-5">{currency}</div>
        </div>
        <div className="e-assets__item__title__col">
          <span>Spot</span>
        </div>
        <div className="e-assets__item__title__col">Derivative</div>
      </div>

      <div className="e-assets__item__body">
        <div className="e-assets__item__body__row">
          <div className="e-assets__item__body__col">
            <Tooltip
              tooltipContent={
                "Net value of your account (Funds plus or minus running PnL)."
              }
            >
              Equity
            </Tooltip>
          </div>
          <div className="e-assets__item__body__col">
            {hidden ? (
              <div className="text--cool-grey-50">●●●●●●●●●●</div>
            ) : (
              <NumberFormat
                number={totalAmount.spot}
                decimals={decimalCount(currency)}
              />
            )}
          </div>
          <div className="e-assets__item__body__col">
            {hidden ? (
              <div className="text--cool-grey-50">●●●●●●●●●●</div>
            ) : (
              <NumberFormat
                number={totalAmount.derivative}
                decimals={decimalCount(currency)}
              />
            )}
          </div>
        </div>
        <div className="e-assets__item__body__row">
          <div className="e-assets__item__body__col">
            <Tooltip tooltipContent={"Funds available to buy or withdraw."}>
              Available
            </Tooltip>
          </div>
          <div className="e-assets__item__body__col">
            {hidden ? (
              <div className="text--cool-grey-50">●●●●●●●●●●</div>
            ) : (
              <NumberFormat
                number={availableAmount.spot}
                decimals={decimalCount(currency)}
              />
            )}
          </div>
          <div className="e-assets__item__body__col">
            {hidden ? (
              <div className="text--cool-grey-50">●●●●●●●●●●</div>
            ) : (
              <NumberFormat
                number={availableAmount.derivative}
                decimals={decimalCount(currency)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="e-assets__item__bottom">
        <Button classes={"e-assets__button"} onClick={() => {}}>
          <Icon
            cssmodule="fas"
            id="long-arrow-alt-down"
            classes={["text--blue-40"]}
          />{" "}
          Depost
        </Button>
        <Button classes={"e-assets__button"} onClick={() => {}}>
          <Icon
            cssmodule="fas"
            id="long-arrow-alt-up"
            classes={["text--blue-40"]}
          />{" "}
          Withdraw
        </Button>
        <Button classes={"e-assets__button"} onClick={() => {}}>
          <Icon cssmodule="fas" id="exchange-alt" classes={["text--blue-40"]} />{" "}
          Transfer
        </Button>
      </div>
    </div>
  );
}
