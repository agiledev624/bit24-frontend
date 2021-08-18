import React from "react";
import classNames from "classnames";

import { MAX_AMOUNT_WITH_DECIMALS } from "./Balances.constants";
import { Dim, NumberFormat } from "@/ui-components";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { connect } from "react-redux";

const Dimable = ({ dim, children }) => (dim ? <Dim>{children}</Dim> : children);

const BalanceAmount = ({
  ccy,
  amount,
  className = "",
  dim = false,
  hideBalances,
}) => {
  let decimals = 2;
  const safeAmount = amount || 0;

  if (safeAmount >= MAX_AMOUNT_WITH_DECIMALS) {
    decimals = 0;
  }

  const classes = {};
  classes[className] = true;

  if (!safeAmount) {
    classes["empty-val"] = true;
  }

  if (!safeAmount) {
    decimals = 0;
  }

  return (
    <div className={classNames(classes)}>
      <span>
        <Dimable dim={dim}>
          {hideBalances ? (
            "*****"
          ) : (
            <NumberFormat number={safeAmount} decimals={decimals} />
          )}
        </Dimable>
      </span>
    </div>
  );
};

const mapStateToProps = (state) => ({
  hideBalances: getSetting(state)("hidden_balance"),
});
export default connect(mapStateToProps)(BalanceAmount);
