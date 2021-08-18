import { cancelOrder } from "@/actions/order.actions";
import { OrderItem } from "@/models/order.model";

export const mapDispatchToProps = (dispatch) => ({
  cancelOrder: function (order: OrderItem) {
    dispatch(
      cancelOrder({
        clientOrderId: Date.now(),
        order,
      })
    );
  },
  cancelAllOrders: function (orders: OrderItem[]) {
    console.log("cancel all orders", orders);
    // orders.forEach((order: OrderItem) => {
    //   dispatch(cancelOrder({
    //     clientOrderId: Date.now(),
    //     order
    //   }));
    // })
  },
});
