import React, { PureComponent, RefObject } from "react";
import classNames from "classnames";
import _pick from "lodash/pick";

import { renderLoadingContent, renderListContent } from "./List.helpers";
import {
  TABLE_HEADER_HEIGHT,
  TABLE_PRESCAN_ROWS,
  TABLE_ROW_HEIGHT,
} from "@/constants/app.constants";

interface ListProps {
  ref?: RefObject<any>;
  data: any[];
  renderItem: (data: any, index: number) => JSX.Element;
  height?: number;
  loading?: boolean;
  className?: string;
  rowHeight: number;
  noRowsRenderer: () => JSX.Element;
  overscanRowCount: number;
}

/**
 * .virtal-list__container must be inside a dimensioned container (height: value or height: 100%)
 */
class List extends PureComponent<Partial<ListProps>> {
  static defaultProps = {
    rowHeight: TABLE_ROW_HEIGHT,
    overscanRowCount: TABLE_PRESCAN_ROWS,
    noRowsRenderer: () => null,
    data: [],
  };

  renderList() {
    const params = _pick(this.props, [
      "data",
      "rowHeight",
      "noRowsRenderer",
      "overscanRowCount",
      "renderItem",
    ]);

    return renderListContent(params);
  }

  render() {
    const { loading, className } = this.props;
    const headerHeight = TABLE_HEADER_HEIGHT;

    const listContainerClass = classNames("virtual-list__container", className);
    return (
      <div className={listContainerClass}>
        {loading
          ? renderLoadingContent({ marginTop: headerHeight })
          : this.renderList()}
      </div>
    );
  }
}

export default List;
