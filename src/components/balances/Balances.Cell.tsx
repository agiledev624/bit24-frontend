import React from "react";
import classNames from "classnames";

import BalanceAmount from "./Balances.Amount";
import { AppTradeType } from "@/constants/trade-type";

interface BalancesCellProps {
  currency: string;
  overlayCallback: (ccy: string, walletType?: string) => void;
  data: any;
  inOverlay: boolean;
  wallet: AppTradeType;
}

class BalancesCell extends React.PureComponent<
  Partial<BalancesCellProps>,
  { amountClass: any }
> {
  static defaultProps = {
    currency: "",
    overlayCallback: function overlayCallback(ccy, walletType) {
      return null;
    },
    data: {
      available: 0,
      reserved: 0,
      total: 0,
    },
    inOverlay: false,
  };

  state = {
    amountClass: {
      "transfer-selectable": true,
      "cpn-virtualized-table__cellwrapper": true,
      "text-right": true,
      clickable: true,
    },
  };

  constructor(props) {
    super(props);

    this.state.amountClass[this.props.wallet] = true;

    this.amountCallback = this.amountCallback.bind(this);
    this.amountClass = this.amountClass.bind(this);
  }

  componentDidMount() {
    this.amountClass();
  }

  componentDidUpdate() {
    this.amountClass();
  }

  amountClass() {
    const { data: amount = 0, inOverlay } = this.props;
    const { amountClass } = this.state;
    let changed = false;

    if (inOverlay) {
      if (amount <= 0 && !amountClass["empty-val"]) {
        amountClass["empty-val"] = true;
        changed = true;
      } else if (amountClass["empty-val"]) {
        amountClass["empty-val"] = false;
        changed = true;
      }
    }

    if (changed) {
      this.setState({
        amountClass: Object.assign({}, amountClass),
      });
    }
  }

  amountCallback() {
    const {
      data: amount = 0,
      currency,
      overlayCallback,
      inOverlay,
      wallet,
    } = this.props;

    if (!inOverlay) {
      overlayCallback(currency, wallet);
    } else if (amount > 0) {
      overlayCallback(currency, wallet);
    }
  }

  render() {
    const { data, inOverlay, currency } = this.props;
    const { amountClass } = this.state;

    const Wrapper = inOverlay ? "td" : "div";

    const available = data.available || 0;
    const reserved = data.reserved || 0;

    return (
      <Wrapper
        className={classNames(amountClass)}
        onClick={this.amountCallback}
      >
        <BalanceAmount amount={available} ccy={currency} dim={true} />
        <BalanceAmount amount={reserved} ccy={currency} />
      </Wrapper>
    );
  }
}

export default BalancesCell;
