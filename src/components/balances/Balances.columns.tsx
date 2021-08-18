import React from "react";
import {
  DEFAULT_TICKER_WIDTH,
  DEFAULT_AMOUNT_WIDTH,
} from "./Balances.constants";
import BalancesCell from "./Balances.Cell";
import { Tooltip } from "@/ui-components";
import { getSvgUrl } from "@/exports/ticker.utils";
import { AppTradeType } from "@/constants/trade-type";

function renderBalanceCell({ dataKey, cellData, rowData }) {
  const { startBalOverlay, inOverlay, ccy } = rowData;

  const wallet = dataKey;

  const cellProps = {
    key: dataKey,
    data: cellData,
    currency: ccy,
    overlayCallback: startBalOverlay,
    inOverlay,
    wallet,
  };

  return <BalancesCell {...cellProps} />;
}

function sortFunction(a, b) {
  return a - b;
}

function onCcyClick({ rowData }) {
  const { ccy, startBalOverlay, inOverlay } = rowData;

  if (!inOverlay) {
    startBalOverlay(ccy, AppTradeType.SPOT);
  }
}

export default [
  {
    dataKey: "ccy",
    title: "Name",
    width: DEFAULT_TICKER_WIDTH,
    headerStyle: {
      textAlign: "left",
      paddingLeft: 5,
    },
    renderCell: function ({ rowData }) {
      const { ccy, name } = rowData;

      return (
        <div className="cpn-virtualized-table__cellwrapper text-left clickable">
          <Tooltip tooltipContent={`${ccy} (${name})`}>
            <div
              className="balances__symbolcell cursor-help-tooltip"
              onClick={() => onCcyClick({ rowData })}
            >
              <div className="balances__icon">
                <div className="balances__icon_wrapper">
                  <img src={getSvgUrl(ccy)} alt={ccy} />
                </div>
              </div>
              <span className="font-medium">{ccy}</span>
            </div>
          </Tooltip>
        </div>
      );
    },
  },
  {
    dataKey: "spot",
    title: "Spot",
    altUnderline: true,
    altCursorPointer: true,
    sortFunction: sortFunction,
    width: DEFAULT_AMOUNT_WIDTH,
    flexGrow: 1,
    headerStyle: {
      textAlign: "right",
      padding: "0px",
    },
    renderCell: renderBalanceCell,
  },
  {
    dataKey: "derivative",
    title: "Derivative",
    altUnderline: true,
    altCursorPointer: true,
    sortFunction: sortFunction,
    width: DEFAULT_AMOUNT_WIDTH,
    flexGrow: 1,
    renderCell: renderBalanceCell,
    headerStyle: {
      textAlign: "right",
      padding: "0px",
    },
  },
];
