import React from "react";
import { ConfirmModal, Tooltip } from "@/ui-components";
import DisplayConfirmModalBtn from "../DisplayConfirmModalBtn";
interface CancelOrderProps {
  onClick: (e: any) => void;
  tooltip?: string;
  message?: string;
}

// data format: `orderId`
const CancelAllOrderBtn = ({
  tooltip = "Cancel All orders",
  message = "Are you sure you want to cancel all order?",
  onClick,
}: CancelOrderProps) => {
  const popupProps = {
    onAccept: onClick,
    title: "",
    children: () => <p className="text-center">{message}</p>,
    initWidth: 270,
  };

  return (
    <Tooltip tooltipContent={tooltip}>
      <DisplayConfirmModalBtn
        popupComp={ConfirmModal}
        popupId="cancel_order_popup"
        popupData={popupProps}
        classes="order__cancel order__cancel--all"
      >
        Cancel All
      </DisplayConfirmModalBtn>
    </Tooltip>
  );
};

export default React.memo(CancelAllOrderBtn);
