import React from "react";
import { Icon } from "../Icon";
import Tooltip from "../Tooltip";

interface Format {
  id: string;
  alt: string;
  altUnderline: boolean;
  altCursorPointer: boolean;
  title: string;
  sortingEnabled: boolean;
}
interface TitleProps {
  format: Format;
  orderBy: any;
  sortOrder: any;
}

class Title extends React.PureComponent<TitleProps> {
  render() {
    const { format, orderBy, sortOrder } = this.props;
    const {
      id,
      alt,
      altUnderline,
      altCursorPointer,
      title = "",
      sortingEnabled = false,
    } = format;

    if (title === "") return null;

    const arrows = sortingEnabled ? (
      <span className="table__title-iconwrapper">
        <Icon id="sort-down" active={id === orderBy && sortOrder === "desc"} />
        <Icon id="sort-up" active={id === orderBy && sortOrder === "asc"} />
      </span>
    ) : null;

    return (
      <span className="">
        <Tooltip
          tooltipContent={alt}
          underline={altUnderline}
          cursorPointer={altCursorPointer}
        >
          {title}
        </Tooltip>
        {arrows}
      </span>
    );
  }
}

export default Title;
