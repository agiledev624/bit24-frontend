import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { AutoSizer, Table } from 'react-virtualized';
import _isFunction from 'lodash/isFunction';
import classNames from 'classnames';

import { sortData, rowNeedsWrap, getNextSort, getHeaderRowRenderer, getHeightForRow, getRowHeightFunc, renderColumns, renderLoadingContent, getSortedData, getTableWidthFunc } from './Table.virtualized.helpers';
import ScrollBar from '../ScrollBar';
import { Dim } from '../Dim';
import { setOrder } from '@/actions/ui-setting.actions';
import { getTableSorting } from '@/selectors/ui-setting.selectors';
import { TABLE_HEADER_HEIGHT, TABLE_PRESCAN_ROWS, TABLE_ROW_HEIGHT } from '@/constants/app.constants';

const SCROLL_TO_BOTTOM_TRIGGER_THRESHOLD = 0;

// wanna know about some Function props details, check it out: https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md
export type VirtualizedTableProps = {
  columns: any[],
  data: any[],
  renderRow?: Function,
  renderHeaderRow?: Function,
  rowHeight?: number,
  headerHeight?: number,
  disableHeader?: boolean,
  maxHeight?: number,
  name?: string,
  defaultOrderBy?: string,
  order?: Object,
  loading?: boolean,
  defaultSortBy?: string,
  defaultSortDirection?: string,
  emptyListMessage?: string,
  onScrollToBottom?: Function,
  onSelectionChange?: Function,
  onMultiSelectEnd?: Function,
  getSortedData?: Function,
  onRowsRendered?: Function,
  selectByKey?: string,
  colPadding?: number,
  enabledHorizontalScroll?: boolean,
  getTableWidthFunc?: Function,
  columnWidths?: any[],
  // ({ data = [], cols = [], rowHeight, width }, fallback)
  // See default helper implementation getRowHeightFunc()
  getRowHeightFunc?: Function,
  // ({ rowData, columns, tableWidth }, fallback)
  rowNeedsWrap?: Function,
  defaultFontSize?: number,
  onRowClick?: Function,
  rowClasses?: string | Function,
  headerClasses?: string,
  sortedDataPostProcessor?: Function,
  sortingPersistingEnabled?: boolean,
  persistSortingFunction?: Function,
  rowHoverEffect?: boolean,
  onSort?: Function,
  // use "undefinedOrderSortingFunction" when you need to define some special sorting rules for
  // a situation when "sortBy" and "sortOrder" are undefined e.g. TickerList sort
  // should be a pretty rare case when it's necessary
  undefinedOrderSortingFunction?: Function,
  message?: string,
  overscanRowCount?: number;
};

interface VirtualizedTableState {
  data?: any[],
  selectedKeys?: Object,
  selectByKey?: string;
  seedData?: any,
  // props data, @see getDerivedStateFromProps()
  sortBy?: string,
  sortDirection?: string,
  lastAutoWidth?: number,
  lastAutoHeight?: number,
  multiSelectActive?: boolean,
  multiSelectStart?: number;
  multiSelectEnd?: number;
  scrollTop?: number;
}
class VirtualizedTable extends React.PureComponent<VirtualizedTableProps, VirtualizedTableState> {
  static defaultProps = {
    columns: [],
    data: [],
    disableHeader: false,
    rowHeight: TABLE_ROW_HEIGHT,
    overscanRowCount: TABLE_PRESCAN_ROWS,
    headerHeight: TABLE_HEADER_HEIGHT,
    maxHeight: 300,
    colPadding: 5,
    name: '',
    defaultOrderBy: '-',
    order: {},
    loading: false,
    defaultSortBy: null,
    defaultSortDirection: null,
    emptyListMessage: 'No Data',
    onScrollToBottom: function onScrollToBottom() { },
    onSelectionChange: function onSelectionChange() { },
    onMultiSelectEnd: function onMultiSelectEnd() { },
    enabledHorizontalScroll: false,
    selectByKey: '',
    getSortedData: getSortedData,
    // note useful default
    defaultFontSize: 13,
    onRowClick: function onRowClick() { },
    rowClasses: '',
    sortedDataPostProcessor: function sortedDataPostProcessor() { },
    columnWidths: null,
    sortingPersistingEnabled: true,
    persistSortingFunction: function persistSortingFunction() { },
    rowHoverEffect: true,
    onSort: function onSort() { }
  };

