import { OrderSide } from "@/constants/order-enums";
import { ConfirmModal } from "@/ui-components";
import React from "react";
import OrderFormConfirmOverlay from "./OrderForm.confirm-overlay";

const OrderMarginConfirmationPopup = ({
  submit,
  symbol,
  orderType,
  marginType,
  total,
  amount,
  leverage,
  price,
  stopPrice,
  wallet,
  mmr,
  tif,
  side,
  mId,
  closePopup,
}) => {
  const overlayProps = {
    side,
    price,
    amount,
    total,
    marginType,
    leverage,
    mmr,
    tif,
    wallet,
    symbol,
    closeOverlay: closePopup,
    sendOrder: submit,
    label: side === OrderSide.BUY ? "BUY / LONG" : "SELL / SHORT",
    orderType,
  };

  return (
    <ConfirmModal
      mId={mId}
      title="Order Confirmation"
      useLegacyBtns={false}
      initWidth={365}
    >
      {() => <OrderFormConfirmOverlay {...overlayProps} />}
    </ConfirmModal>
  );
};

export default OrderMarginConfirmationPopup;
