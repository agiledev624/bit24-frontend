import { TABLE_PRESCAN_ROWS } from "@/constants/app.constants";
import React from "react";
import { AutoSizer, List } from "react-virtualized";
import ScrollBar from "../ScrollBar";
import { ListProps } from "./List.helpers";

class ListPerfectScrollbar extends React.PureComponent<Partial<ListProps>> {
  static defaultProps = {
    overscanRowCount: TABLE_PRESCAN_ROWS,
  };

  constructor(props) {
    super(props);

    this.handleScrollY = this.handleScrollY.bind(this);
    this.noRowsRenderer = this.noRowsRenderer.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  listRef = React.createRef<any>();
  scrollbarRef = React.createRef<any>();

  handleScrollY(e) {
    this.listRef.current.Grid._onScroll({ target: e });
  }

  componentDidMount() {
    this.listRef.current.Grid._scrollingContainer =
      this.scrollbarRef.current._container;
  }

  render() {
    const { noRowsRenderer, rowHeight, data, overscanRowCount } = this.props;

    const renderEmptyMessage = noRowsRenderer || this.noRowsRenderer;

    return (
      <ScrollBar ref={this.scrollbarRef} onScrollY={this.handleScrollY}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={this.listRef}
              height={height}
              width={width}
              overscanRowCount={overscanRowCount}
              noRowsRenderer={renderEmptyMessage}
              rowCount={data.length}
              data={data}
              rowHeight={rowHeight}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </ScrollBar>
    );
  }

  noRowsRenderer() {
    return (
      <div className="no-data__wrapper">
        <div className="no-data__content">No Data</div>
      </div>
    );
  }

  rowRenderer({ index, isScrolling, key, style }) {
    const { data, renderItem } = this.props;

    const source = data[index % data.length];
    const item = renderItem(source, key);

    return (
      <div key={key} style={style}>
        {item}
      </div>
    );
  }
}

export default ListPerfectScrollbar;
