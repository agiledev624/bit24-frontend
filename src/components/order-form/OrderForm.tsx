import { WalletType } from "@/constants/balance-enums";
import React from "react";
import { OrderFormDerivative } from "./OrderForm.derivative";
import { OrderFormSpot } from "./OrderForm.spot";
import { OrderFormProps } from "./OrderForm.types";

export const OrderForm = (props: OrderFormProps) => {
  let { pair } = props;
  console.log("1=", props);
  switch (props.wallet) {
    case WalletType.EXCHANGE: {
      return <OrderFormSpot {...props} pair={pair} />;
    }
    case WalletType.DERIVATIVE: {
      return <OrderFormDerivative {...props} pair={pair} />;
    }
  }

  return null;
};