  tableRef = React.createRef();
  scrollbarRef: RefObject<any> = React.createRef();
  isScrollbarMounted = false;
  autoDimentionChangeIds;

  state = {
    data: [],
    selectedKeys: {},
    seedData: null,
    // props data, @see getDerivedStateFromProps()
    sortBy: null,
    sortDirection: null,
    lastAutoWidth: null,
    lastAutoHeight: null,
    multiSelectActive: false,
    multiSelectStart: null
  }

  constructor(props) {
    super(props);

    this.onSort = this.onSort.bind(this);
    this.onScrollInternal = this.onScrollInternal.bind(this);
    this.onToggleRowSelection = this.onToggleRowSelection.bind(this);
    this.isRowSelected = this.isRowSelected.bind(this);
    this.onSelectAllRows = this.onSelectAllRows.bind(this);
    this.onSelectNoRows = this.onSelectNoRows.bind(this);
    this.onToggleMultiSelect = this.onToggleMultiSelect.bind(this);
    this.onRowMouseOut = this.onRowMouseOut.bind(this);
    this.onRowMouseOver = this.onRowMouseOver.bind(this);
    this.getBodyRowClassName = this.getBodyRowClassName.bind(this);
    this.renderEmptyListMessage = this.renderEmptyListMessage.bind(this);
    this.handleScrollY = this.handleScrollY.bind(this);

    this.autoDimentionChangeIds = new Set();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const defaultSortBy = nextProps.defaultSortBy,
      defaultSortDirection = nextProps.defaultSortDirection,
      data = nextProps.data;

    const sortingChanged = defaultSortBy !== prevState.sortBy || defaultSortDirection !== prevState.sortDirection;

    if (data === prevState.seedData && !sortingChanged) {
      return null;
    }

    const sortBy = defaultSortBy;
    const sortDirection = defaultSortDirection;

    return {
      seedData: data,
      sortBy,
      sortDirection,
      data: sortData({
        data: nextProps.data,
        sortBy,
        sortDirection,
        columns: nextProps.columns,
        undefinedOrderSortingFunction: nextProps.undefinedOrderSortingFunction
      }, nextProps)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { multiSelectActive, selectedKeys } = this.state;

    if (!multiSelectActive && prevState.multiSelectActive) {
      this.onMultiSelectEnd();
    }

    if (selectedKeys !== prevState.selectedKeys) {
      this.props.onSelectionChange(Object.keys(selectedKeys));
    }

    if (prevProps.loading !== this.props.loading) {
      this.isScrollbarMounted = false
    }

    // hack scrollbar
    if (!this.isScrollbarMounted && this.scrollbarRef.current && this.tableRef.current) {
      this.isScrollbarMounted = true
      // @ts-ignore
      this.tableRef.current.Grid._scrollingContainer = this.scrollbarRef.current._container;
    }
  }

  handleScrollY(e) {
    // @ts-ignore    
    this.tableRef.current && this.tableRef.current.Grid._onScroll({ target: e });
  }

  componentWillUnmount() {
    let _iteratorNormalCompletion = true;
    let _didIteratorError = false;
    let _iteratorError = undefined;

    try {
      for (var _iterator = this.autoDimentionChangeIds[Symbol.iterator](), _step;
        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
        _iteratorNormalCompletion = true) {
        var timeoutId = _step.value;
        clearTimeout(timeoutId);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  onRowMouseOut() { }

  onRowMouseOver({ index }) {
    const { multiSelectActive, multiSelectStart } = this.state;

    if (!multiSelectActive)
      return;

    this.onUpdateMultiSelect({
      start: multiSelectStart,
      end: index
    });
  }

  onUpdateMultiSelect({ start, end }) {
    const { selectByKey } = this.props;

    this.setState(function (state) {
      const data = state.data;

      const selectedKeys = {};
      const min = Math.min(start, end);
      const max = Math.max(start, end);

      for (let i = min; i <= max; i++) {
        const key = selectByKey === '' ? i : data[i][selectByKey];
        selectedKeys[key] = true;
      }

      return { selectedKeys };
    });
  }

  onToggleRowSelection(rowData, rowIndex) {
    const { selectByKey } = this.props;

    const key = selectByKey === '' ? rowIndex : rowData[selectByKey];

    this.setState(function (state) {
      var selectedKeys = { ...state.selectedKeys };

      if (selectedKeys[key]) {
        delete selectedKeys[key];
      } else {
        selectedKeys[key] = true;
      }

      return { selectedKeys };
    });
  }

  onToggleMultiSelect(rowIndex) {
    this.setState(function ({ multiSelectActive }) {
      const nextState: VirtualizedTableState = { multiSelectActive: !multiSelectActive };

      if (nextState.multiSelectActive) {
        nextState.multiSelectStart = rowIndex;
        nextState.multiSelectEnd = null;
      } else {
        nextState.multiSelectEnd = rowIndex;
      }

      return nextState;
    });
  }

  onMultiSelectEnd() {
    const { multiSelectStart, multiSelectEnd } = this.state as VirtualizedTableState;

    const start = Math.min(multiSelectStart, multiSelectEnd);
    const end = Math.max(multiSelectStart, multiSelectEnd);

    this.props.onMultiSelectEnd({
      start,
      end
    });
  }

  isRowSelected(rowData, rowIndex) {
    var selectByKey = this.props.selectByKey;
    var key = selectByKey === '' ? rowIndex : rowData[selectByKey];
    return !!this.state.selectedKeys[key];
  }

  onSelectAllRows() {
    const { selectByKey } = this.state as VirtualizedTableState;

    this.setState(function (state) {
      const data = state.data;

      const selectedKeys = {};

      data.forEach((row, i) => {
        const key = selectByKey === '' ? i : row[selectByKey];
        selectedKeys[key] = true;
      });

      return { selectedKeys };
    });
  }

  onSelectNoRows() {
    this.setState(function () {
      return {
        selectedKeys: {}
      };
    });
  }

  /**
   * Doubles the header row height if a message needs to be displayed.
   * Defaults to the row height if no explicit header height is provided.
   *
   * @return {number} height
   */

  getHeaderHeight() {
    const { message, rowHeight, headerHeight } = this.props;

    return message ? (headerHeight || rowHeight) * 2 : headerHeight || rowHeight;
  }

  /**
   * TODO: Extract
   * Returns the full content height (not rendered), taking wrapped rows (double
   * height) into account if the container width is available
   *
   * @return {number} contentHeight
   */
  computeContentHeight() {
    // TODO: Find source of undefined data
    const { data = [], lastAutoWidth } = this.state;
    const { rowHeight, columns } = this.props;

    if (lastAutoWidth === null) {
      return data.length * rowHeight;
    }

    // @Note that we expose this as a prop; the default handler is passed in as
    // fallback logic (also to the default handler itself, where it is ignored)
    let contentHeight = 0;

    if (!data.length) {
      const { colPadding } = this.props;
      return rowHeight * 3 / 2 + colPadding;
    }
    const wrapFunc = this.props.rowNeedsWrap || rowNeedsWrap;

    data.forEach(function (rowData) {
      const wrap = wrapFunc({
        rowData,
        columns,
        tableWidth: lastAutoWidth
      }, rowNeedsWrap); // <- 2nd rowNeedsWrap arg (fallback)

      // double height for wrapped rows, otherwise -> rowHeight
      contentHeight += wrap ? rowHeight * 2 : rowHeight;
    });

    return contentHeight;
  }

  getTableWrapperHeight() {
    const { maxHeight } = this.props;
    const contentHeight = this.computeContentHeight();
    return Math.min(maxHeight, contentHeight);
  }

  /**
   * Should be called after any dataset manipulation that results in a changed
   * order; otherwise, cached row heights will be used. Wrapped rows are doubled
   * in height.
   */
  deferRecomputeRowHeights() {
    setTimeout(() => {
      //@ts-ignore
      this.tableRef.current && this.tableRef.current.recomputeRowHeights();
    }, 0)
  }

  /**
  * Saves new dimensions on state and recomputes row heights. Does nothing if
  * the dimensions are unchanged.
  *
  * @param {Object} dimensions
  * @param {number} dimensions.width
  * @param {number} dimensions.height
  */
  onAutoDimensionChange({ width, height }) {
    const { lastAutoHeight, lastAutoWidth } = this.state;

    if (width === lastAutoWidth && height === lastAutoHeight) {
      return;
    }

    // this.deferRecomputeRowHeights();

    const timeoutId = setTimeout(() => {
      this.autoDimentionChangeIds.delete(timeoutId);

      this.setState(function () {
        return {
          lastAutoHeight: height,
          lastAutoWidth: width
        };
      });
    }, 0);

    this.autoDimentionChangeIds.add(timeoutId);
  }

  /**
  * Re-generates the sorted dataset from props if the sort parameters have
  * changed. Also defers a row height recompute.
  *
  * @param {Object} params
  */
  onSort({ defaultSortDirection, sortBy }) {
    const {
      sortBy: prevSortBy,
      sortDirection: prevSortDirection
    } = this.state;

    const supportsCustomSort = _isFunction(this.props.undefinedOrderSortingFunction);

    const direction = getNextSort({
      prevSortDirection,
      prevSortBy,
      sortBy,
      defaultSortDirection,
      supportsCustomSort
    });

    if (prevSortBy === sortBy && prevSortDirection === direction) {
      return;
    }

    const {
      sortingPersistingEnabled,
      persistSortingFunction,
      onSort
    } = this.props;

    if (sortingPersistingEnabled) {
      persistSortingFunction(sortBy, direction);
    }

    onSort(sortBy, direction);

    this.deferRecomputeRowHeights();
  }

  renderEmptyListMessage() {
    const { emptyListMessage, rowHeight, colPadding } = this.props;

    const style = {
      lineHeight: `${rowHeight}px`,
      padding: `${colPadding}px 0 0 0`
    };

    return (
      <p className="cpn-virtualized-table__row--full-width" style={style}>
        <Dim>{emptyListMessage}</Dim>
      </p>
    );
  }

  onScrollInternal(message) {
    if (!message) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = message;

    if (clientHeight + scrollTop + SCROLL_TO_BOTTOM_TRIGGER_THRESHOLD >= scrollHeight) {
      this.props.onScrollToBottom();
    }
  }

  getHeaderRowRenderer() {
    const { message, renderHeaderRow, headerClasses } = this.props;
    const fullHeaderHeight = this.getHeaderHeight();

    if (renderHeaderRow) {
      return function (args) {
        return renderHeaderRow(args, fullHeaderHeight);
      }
    }

    return getHeaderRowRenderer(fullHeaderHeight, message, headerClasses);
  }

  onRenderRow(tableWidth, tableHeight, args = {}) {
    const { renderRow, colPadding } = this.props;
    
    return renderRow({
      ...args,
      tableWidth,
      tableHeight,
      colPadding
    });
  }

  getBodyRowClassName({ index }) {
    const { rowClasses, rowHoverEffect } = this.props;
    const row = this.state.data[index];

    const additionalClasses = _isFunction(rowClasses) ? rowClasses(row, index) : rowClasses;

    return classNames('themed-border', additionalClasses, {
      'cpn-virtualized-table-row': index !== -1,
      'active': row && row.isActive,
      'cpn-virtualized-table-row--no-hover-effect': !rowHoverEffect
    });
  }

  renderTableInAutoSizer({ width, height }) {
    this.onAutoDimensionChange({ width, height });
    const fullHeaderHeight = this.getHeaderHeight();

    const { data, sortBy, sortDirection, multiSelectStart, multiSelectActive } = this.state;

    const { columns, rowHeight, disableHeader, name, renderRow, onRowClick, colPadding, columnWidths, enabledHorizontalScroll, onRowsRendered, overscanRowCount } = this.props;

    //refactor
    const rowRendererProp: any = {};

    if (renderRow) {
      rowRendererProp.rowRenderer = this.onRenderRow.bind(this, width, height);
    }

    const rowHeightArgs = {
      data, width, rowHeight, cols: columns
    };

    const rowHeightFunc = this.props.getRowHeightFunc ?
      this.props.getRowHeightFunc(rowHeightArgs, getHeightForRow) :
      getRowHeightFunc(rowHeightArgs);

    const tableWidthFunc = this.props.getTableWidthFunc ? this.props.getTableWidthFunc(width, enabledHorizontalScroll, columns) : getTableWidthFunc(width, enabledHorizontalScroll, columns)

    return (
      <Table
        // autoHeight={false}
        height={height}
        overscanRowCount={overscanRowCount}
        width={tableWidthFunc}
        scrollTop={(this.state as VirtualizedTableState).scrollTop}
        onScroll={this.onScrollInternal}
        disableHeader={disableHeader}
        headerHeight={fullHeaderHeight}
        headerClassName="cpn-virtualized-table-headerRow"
        rowClassName={this.getBodyRowClassName}
        rowHeight={rowHeightFunc}
        rowGetter={function rowGetter({ index }) {
          return data[index];
        }}
        onRowsRendered={onRowsRendered}
        rowCount={data.length}
        onRowMouseOut={this.onRowMouseOut}
        onRowMouseOver={this.onRowMouseOver}
        onRowClick={onRowClick}
        gridStyle={{ outline: 'none', paddingTop: fullHeaderHeight }}
        sort={this.onSort}
        sortBy={sortBy}
        sortDirection={sortDirection}
        ref={this.tableRef}
        headerRowRenderer={this.getHeaderRowRenderer()}
        noRowsRenderer={this.renderEmptyListMessage}
        {...rowRendererProp}
      >
        {renderColumns({
          toggleRowSelection: this.onToggleRowSelection,
          isRowSelected: this.isRowSelected,
          selectAllRows: this.onSelectAllRows,
          selectNoRows: this.onSelectNoRows,
          toggleMultiSelect: this.onToggleMultiSelect,
          multiSelectStart,
          multiSelectActive,
          columns,
          width,
          // height,
          rowHeight,
          name,
          colPadding,
          columnWidths
        })}
      </Table>
    );
  }

  renderTable() {
    const fullHeaderHeight = this.getHeaderHeight();
    // const fullHeight = fullHeaderHeight + this.getTableWrapperHeight();

    return (
      <AutoSizer>
        {({ width, height }) => {
          return this.renderTableInAutoSizer({ width, height: height + fullHeaderHeight });
        }}
      </AutoSizer>
    );
  }

  render() {
    const {
      headerHeight,
      loading,
      data,
      defaultFontSize,
      colPadding
    } = this.props;

    const fullHeaderHeight = this.getHeaderHeight();
    const fullHeight = fullHeaderHeight + this.getTableWrapperHeight();
    const empty = data.length === 0;
    const wrapperClassName = classNames('cpn-virtualized-table__wrapper', `r-font-size-${defaultFontSize}`);    

    return (
      <div
        className={wrapperClassName}
        style={{
          // overflow: empty || loading ? 'visible' : 'hidden',
          height: loading ? 'auto' : empty ? fullHeight + colPadding : fullHeight,
          // marginTop: empty || loading ? `${fullHeaderHeight}px` : 0,
        }}
      >
        <ScrollBar
          onScrollY={this.handleScrollY}
          ref={this.scrollbarRef}
        >
          {loading ? renderLoadingContent({ headerHeight }) : this.renderTable()}
        </ScrollBar>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { defaultSortBy, defaultSortDirection } = getTableSorting(state, props);
  return {
    defaultSortBy,
    defaultSortDirection
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  persistSortingFunction(sortBy, sortDirection) {
    dispatch(setOrder(props.name, sortBy, sortDirection, false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VirtualizedTable);