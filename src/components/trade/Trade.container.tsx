import React from "react";
import { getTrades, isTradeLoaded } from "@/selectors/trade.selectors";
import { connect } from "react-redux";
import { TradeList } from "./Trade";
import { requestInitTrades } from "@/actions/trade.actions";
import ResizeSensor from "@/ui-components/ResizeSensor";

interface TradeContainerState {
  height: number;
}

class TradeContainer extends React.PureComponent<any, TradeContainerState> {
  state = {
    height: 0,
  };

  onResize = (dimension) => {
    const { height } = dimension;

    this.setState({
      height,
    });
  };

  render() {
    return (
      <ResizeSensor onResize={this.onResize}>
        <TradeList {...this.props} height={this.state.height} />
      </ResizeSensor>
    );
  }
}

const mapStateToProps = (state) => ({
  data: getTrades(state),
  loading: !isTradeLoaded(state),
});

const mapDispatchToProps = (dispatch) => ({
  initTrades: function (symbol) {
    dispatch(requestInitTrades(symbol));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TradeContainer);
