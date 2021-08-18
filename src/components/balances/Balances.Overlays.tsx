import React from "react";
import BalancesOverlayMain from "./Balances.OverlayMain";

interface BalancesOverlaysProps {
  closeBalOverlay: () => void;
  balances: any;
  ticker: any;
  overlay: string; //wallet
  ccy: string;
  hideBalances: boolean;
}
class BalancesOverlays extends React.PureComponent<
  Partial<BalancesOverlaysProps>
> {
  render() {
    const { closeBalOverlay, balances, ticker, overlay, ccy, hideBalances } =
      this.props;

    return (
      <BalancesOverlayMain
        closeBalOverlay={closeBalOverlay}
        balances={balances}
        ticker={ticker}
        ccy={ccy}
        wallet={overlay}
        hideBalances={hideBalances}
      />
    );
  }
}

export default BalancesOverlays;
