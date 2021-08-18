import React from "react";
import BalancesMain from "./Balances.Main";
import BalancesOverlays from "./Balances.Overlays";

interface BalancesProps {
  loading: boolean;
  balances: any;
  balancesTotal: any;
  ticker: any;
  getTotalEquivalent: () => number;
  startBalOverlay: (wallet: any) => void;
  balancesOverlay: string;
  closeBalOverlay: () => void;
  isLoggedIn: boolean;
  hideBalances: boolean;
}

interface BalancesState {
  noticeComplete: boolean;
  overlayCcy: string;
  needFreshData: number;
  queryString: string;
  cache: any;
}
class Balances extends React.PureComponent<
  Partial<BalancesProps>,
  Partial<BalancesState>
> {
  mounted = false;
  static defaultProps = {
    loading: true,
    balances: {},
    balancesTotal: {},
    ticker: {},
    getTotalEquivalent: function getTotalEquivalent() {
      return 0;
    },
    closeBalOverlay: function closeBalOverlay() {
      return null;
    },
  };

  constructor(props) {
    super(props);

    // this.changeActiveTab = this.changeActiveTab.bind(this);
    this.startBalOverlay = this.startBalOverlay.bind(this);
    // this.showBalanceNotices = this.showBalanceNotices.bind(this);
    this.safeSetState = this.safeSetState.bind(this);

    this.state = {
      noticeComplete: false,
      // BalanceMainTable uses this components state so it can quickly render
      // after overlays
      needFreshData: 0,
      queryString: "",
      cache: {
        data: [],
        columnWidths: [],
        equivCache: {},
        lastRateUpdatedAt: new Date(),
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  safeSetState(data) {
    if (this.mounted) {
      this.setState({ ...data });
    }
  }

  startBalOverlay(ccy, wallet) {
    this.setState({
      overlayCcy: ccy,
    });

    this.props.startBalOverlay(wallet);
  }

  render() {
    const {
      loading,
      balances,
      balancesTotal,
      ticker,
      getTotalEquivalent,
      balancesOverlay,
      closeBalOverlay,
      isLoggedIn,
      hideBalances,
    } = this.props;
    if (!isLoggedIn) return null;

    const { queryString, cache, needFreshData } = this.state;

    const mainProps = {
      loading,
      getTotalEquivalent,
      balances,
      balancesTotal,
      ticker,
      setParentState: this.safeSetState,
      queryString,
      needFreshData,
      startBalOverlay: this.startBalOverlay,
      cache,
      hideBalances,
    };

    const overlayProps = {
      closeBalOverlay,
      balances,
      ticker,
      ccy: this.state.overlayCcy,
      overlay: balancesOverlay,
      hideBalances,
    };

    return (
      <div id="balances_form-trading">
        <div
          className="balances-overview-wrap"
          style={{
            minHeight: balancesOverlay !== "" ? 150 : null,
          }}
        >
          {balancesOverlay !== "" ? (
            <BalancesOverlays {...overlayProps} />
          ) : (
            <BalancesMain {...mainProps} />
          )}
        </div>
      </div>
    );
  }
}

export default Balances;
