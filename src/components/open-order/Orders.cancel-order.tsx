import React, { useCallback } from "react";
import { ConfirmModal, Tooltip } from "@/ui-components";
import { OrderItem } from "@/models/order.model";
import DisplayConfirmModalBtn from "../DisplayConfirmModalBtn";
interface CancelOrderProps {
  order: OrderItem;
  symbol: string;
  onClick: (order: OrderItem) => void;
  tooltip?: string;
}

// data format: `orderId`
const CancelOrderBtn = ({
  symbol,
  order,
  tooltip = "Cancel order",
  onClick,
}: CancelOrderProps) => {
  const onBtnClick = useCallback(() => {
    onClick(order);
  }, [order, onClick]);

  const popupProps = {
    onAccept: onBtnClick,
    title: "",
    children: () => (
      <p className="text-center">Are you sure you want to cancel that order?</p>
    ),
    initWidth: 270,
  };
  return (
    <Tooltip tooltipContent={tooltip}>
      <DisplayConfirmModalBtn
        popupComp={ConfirmModal}
        popupId="cancel_order_popup"
        popupData={popupProps}
        classes="order__cancel"
      >
        Cancel
      </DisplayConfirmModalBtn>
    </Tooltip>
  );
};

export default React.memo(CancelOrderBtn);
