import React from "react";
import _get from "lodash/get";
import { EQUIV_CCY, isFiat, toUSD } from "@/exports/balances.utils";
import { NumberFormat } from "@/ui-components";
import { AppTradeType } from "@/constants/trade-type";

interface BalancesOverlayMainTableProps {
  ccy: string;
  balances: any;
  ticker: any;
  wallet: string;
  hideBalances: boolean;
}

interface BalancesOverlayMainTableState {
  rate: number;
  usdEquiv: number;
  usdEquivCalculated: boolean;
}
class BalancesOverlayMainTable extends React.PureComponent<
  Partial<BalancesOverlayMainTableProps>,
  Partial<BalancesOverlayMainTableState>
> {
  static defaultProps = {
    ccy: "",
    balances: {},
    ticker: {},
    wallet: AppTradeType.SPOT,
  };

  state = {
    rate: 0,
    usdEquiv: 0,
    usdEquivCalculated: false,
  };

  componentDidMount() {
    if (this.props.hideBalances) return;

    const { ccy } = this.props;

    if (isFiat(ccy)) {
      // // USDT has rate === 1
      // this.setState({rate: 1});
    } else {
      this.calcEquiv();
    }
  }

  componentDidUpdate() {
    if (!this.props.hideBalances) this.calcEquiv();
  }

  calcEquiv() {
    const { ccy, balances, ticker, wallet } = this.props;

    const { rate, usdEquivCalculated } = this.state;

    if (usdEquivCalculated) return;

    const total = _get(balances, [ccy, wallet, "total"], 0);

    if (!isFiat(ccy)) {
      const equivFunc = toUSD;

      const usdEquiv = equivFunc({
        amount: total,
        from: ccy,
        ticker,
      });

      this.setState({
        usdEquiv,
        usdEquivCalculated: true,
      });
    } else if (rate > 0) {
      const usdEquiv = total * rate;
      this.setState({
        usdEquiv,
        usdEquivCalculated: true,
      });
    }
  }

  render() {
    const { ccy, balances, wallet, hideBalances } = this.props;

    const { usdEquiv, rate } = this.state;

    const total = _get(balances, [ccy, wallet, "total"], 0);
    const available = _get(balances, [ccy, wallet, "available"], 0);
    const decimals = 8;

    //@TODO: i18n
    return (
      <table className="compact highlight">
        <tbody>
          <tr>
            <td className="col-info">Total</td>
            <td className="col-num overlay-total">
              {hideBalances ? (
                "*****"
              ) : (
                <NumberFormat number={total} decimals={decimals} />
              )}
            </td>
            <td className="col-info">
              <span className="show-soft show-smaller overlay-ccy">{ccy}</span>
            </td>
            <td className="col-info overlay-copy-total">
              {/* <Icon id="files-o"/> */}
            </td>
          </tr>
          <tr>
            <td className="col-info">Avail</td>
            <td className="col-num overlay-total">
              {hideBalances ? (
                "*****"
              ) : (
                <NumberFormat number={available} decimals={decimals} />
              )}
            </td>
            <td className="col-info">
              <span className="show-soft show-smaller overlay-ccy">{ccy}</span>
            </td>
            <td className="col-info overlay-copy-total">
              {/* <Icon id="files-o"/> */}
            </td>
          </tr>
          {!isFiat(ccy) || rate > 0 ? (
            <tr className="overlay-equiv-row">
              <td className="border-top col-info">Est. Total</td>
              <td className="border-top col-num overlay-total-equiv">
                {hideBalances ? (
                  "*****"
                ) : (
                  <NumberFormat number={usdEquiv} decimals={decimals} />
                )}
              </td>
              <td className="border-top col-info">
                <span className="show-soft show-smaller">{EQUIV_CCY}</span>
              </td>
              <td className="border-top col-info"></td>
            </tr>
          ) : (
            <tr></tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default BalancesOverlayMainTable;
