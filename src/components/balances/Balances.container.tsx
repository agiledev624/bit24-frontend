import { updateUISetting } from "@/actions/ui-setting.actions";
import { toUSD } from "@/exports/balances.utils";
import React from "react";
import {
  getBalances,
  getBalancesTotalAllWallets,
} from "@/selectors/balance.selectors";
import { getTickerObj } from "@/selectors/ticker.selectors";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { add } from "lodash";
import { connect } from "react-redux";
import _get from "lodash/get";
import Balances from "./Balances";
import { Collapsible, Tabs } from "@/ui-components";
import { BalanceEyeToggle } from "./Balances.EyeToggle";
import { BALANCES_TABLE_HEIGHT } from "./Balances.constants";
import { EMPTY_OBJ, formatNumber, greenText, redText } from "@/exports";
import { AppTradeType } from "@/constants/trade-type";
import {
  FundingType,
  PositionSide,
  PositionType,
} from "@/constants/position-enums";
import { divide, multiply, subtract } from "@/exports/math";
import { isUserLoggedIn } from "@/selectors/auth.selectors";

const mapStateToProps = (state) => {
  // const showDemoCurrencyOnly = getSettings(state, 'show_demo_ccy');
  // const showSmallBalances = getSettings(state, 'show_small_balances');
  const ticker = getTickerObj(state);

  const p = {
    loading: false,
    currencies: EMPTY_OBJ,
    balances: getBalances(state),
    balancesTotal: getBalancesTotalAllWallets(state),
    hideBalances: getSetting(state)("hidden_balance"),
    ticker,
    balancesOverlay: getSetting(state)("balances_overlay"),
    isLoggedIn: isUserLoggedIn(state),
    mmr: state.user.mmr,
    btcBalance: state.user.accountEquity,
    symbolEquity: state.user.symbolEquity,
    executedLongPosition: state.user.executedLongPosition,
    executedShortPosition: state.user.executedShortPosition,
    executedLongCash: state.user.executedLongCash,
    executedShortCash: state.user.executedShortCash,
    leverage: state.user.leverage,
  };

  if (ticker) {
    return {
      ...p,
      markPrice: _get(ticker, ["BTCUSDT", "markPrice"], 0),
    };
  }

  return p;
};

