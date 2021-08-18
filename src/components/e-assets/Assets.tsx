import React, { useState, useMemo } from "react";
import { add } from "lodash";
import { getTickerObj } from "@/selectors/ticker.selectors";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { convertCcy, toUSD } from "@/exports/balances.utils";
import { connect } from "react-redux";
import {
  getBalances,
  getBalancesTotalAllWallets,
} from "@/selectors/balance.selectors";
import { Icon } from "@/ui-components";
import AssetsItem from "./Assets.item";
import AssetsTotal from "./Assets.total";

function Assets({
  tradeType,
  ticker,
  balances,
  balancesTotal,
  getTotalEquivalent,
  totalEquivalentCurrency,
  hidden,
  setHidden,
}) {
  const totalEquiv = getTotalEquivalent(balancesTotal, ticker);
  const total = useMemo(() => {
    if (totalEquivalentCurrency === "BTC") {
      return convertCcy({
        amount: totalEquiv,
        from: "USDT",
        to: "BTC",
        ticker,
      });
    }
    return totalEquiv;
  }, [ticker, totalEquiv, totalEquivalentCurrency]);

  const onChangeShowMode = () => {
    setHidden((prev) => !prev);
  };

  return (
    <div className="e-assets">
      <AssetsItem
        hidden={hidden}
        icon={<Icon cssmodule="fab" id="bitcoin" classes={["font-size-16"]} />}
        currency={"BTC"}
        totalAmount={{ spot: 1232.1212, derivative: 1246.2342 }}
        availableAmount={{ spot: 232.1212, derivative: 246.2343 }}
      />
      <AssetsItem
        hidden={hidden}
        icon={
          <Icon cssmodule="fas" id="usd-circle" classes={["font-size-16"]} />
        }
        currency={"USDT"}
        totalAmount={{ spot: 200200000, derivative: 200200000 }}
        availableAmount={{ spot: 20020000, derivative: 20020000 }}
      />
      <AssetsTotal
        estimateTotal={total}
        hidden={hidden}
        onChangeShowMode={onChangeShowMode}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  const ticker = getTickerObj(state);
  return {
    loading: false,
    ticker,
    balances: getBalances(state),
    totalEquivalentCurrency: getSetting(state)("total_equivalent_currency"),
    balancesTotal: getBalancesTotalAllWallets(state),
  };
};
const mapDispatchToProps = (dispatch) => ({
  getTotalEquivalent(balanceTotals = {}, ticker) {
    return Object.keys(balanceTotals).reduce((total, symbol) => {
      const equivFunc = toUSD;

      const equiv = equivFunc({
        from: symbol,
        ticker,
        amount: balanceTotals[symbol],
      });

      return add(total, equiv);
    }, 0);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Assets);
