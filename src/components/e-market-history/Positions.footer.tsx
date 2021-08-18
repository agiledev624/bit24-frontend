import React from "react";
import _get from "lodash/get";

const totalIndex = 1;
const totalPosIndex = 7;
const totalUnrealisedIndex = 8;
const totalRealisedIndex = 9;
function generateFooterCells(
  columns,
  totalPositions,
  totalUnealisedValue,
  totalRealisedValue,
  eye
) {
  const marginRight = 8;

  const generateDiv = (index, style, content) => (
    <div key={`pos-${index}`} style={style}>
      {content}
    </div>
  );

  return columns.map((column, index) => {
    const w = _get(column, "width") || _get(column, "minWidth");
    const paddingRight = _get(column, ["headerStyle", "paddingRight"], 0);
    const flexGrow = _get(column, "flexGrow");
    const style = { marginRight };
    if (flexGrow) {
      style["flex"] = `1 1 ${w}px`;
      style["minWidth"] = w;
    } else {
      style["width"] = w;
    }

    if (index === 0) {
      style["marginLeft"] = marginRight;
    }

    if (paddingRight) {
      style["paddingRight"] = paddingRight + 3;
    }

    style["textAlign"] = "right";

    let content;
    switch (index) {
      case totalIndex: {
        content = <span>Total</span>;
        break;
      }
      case totalPosIndex: {
        content = eye ? "********" : totalPositions;
        break;
      }
      case totalUnrealisedIndex: {
        content = eye ? "********" : totalUnealisedValue;
        break;
      }
      case totalRealisedIndex: {
        content = eye ? "********" : totalRealisedValue;
        break;
      }
    }
    return generateDiv(index, style, content);
  });
}

const T = () => (
  <div className="text-right font-size-12 font-medium">
    <div>$12,187.41</div>
    <div>USD</div>
  </div>
);
export const PositionFooter = ({ columns, eye }) => {
  return (
    <div className="position-footer d-flex">
      {generateFooterCells(columns, <T />, <T />, <T />, eye)}
    </div>
  );
};
