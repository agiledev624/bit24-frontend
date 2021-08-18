import { firstInPair, lastInPair } from "@/exports/ticker.utils";
import React from "react";

export function renderRow({
  className,
  style,
  columns,
  rowData,
  rowHeight,
  tableWidth,
  colPadding,
  key,
}) {
  const { t = "" } = rowData;
  return (
    <div className={className} role="row" style={style} key={key}>
      {t !== "groupLabel"
        ? renderWatchListRow({
            columns: columns,
            rowHeight: rowHeight,
            tableWidth: tableWidth,
          })
        : renderGroupLabelRow({
            colPadding,
            rowData: rowData,
          })}
    </div>
  );
}

function renderWatchListRow({ columns = [], rowHeight, tableWidth }) {
  return columns;
}

function renderGroupLabelRow({ colPadding, rowData }) {
  return (
    <div className={`pl-${colPadding}`}>
      <span className="text--gray-100 font-bold font-size-10">
        {rowData.label}
      </span>
    </div>
  );
}

export function getTabLabelForGroup(groupKey) {
  return `${groupKey} Margined`;
}

export function getLabelForGroup(groupKey) {
  switch (groupKey) {
    case "USDT": {
      return `${groupKey} Margined - USDT Perpetual`;
    }
    default: {
      return `${groupKey} Margined - Inverse Perpetual`;
    }
  }
}

export function getGroupName(counter: string): string {
  switch (counter) {
    case "USDT": {
      return counter;
    }
    default: {
      return "Coin";
    }
  }
}

export function symbolMatchesQueryString(queryString, symbol) {
  if (!queryString || !symbol) {
    return true;
  }

  var ccyCode = firstInPair(symbol, true);
  var ccyCounter = lastInPair(symbol, true);
  var queryStringUp = queryString.toUpperCase();
  return ccyCode.includes(queryStringUp) || ccyCounter.includes(queryStringUp);
}
