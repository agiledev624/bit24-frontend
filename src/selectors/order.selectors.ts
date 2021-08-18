import { isStopOrder } from "@/components/order-form/OrderForm.helpers";
import { OrderItem } from "@/models/order.model";
import { createSelector } from "reselect";

const _getOrderState = (state) => state.order;

export const getOrdersObj = createSelector(
  _getOrderState,
  (order) => order.orders
);

export const getOpenOrdersArray = createSelector(getOrdersObj, (orders) =>
  (Object.values(orders) as OrderItem[]).filter(
    (order: OrderItem) => !isStopOrder(order.orderType)
  )
);

const getUpdatedOrder = createSelector(
  _getOrderState,
  (order) => order.updatedOrder
);

export const getUpdatedOrderId = createSelector(
  getUpdatedOrder,
  (updatedOrder) => updatedOrder.id
);

export const getUpdatedOrderMessage = createSelector(
  getUpdatedOrder,
  (updatedOrder) => updatedOrder.message
);

export const getOpenOrdersCount = createSelector(
  getOpenOrdersArray,
  (orders) => orders.length
);

export const getStopOrdersArray = createSelector(getOrdersObj, (orders) =>
  (Object.values(orders) as OrderItem[]).filter((order: OrderItem) =>
    isStopOrder(order.orderType)
  )
);

export const getStopOrdersCount = createSelector(
  getOpenOrdersArray,
  (orders) => orders.length
);
