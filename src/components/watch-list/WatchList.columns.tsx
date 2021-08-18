import { greenText, redText } from "@/exports";
import { sliceTo } from "@/exports/format-number";
import { getPriceDecimals } from "@/exports/ticker.utils";
import { NumberFormat } from "@/ui-components";
import React from "react";
import AssetStar from "../asset-menu/Asset.Star";
import { LastTick } from "../LastTick";

export const getWatchListColumns = ({
  showVolume = false,
  displayExtraColumn = false,
}) => {
  let columns = [
    {
      dataKey: "lastPrice",
      disableSort: true,
      width: 10,
      minWidth: 10,
      maxWidth: 10,
      renderCell: function ({ rowData }) {
        const data = rowData.lastPrice;
        return (
          <LastTick symbol={rowData.ccy} price={data} showNumber={false} />
        );
      },
    },
    {
      dataKey: "ccy",
      //@TODO i18n
      title: "Symbol",
      minWidth: 55,
      width: 55,
      flexGrow: 1,
      renderCell: function ({ cellData }) {
        const pair = cellData;

        return (
          <div className="cpn-virtualized-table__cellwrapper text-left font-bold show-soft clickable">
            {pair}
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: showVolume ? "Volume (1D)" : "Change (1D)",
      dataKey: showVolume ? "volume" : "dailyChangePerc",
      width: 73,
      minWidth: 73,
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ rowData, wrap, cellData }) {
        if (showVolume) {
          const { volume } = rowData;

          return (
            <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold clickable">
              <NumberFormat number={volume} decimals={0} />
            </div>
          );
        } else {
          const slicedPercent = sliceTo(cellData, 2);
          const c = cellData > 0 ? greenText() : redText();
          const changed =
            cellData > 0 ? `+${slicedPercent}` : `${slicedPercent}`;

          return (
            <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold clickable">
              <span className={c}>{changed}%</span>
            </div>
          );
        }
      },
    },
    {
      dataKey: "bidPrice",
      //@TODO i18n
      title: "Bid",
      width: 65,
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ rowData }) {
        const { ccy, bidPrice } = rowData;
        const decimals = getPriceDecimals(ccy);

        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold clickable">
            <NumberFormat number={bidPrice} decimals={decimals} />
          </div>
        );
      },
    },
    {
      dataKey: "askPrice",
      //@TODO i18n
      title: "Ask",
      width: 65,
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ rowData }) {
        const { ccy, askPrice } = rowData;
        const decimals = getPriceDecimals(ccy);

        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold clickable">
            <NumberFormat number={askPrice} decimals={decimals} />
          </div>
        );
      },
    },
  ];

  if (displayExtraColumn) {
    return [
      ...columns,
      {
        dataKey: "high",
        //@TODO i18n
        title: "High",
        width: 65,
        flexGrow: 1,
        headerStyle: {
          textAlign: "right",
        },
        renderCell: function ({ rowData }) {
          const { ccy, high } = rowData;
          const decimals = getPriceDecimals(ccy);

          return (
            <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold clickable">
              <NumberFormat number={high} decimals={decimals} />
            </div>
          );
        },
      },
      {
        dataKey: "low",
        //@TODO i18n
        title: "Low",
        width: 65,
        flexGrow: 1,
        headerStyle: {
          textAlign: "right",
        },
        renderCell: function ({ rowData }) {
          const { ccy, low } = rowData;
          const decimals = getPriceDecimals(ccy);

          return (
            <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold clickable">
              <NumberFormat number={low} decimals={decimals} />
            </div>
          );
        },
      },
      {
        width: 25,
        minWidth: 25,
        //@ts-ignore
        maxWidth: 25,
        headerStyle: {
          textAlign: "right",
        },
        // renderHeader: function() {
        //   return <Icon cssmodule="fas" id="star" classes={classes}/>
        // },
        disableSort: true,
        renderCell: function ({ rowData }) {
          return (
            <div className="cpn-virtualized-table__cellwrapper text-center font-semi-bold clickable">
              <AssetStar symbol={rowData.ccy} />
            </div>
          );
        },
      },
    ];
  }

  return columns;
};
