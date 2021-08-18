import React, { ReactNode } from "react";
import { wsCollectionSelector } from "@/selectors/ws.selectors";
import {
  WebSocketKindEnum,
  WebSocketKindStateEnum,
} from "@/constants/websocket.enums";
import { WalletType } from "@/constants/balance-enums";
import { requestInstrument } from "@/actions/ticker.actions";
import { isInstrumentLoaded } from "@/selectors/ticker.selectors";
import { connect } from "react-redux";

interface InstrumentProps {
  tradeType: WalletType;
  isSocketReady: boolean;
  isInstrumentLoaded: boolean;
  requestInstrument: (walletType: WalletType) => void;
  children: ReactNode;
}

class InstrumentRequester extends React.Component<Partial<InstrumentProps>> {
  componentDidUpdate(prevProps: InstrumentProps) {
    if (
      this.props.tradeType !== prevProps.tradeType ||
      this.props.isSocketReady !== prevProps.isSocketReady
    ) {
      if (this.props.isSocketReady && !this.props.isInstrumentLoaded) {
        this.props.requestInstrument(this.props.tradeType);
      }
    }
  }

  componentDidMount() {
    if (this.props.isSocketReady && this.props.tradeType) {
      this.props.requestInstrument(this.props.tradeType);
    }
  }

  render() {
    const { isInstrumentLoaded } = this.props;
    console.log(
      "isInstrumentLoaded",
      isInstrumentLoaded,
      this.props.isSocketReady
    );
    return isInstrumentLoaded ? (
      this.props.children
    ) : (
      <p>Loading instrument.....</p>
    );
  }
}

const mapStateToProps = (state) => {
  const socketState = wsCollectionSelector(state)[WebSocketKindEnum.ORDERS];

  return {
    // isSocketReady: socketState === WebSocketKindStateEnum.AUTHORIZED,
    // isInstrumentLoaded: isInstrumentLoaded(state)
    isSocketReady: true,
    isInstrumentLoaded: true,
  };
};

const mapDispatchToProps = (dispatch) => ({
  requestInstrument: function (walletType: WalletType) {
    dispatch(requestInstrument(walletType));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstrumentRequester);
