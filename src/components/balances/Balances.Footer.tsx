import React from "react";
import { connect } from "react-redux";
import Equivalent from "./Balances.Equivalent";
import { EQUIV_CCY } from "@/exports/balances.utils";
import { Tooltip } from "@/ui-components";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { updateUISetting } from "@/actions/ui-setting.actions";

interface BalancesFooterProps {
  totalEquivalentCurrency?: string;
  setSettingsTotalEquivalent?: (ccy: string) => void;
  getTotalEquivalent: () => number | null;
  balancesTotal: any;
  ticker: any;
  socketConnected: boolean;
  hideBalances: boolean;
}
class BalancesFooter extends React.PureComponent<Partial<BalancesFooterProps>> {
  static defaultProps = {
    getTotalEquivalent: function () {
      return null;
    },
    balancesTotal: {},
    ticker: {},
    socketConnected: false,
  };
  constructor(props) {
    super(props);

    this.changeTotalEquivalentCurrency =
      this.changeTotalEquivalentCurrency.bind(this);
  }

  changeTotalEquivalentCurrency() {
    const { totalEquivalentCurrency, setSettingsTotalEquivalent } = this.props;

    let nextCurrency =
      totalEquivalentCurrency === EQUIV_CCY ? "BTC" : EQUIV_CCY;

    setSettingsTotalEquivalent(nextCurrency);
  }

  render() {
    const {
      getTotalEquivalent,
      balancesTotal,
      ticker,
      totalEquivalentCurrency,
      hideBalances,
    } = this.props;
    console.log(totalEquivalentCurrency, 'totalEquivalentCurrency')
    return (
      <div className="equiv-wrap right-align">
        <div className="total-equivalent">
          <span>Est. Total</span>
        </div>
        <Equivalent
          socketConnected={true}
          getTotalEquivalent={getTotalEquivalent}
          ticker={ticker}
          totalEquivalentCurrency={totalEquivalentCurrency}
          balancesTotal={balancesTotal}
          changeTotalEquivalentCurrency={this.changeTotalEquivalentCurrency}
          hideBalances={hideBalances}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  totalEquivalentCurrency: getSetting(state)("total_equivalent_currency"),
});

const mapDispatchToProps = (dispatch) => ({
  setSettingsTotalEquivalent(currency) {
    dispatch(
      updateUISetting({
        key: "total_equivalent_currency",
        value: currency,
        persist: false,
      })
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BalancesFooter);
