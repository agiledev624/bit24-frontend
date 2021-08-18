import React, { MouseEvent } from "react";
import { getExtraWarning } from "./Balances.helpers";
import { Button } from "@/ui-components";

interface Props {
  currency: string;
  confirmFn: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}

export default function BalancesExtraWarning({ currency, confirmFn }: Props) {
  const [line1, line2, line3, buttonText] = getExtraWarning(currency);
  return (
    <div>
      {/* <div
        className="mtb-red-text"
        message={
          <div>
            <p>{line1}</p>
            <p>{line2}</p>
            <p>{line3}</p>
          </div>
        }
        type="info"
      /> */}
      <div style={{ marginTop: "20px" }}>
        <Button
          style={{ width: "100%" }}
          classes="radius"
          color="success"
          onClick={confirmFn}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

BalancesExtraWarning.propTypes = {};