const mapDispatchToProps = (dispatch) => ({
  startBalOverlay(val = "balances") {
    // startBalOverlay
    dispatch(
      updateUISetting({
        key: "balances_overlay",
        value: val,
        persist: false,
      })
    );
  },
  closeBalOverlay() {
    dispatch(
      updateUISetting({
        key: "balances_overlay",
        value: "",
        persist: false,
      })
    );
  },
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

interface BalanceContainerState {
  selectedTab: string;
}

const Row = ({ title, data }) => (
  <div className="d-flex d-align-items-center d-justify-content-space-between">
    <span className="show-soft">{title}</span>
    <span>{data}</span>
  </div>
);

class BalanceContainer extends React.Component<any, BalanceContainerState> {
  constructor(props) {
    super(props);

    this.onTabChange = this.onTabChange.bind(this);
  }

  state = {
    selectedTab: "asset",
  };

  tabConfig = [
    {
      title: `Assets`,
      to: "asset",
    },
    {
      title: "Margin",
      to: "margin",
    },
  ];

  onTabChange(to: string) {
    this.setState({
      selectedTab: to,
    });
  }

  renderMargin() {
    const {
      markPrice,
      symbolEquity,
      executedLongPosition,
      executedLongCash,
      executedShortCash,
      executedShortPosition,
      mmr,
      btcBalance,
    } = this.props;    
    const style = { height: BALANCES_TABLE_HEIGHT };
    // const btcBalance = _get(balances, ['BTC', walletNameFromId(WalletType.DERIVATIVE), 'available'], 0);

    let positions = [];
    let totalUnrealizedPnl = 0,
      equity = 0,
      maintenanceMargin = 0,
      availableMargin = 0,
      usedMargin = 0,
      leverage = 0;

    if (executedLongPosition !== undefined && markPrice !== undefined) {
      const size = +subtract(executedLongPosition, executedShortPosition) || 0;
      if (size) {
        const side = size > 0 ? PositionSide.LONG : PositionSide.SHORT;
        const entryPrice =
          0 || executedLongPosition > 0
            ? +divide(executedLongCash, executedLongPosition)
            : +divide(executedShortCash, executedShortPosition);

        const positionValue = +multiply(Math.abs(size), entryPrice);
        const unrealizedPnl = +multiply(size, +subtract(markPrice, entryPrice));
        const pnlPercent = +multiply(
          +divide(unrealizedPnl, positionValue),
          100
        );
        const margin = +multiply(mmr, positionValue);

        const liqPrice = +divide(
          +subtract(+multiply(size, entryPrice), symbolEquity),
          +subtract(size, +multiply(Math.abs(size), mmr))
        );

        positions = [
          {
            id: `pos-${Math.random()}`,
            niceSymbol: "btc/usdt",
            symbol: "BTCUSDT",
            side,
            pnl: unrealizedPnl,
            pnlEquiv: 0.5,
            fundingCost: 0.1,
            fundingCostEquiv: 0.2,
            pnlPerc: pnlPercent,
            baseCC: "BTC",
            counterCC: "USDT",
            type: PositionType.MARGIN,
            niceType: "Margin",
            maintenanceMargin: 1,
            fundingType: FundingType.DAILY,
            niceFundingType: "Daily",
            liqPrice: liqPrice <= 0 ? 0 : liqPrice,
            markPrice: markPrice,
            entryPrice: entryPrice,
            amount: size,
            active: true,
            realisedPnl: 0,
            stopPrice: 0,
            limitPrice: 0,
            margin,
            borrowedValue: 1, //side, cost, amount, lastPrice)
            netValue: positionValue,
          },
        ];
      }

      for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        totalUnrealizedPnl = +add(position.pnl, totalUnrealizedPnl);
        maintenanceMargin = +add(position.margin, maintenanceMargin);
        leverage = +add(
          +multiply(Math.abs(size), position.markPrice),
          leverage
        );
      }
      totalUnrealizedPnl = positions.reduce(
        (total, p) => +add(p.pnl, total),
        0
      );
      maintenanceMargin = positions.reduce(
        (total, p) => +add(p.margin, total),
        0
      );
      equity = +add(btcBalance, totalUnrealizedPnl);
      leverage = +divide(leverage, equity);
      availableMargin = +subtract(equity, maintenanceMargin);
      usedMargin = +divide(maintenanceMargin, equity) * 100;
    }

    const c =
      totalUnrealizedPnl > 0
        ? greenText()
        : totalUnrealizedPnl < 0
        ? redText()
        : "";
    return (
      <div className="balances__margin">
        <div className="balances__margin__info">
          <Row
            title="Balance"
            data={`${formatNumber({ number: btcBalance, decimals: 2 })} USDT`}
          />
          <Row
            title="Equity"
            data={`${formatNumber({ number: equity, decimals: 2 })} USDT`}
          />
          <Row
            title="Available Margin"
            data={`${formatNumber({
              number: availableMargin,
              decimals: 2,
            })} USDT`}
          />
          <Row
            title="Maintenance Margin"
            data={`${formatNumber({
              number: maintenanceMargin,
              decimals: 2,
            })} USDT`}
          />
          <Row
            title="Unrealised PNL"
            data={
              <span className={c}>
                {formatNumber({ number: totalUnrealizedPnl, decimals: 2 })} USDT
              </span>
            }
          />
        </div>
        <div className="equiv-wrap right-align">
          <div className="total-equivalent">
            <span>
              {formatNumber({ number: usedMargin, decimals: 2 })}% Margin Used
            </span>
          </div>
          <div>{formatNumber({ number: leverage, decimals: 2 })}x Leverage</div>
        </div>
      </div>
    );
  }

  render() {
    const { selectedTab } = this.state;
    const { tradeType } = this.props;
    let tabConfigs = [...this.tabConfig];
    if (tradeType === AppTradeType.SPOT) {
      tabConfigs = this.tabConfig.filter(({ to }) => to !== "margin");
    }

    return (
      <div className="balances">
        <Collapsible
          title={
            <Tabs
              elements={tabConfigs}
              selected={selectedTab}
              onChange={this.onTabChange}
            />
          }
          toolbar={<BalanceEyeToggle />}
          openedClassName="collapsible__h-100"
        >
          {selectedTab === "asset" ? (
            <Balances {...this.props} />
          ) : (
            this.renderMargin()
          )}
        </Collapsible>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BalanceContainer);
