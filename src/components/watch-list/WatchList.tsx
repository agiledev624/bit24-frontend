import { navigate } from "@/actions/app.actions";
import { RoutePaths } from "@/constants/route-paths";
import { AppTradeType } from "@/constants/trade-type";
import { lastInPair } from "@/exports/ticker.utils";
import { TickerModel } from "@/models/ticker.model";
import { getTickerObj, TickerObject } from "@/selectors/ticker.selectors";
import { Icon, RadioButton, RadioGroup, Table, Tabs } from "@/ui-components";
import { getSortedData } from "@/ui-components/ui/Table.virtualized/Table.virtualized.helpers";
import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { getWatchListColumns } from "./WatchList.columns";
import {
  getGroupName,
  getLabelForGroup,
  getTabLabelForGroup,
  renderRow,
  symbolMatchesQueryString,
} from "./WatchList.helpers";

interface WatchListProps {
  tickers: TickerObject;
  tradeType: AppTradeType;
  rowHeight: number;
  loading: boolean;
  emptyListMessage: ReactNode;
  navigate: (type: string, symbol: string) => void;
  enableFilter: boolean;
}

interface WatchListState {
  allTickers: TickerModel[];
  tableRows: any[];
  activeColumn: WatchListActiveColumn;
  selectedTab: string;
  tabs: any[];
  queryString: string;
}

enum WatchListActiveColumn {
  VOLUME = 1,
  CHANGE = 2,
}

class WatchList extends React.Component<
  Partial<WatchListProps>,
  WatchListState
