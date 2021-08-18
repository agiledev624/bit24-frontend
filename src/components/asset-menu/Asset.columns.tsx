import { greenText, redText } from "@/exports";
import { getPriceDecimals } from "@/exports/ticker.utils";
import { NumberDiff, NumberFormat } from "@/ui-components";
import { Icon } from "@/ui-components/ui/Icon";
import React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import AssetStar from "./Asset.Star";

const classes = ["font-size-10"];
export const assetColumns = [
  {
    disableSort: true,
    width: 15,
    minWidth: 15,
    maxWidth: 15,
    renderHeader: function () {
      return <Icon cssmodule="fas" id="star" classes={classes} />;
    },
    renderCell: function ({ rowData }) {
      return <AssetStar symbol={rowData.ccy} />;
    },
  },
  {
    dataKey: "ccy",
    //@TODO i18n
    title: "Asset",
    minWidth: 55,
    width: 55,
    maxWidth: 55,
    renderCell: function ({ cellData }) {
      const pair = cellData;

      return (
        <div className="cpn-virtualized-table__cellwrapper text-left">
          {pair}
        </div>
      );
    },
  },
  {
    dataKey: "lastPrice",
    //@TODO i18n
    title: "Last Price",
    width: 55,
    headerStyle: {
      textAlign: "right",
    },
    flexGrow: 1,
    renderCell: function ({ rowData }) {
      const { ccy, lastPrice } = rowData;
      const decimals = getPriceDecimals(ccy);

      return (
        <div className="cpn-virtualized-table__cellwrapper text-right">
          <NumberDiff number={lastPrice} decimals={decimals} />
        </div>
      );
    },
  },
  {
    //@TODO i18n
    title: "Change",
    dataKey: "dailyChangePerc",
    width: 40,
    headerStyle: {
      textAlign: "right",
    },
    flexGrow: 1,
    renderCell: function ({ rowData, cellData }) {
      const c = cellData > 0 ? greenText() : redText();
      const changed = cellData > 0 ? `+${cellData}` : `${cellData}`;

      return (
        <div className="cpn-virtualized-table__cellwrapper text-right">
          <span className={c}>{changed}%</span>
        </div>
      );
    },
  },
  {
    //@TODO i18n
    title: "High",
    dataKey: "high",
    width: 55,
    minWidth: 55,
    flexGrow: 1,
    headerStyle: {
      textAlign: "right",
    },
    renderCell: function ({ rowData, wrap, cellData }) {
      const { ccy, high } = rowData;
      const decimals = getPriceDecimals(ccy);

      return (
        <div className="cpn-virtualized-table__cellwrapper text-right">
          <NumberFormat number={high} decimals={decimals} />
        </div>
      );
    },
  },
  {
    //@TODO i18n
    title: "Low",
    dataKey: "low",
    width: 55,
    minWidth: 55,
    flexGrow: 1,
    headerStyle: {
      textAlign: "right",
    },
    renderCell: function ({ rowData }) {
      const { ccy, low } = rowData;
      const decimals = getPriceDecimals(ccy);

      return (
        <div className="cpn-virtualized-table__cellwrapper text-right">
          <NumberFormat number={low} decimals={decimals} />
        </div>
      );
    },
  },
  {
    //@TODO i18n
    title: "Chart",
    dataKey: "chart",
    width: 55,
    minWidth: 55,
    flexGrow: 1,
    headerStyle: {
      textAlign: "center",
    },
    renderCell: function ({ cellData }) {
      return (
        <div className="cpn-virtualized-table__cellwrapper text-center pl-5 pr-5">
          {/* {cellData} */}
          <Sparklines data={[5, 10, 5, 8, 5, 3, 6, 5, 10, 5, 8, 5, 3, 6]}>
            <SparklinesLine
              color="#23d886"
              style={{ fill: "none", strokeWidth: 2 }}
            />
          </Sparklines>
        </div>
      );
    },
  },
  {
    //@TODO i18n
    title: "Volume",
    dataKey: "volume",
    width: 70,
    minWidth: 70,
    flexGrow: 1,
    headerStyle: {
      textAlign: "right",
    },
    renderCell: function ({ cellData }) {
      return (
        <div className="cpn-virtualized-table__cellwrapper text-right">
          <NumberFormat number={cellData} decimals={2} />
        </div>
      );
    },
  },
];
