import React from "react";
import _isEmpty from "lodash/isEmpty";
import { tableData, calculateWidths } from "./Balances.helpers";
import {
  MIN_TICKER_WIDTH,
  BALANCES_TABLE_FONT_SIZE,
  BALANCES_TABLE_HEADER_HEIGHT,
  BALANCES_TABLE_HEIGHT,
  BALANCES_TABLE_TOTAL_ROW_HEIGHT,
  BALANCES_TABLE_COMBINED_ROW_HEIGHT,
} from "./Balances.constants";
import BalancesColumns from "./Balances.columns";
import BalancesFooter from "./Balances.Footer";
import { Dim, Icon, Table } from "@/ui-components";
import { getSortedData } from "@/ui-components/ui/Table.virtualized/Table.virtualized.helpers";
import { getRowClasses } from "@/exports/balances.utils";

interface BalancesMainProps {
  loading: boolean;
  getTotalEquivalent: () => number;
  balances: any;
  balancesTotal: any;
  startBalOverlay: (ccy: string, wallet: string) => void;
  inOverlay: boolean;
  ticker: any;
  setParentState: (state: object) => void;
  needFreshData: number;
  hideBalances: boolean;
}
class BalancesMain extends React.PureComponent<Partial<BalancesMainProps>> {
  static defaultProps = {
    loading: true,
    getTotalEquivalent: function () {
      return 0;
    },
    balances: {},
    balancesTotal: {},
    socketConnected: false,
    startBalOverlay: function (ccy, wallet) {
      return 0;
    },
    useMarketEquivalent: false,
    inOverlay: false,
    ticker: {},
    setParentState: function () {
      return null;
    },
    needFreshData: 0,
    toggleDemoSetting: function () {
      return null;
    },
  };

  private cache: any;
  constructor(props) {
    super(props);

    // save cache so we can quickly render again after overlays
    this.cache = { ...props.cache };

    this.isLoading = this.isLoading.bind(this);
    this.changeQueryString = this.changeQueryString.bind(this);
    this.sortData = this.sortData.bind(this);
  }

  // save cache so we can quickly render again after overlays
  componentWillUnmount() {
    const { setParentState } = this.props;

    setParentState({
      cache: this.cache,
    });
  }

  isLoading() {
    const { balances, loading } = this.props;
    const data = this.cache.data;

    // || data.length === 0
    if (loading || _isEmpty(balances)) {
      return true;
    }

    return false;
  }

  renderLoading() {
    return (
      <div className="virtal-list__container__loadingwrapper">
        <Dim>
          <Icon id="circle-o-notch" spinning={true} />
          &nbsp; Loading items....
        </Dim>
      </div>
    );
  }

  changeQueryString(event) {
    const { setParentState } = this.props;

    setParentState({ queryString: event.target.value });
  }

  postProcessTickerRows(data) {
    return data;
  }

  // we need to process updates in the same order, so save it
  // @see Table.virtualized -> getSortedData
  sortData(args) {
    const { sortBy, sortDirection, data } = args;
    const { setParentState, needFreshData } = this.props;
    const { needSort } = this.cache;

    let sortedData = data;

    if (needSort) {
      this.cache.needSort = false;
      sortedData = getSortedData(args);
      this.cache.data = sortedData;
    } else if (
      sortBy !== this.cache.sortBy ||
      sortDirection !== this.cache.sortDirection
    ) {
      this.cache.sortBy = sortBy;
      // we need to refresh data, but rendering it here will cause async issues, so trigger a double render, then sort after
      this.cache.sortDirection = sortDirection;

      this.cache.needSort = true;
      setParentState({
        needFreshData: needFreshData + 1,
      });
    }

    return sortedData;
  }

  render() {
    const {
      getTotalEquivalent,
      balancesTotal,
      balances,
      ticker,
      needFreshData,
      inOverlay,
      startBalOverlay,
      hideBalances,
    } = this.props;

    const loading = this.isLoading();
    const equivCache = this.cache.equivCache;
    let { data, columnWidths } = this.cache;

    if (!loading) {
      const { data: newData } = tableData({
        balances,
        inOverlay,
        queryString: "",
        startBalOverlay,
        ticker,
        equivCache,
        needFreshData,
        cache: this.cache,
        isSmall: false,
      });

      columnWidths = calculateWidths();
      data = newData;
      this.cache.data = newData;
      this.cache.columnWidths = columnWidths;
    }

    const rowHeight =
      columnWidths[0] === MIN_TICKER_WIDTH
        ? BALANCES_TABLE_TOTAL_ROW_HEIGHT
        : BALANCES_TABLE_COMBINED_ROW_HEIGHT;    
    return (
      <React.Fragment>
        {loading ? (
          this.renderLoading()
        ) : (
          <Table
            name="balancesTable"
            data={data}
            columns={BalancesColumns}
            loading={loading}
            defaultSortBy="total"
            defaultSortDirection="DESC"
            defaultFontSize={BALANCES_TABLE_FONT_SIZE}
            rowHeight={rowHeight}
            headerHeight={BALANCES_TABLE_HEADER_HEIGHT}
            maxHeight={BALANCES_TABLE_HEIGHT}
            rowClasses={getRowClasses}
            sortedDataPostProcessor={this.postProcessTickerRows}
            columnWidths={columnWidths}
            getSortedData={this.sortData}
          />
        )}
        <BalancesFooter
          getTotalEquivalent={getTotalEquivalent}
          socketConnected={true}
          balancesTotal={balancesTotal}
          ticker={ticker}
          hideBalances={hideBalances}
        />
      </React.Fragment>
    );
  }
}

export default BalancesMain;
