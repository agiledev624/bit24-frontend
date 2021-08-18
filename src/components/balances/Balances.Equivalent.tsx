import { convertCcy, EQUIV_CCY } from "@/exports/balances.utils";
import { Icon, NumberFormat, Tooltip } from "@/ui-components";
import React from "react";

const ShowUsdEquivalent = React.memo(
  ({
    getTotalEquivalent,
    totalEquivalentCurrency,
    ticker,
    balancesTotal,
    changeTotalEquivalentCurrency,
    hideBalances,
  }: any) => {
    const totalEquiv = getTotalEquivalent(balancesTotal, ticker);
    const equiv = totalEquiv;
    let total = equiv;

    if (totalEquivalentCurrency === "BTC") {
      total = convertCcy({
        amount: equiv,
        from: "USDT",
        to: "BTC",
        ticker,
      });
    }

    return (
      <div className="d-flex align-items-center d-flex-1">
        {/* <div className="d-flex-1 text-right">
      <span className="equivalent__total pr-5">{hideBalances ? '*****' : <>$<NumberFormat number={0} decimals={2} /></>}</span>
      </div> */}
        <div className="d-flex-1 text-right">
          <span className="equivalent__total pr-5">
            {hideBalances ? (
              "*****"
            ) : (
              <>
                $<NumberFormat number={total} decimals={2} />
              </>
            )}
          </span>
        </div>
      </div>
    );
  }
);

const ShowUsdLoading = () => (
  <h5 className="right">
    <Icon id="spinner" classes={["fa-spin"]} spinning={true} />
  </h5>
);

const Equivalent = ({
  getTotalEquivalent,
  totalEquivalentCurrency,
  ticker,
  balancesTotal,
  changeTotalEquivalentCurrency,
  socketConnected = true,
  hideBalances,
}) => {
  if (socketConnected) {
    return (
      <ShowUsdEquivalent
        getTotalEquivalent={getTotalEquivalent}
        totalEquivalentCurrency={totalEquivalentCurrency}
        ticker={ticker}
        balancesTotal={balancesTotal}
        changeTotalEquivalentCurrency={changeTotalEquivalentCurrency}
        hideBalances={hideBalances}
      />
    );
  }

  return <ShowUsdLoading />;
};

export default Equivalent;