> {
  static defaultProps = {
    rowHeight: 20,
    enableFilter: false,
  };

  state = {
    allTickers: [],
    tableRows: [],
    activeColumn: WatchListActiveColumn.CHANGE,
    selectedTab: "",
    queryString: "",
    tabs: [],
  };

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.onGetSortedData = this.onGetSortedData.bind(this);
    this.onActiveColumnChange = this.onActiveColumnChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.changeQueryString = this.changeQueryString.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(rowData) {
    const { ccy } = rowData;
    const { tradeType } = this.props;

    navigate(tradeType, ccy);
  }

  initTickers() {
    const { tickers, tradeType } = this.props;

    const orderKeys = Object.keys(tickers);

    if (orderKeys.length === 0) {
      return this.setState({
        allTickers: [],
        tableRows: [],
      });
    }

    // legacy logic
    let filteredTickers = Object.values(tickers);

    const { finalRows: tableRows, tabs } = this.prepTickers(filteredTickers);

    this.setState({
      allTickers: filteredTickers,
      tableRows,
      tabs: tabs.map((tab) => ({
        title: getTabLabelForGroup(tab),
        to: tab,
      })),
      selectedTab: tabs[0],
    });
  }

  componentDidMount() {
    this.initTickers();
  }

  componentDidUpdate(prevProps: Partial<WatchListProps>) {
    if (this.props.tickers !== prevProps.tickers) {
      this.initTickers();
    }
  }

  prepTickers(tickerArray: TickerModel[]) {
    const groups = {};
    const tabs = [];
    let { selectedTab } = this.state;
    const { enableFilter } = this.props;

    tickerArray.forEach((ticker: TickerModel) => {
      const { symbol } = ticker;

      if (symbol) {
        const counter = lastInPair(symbol);
        const groupName = getGroupName(counter);

        if (enableFilter && !selectedTab) {
          selectedTab = groupName;
        }

        const needData =
          (enableFilter && groupName === selectedTab) || !enableFilter;
        // group by symbol instead of gid
        if (!groups[groupName]) {
          if (needData) {
            groups[groupName] = {
              items: [],
            };
          }
        }

        if (!tabs.includes(groupName)) {
          tabs.push(groupName);
        }

        if (needData) {
          groups[groupName].items.push(ticker);
        }
      }
    });

    // rebuild dataset w/meta rows
    const finalRows = [];
    Object.keys(groups).forEach((groupKey) => {
      const group = groups[groupKey];

      const groupItems = group.items,
        items = groupItems || [];

      if (!enableFilter) {
        const label = getLabelForGroup(groupKey);

        finalRows.push({
          t: "groupLabel",
          groupId: groupKey,
          label,
          ids: items.map(({ id, uuid }) => `${id}#${uuid}`),
        });
      }

      finalRows.push(...items);
    });

    return { finalRows, tabs };
  }

  /**
   * Handle grouped sorting
   */
  onGetSortedData(args) {
    const { allTickers = [], queryString } = this.state;

    const sortedData = getSortedData({ ...args, data: allTickers });
    const finalRows = this.prepTickers(sortedData).finalRows;

    const filteredTableRows = finalRows.filter((row) => {
      return symbolMatchesQueryString(queryString, row.ccy);
    });
    return filteredTableRows;
  }

  renderRow(args) {
    const { rowHeight } = this.props;

    return renderRow({
      ...args,
      rowHeight: rowHeight,
      style: {
        ...args.style,
        paddingRight: 0,
      },
    });
  }

  renderTickerFilter() {
    const { activeColumn } = this.state;

    return (
      <RadioGroup
        selectedValue={activeColumn}
        onChange={this.onActiveColumnChange}
      >
        <RadioButton label="Change" value={WatchListActiveColumn.CHANGE} />
        <RadioButton label="Volume" value={WatchListActiveColumn.VOLUME} />
      </RadioGroup>
    );
  }

  onActiveColumnChange(value: WatchListActiveColumn) {
    this.setState({
      activeColumn: value,
    });
  }

  onTabChange(to: string) {
    this.setState({
      selectedTab: to,
    });
  }

  renderTabs() {
    const { selectedTab, tabs } = this.state;
    return (
      <Tabs
        elements={tabs}
        selected={selectedTab}
        onChange={this.onTabChange}
      />
    );
  }

  onInputChange(event) {
    this.changeQueryString(event.target.value);
  }

  changeQueryString(nextQueryString) {
    this.setState({
      queryString: nextQueryString,
    });
  }

  renderSearch() {
    const { queryString } = this.state;

    return (
      <div className="watchlist__search">
        <div className="watchlist__searchicon">
          <Icon id="search" />
        </div>
        <input
          className="watchlist__searchinput"
          type="text"
          autoComplete="off"
          value={queryString}
          onChange={this.onInputChange}
        />
      </div>
    );
  }

  render() {
    const { tableRows, activeColumn, queryString } = this.state;
    const { rowHeight, loading, emptyListMessage, enableFilter } = this.props;
    const columns = getWatchListColumns({
      showVolume: activeColumn === WatchListActiveColumn.VOLUME,
      displayExtraColumn: enableFilter,
    });
    // Test infinite load
    // Override row renderer for mixed col rows
    var name = "ord";

    const tickerSearch = this.renderSearch();
    const tickerTabs = this.renderTabs();
    const filteredTableRows = tableRows.filter((row) => {
      return symbolMatchesQueryString(queryString, row.ccy);
    });

    return (
      <div className="watchlist-wrapper">
        {enableFilter ? (
          <div className="d-flex d-align-items-flex-end d-justify-content-space-between pl-5 mb-10 watchlist_filter_ctn">
            {tickerTabs}
            {tickerSearch}
          </div>
        ) : null}
        <Table
          name={name}
          columns={columns}
          data={filteredTableRows}
          getSortedData={this.onGetSortedData}
          defaultSortBy="date"
          loading={loading}
          emptyListMessage={emptyListMessage}
          rowHeight={rowHeight}
          headerHeight={20}
          onRowClick={this.onRowClick}
          maxHeight={140}
          defaultFontSize={11}
          renderRow={this.renderRow}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickers: getTickerObj(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigate(type: string, ccy: string) {
    let path;
    switch (type) {
      case AppTradeType.SPOT: {
        path = RoutePaths.EXCHANGE;
        break;
      }
      case AppTradeType.DERIVATIVE: {
        path = RoutePaths.DERIVATIVE;
        break;
      }
    }

    if (path) {
      dispatch(navigate(`${path}/${ccy}`));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WatchList);
