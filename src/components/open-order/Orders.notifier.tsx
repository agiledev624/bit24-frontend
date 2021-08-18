import React from "react";
import { connect } from "react-redux";
import {
  getUpdatedOrderId,
  getUpdatedOrderMessage,
} from "@/selectors/order.selectors";
import { toast } from "@/ui-components";

interface Props {
  updatedMsg: string;
  updatedId: string;
}
class OrderNotifier extends React.PureComponent<Partial<Props>> {
  componentDidUpdate() {
    const { updatedMsg, updatedId = ":" } = this.props;
    const [orderType] = updatedId.split(":");
    const toastType = orderType === "Rejected" ? "error" : "success";

    // if (toastType === 'error') {
    // 	EventRegister.emit(ON_ORDER_ERROR);
    // }

    toast.open({
      header: `Order ${orderType}`,
      type: toastType,
      message: updatedMsg,
    });
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  updatedId: getUpdatedOrderId(state),
  updatedMsg: getUpdatedOrderMessage(state),
});

export default connect(mapStateToProps)(OrderNotifier);
