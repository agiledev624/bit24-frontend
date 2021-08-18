import React from "react";
import { getTrades, isTradeLoaded } from "@/selectors/trade.selectors";
import { connect } from "react-redux";
import { MarketsList } from "./Markets";
import { requestInitTrades } from "@/actions/trade.actions";
import ResizeSensor from "@/ui-components/ResizeSensor";

interface MarketsContainerState {
  height: number;
}

class MarketsContainer extends React.PureComponent<any, MarketsContainerState> {
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
        <MarketsList
          height={this.state.height}
          hideColumns={this.props.hideColumns}
          isPopup={this.props.isPopup}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(MarketsContainer);
