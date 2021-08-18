import React from "react";
import { IconButton, NumberFormat } from "@/ui-components";
import moment from "moment";
import { greenText, redText } from "@/exports";
import { PositionSide } from "@/constants/position-enums";

//@ts-ignore
const N = ({ number, decimals }) => <span>{number}</span>;
const NumberFormat2 = React.memo(N);

const getOrderHistoryColumns = function () {
  return [
    {
      disableSort: true,
      width: 20,
      minWidth: 20,
      maxWidth: 20,
      title: "",
      renderCell: function ({ rowData }) {
        const c = rowData?.side === PositionSide.LONG ? greenText() : redText();

        return (
          <IconButton
            id="circle"
            cssmodule="fas"
            classes={`${c} font-size-9`}
          />
        );
      },
    },
    {
      dataKey: "symbol",
      //@TODO i18n
      title: "Symbol",
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      renderCell: function ({ cellData }) {
        const pair = cellData;

        return <span>{pair}</span>;
      },
    },
    {
      dataKey: "amount",
      //@TODO i18n
      title: "Size",
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ cellData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right">
            <span>{cellData}</span>
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Price",
      width: 100,
      minWidth: 60,
      dataKey: "price",
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function renderCell({ cellData, rowData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right">
            <NumberFormat2 number={cellData} decimals={8} />
            {/* <span>{isMarketOrder(rowData.type) ? 'Market price' : <PrettyValue data={beautifier(cellData)} />}</span> */}
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Filled",
      width: 100,
      minWidth: 60,
      dataKey: "execShares",
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function renderCell({ cellData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right">
            <NumberFormat number={cellData} decimals={8} />
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Stop Price",
      width: 100,
      minWidth: 60,
      dataKey: "stopPrice",
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function renderCell({ cellData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right">
            <NumberFormat number={cellData} decimals={8} />
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Fill Price",
      width: 100,
      minWidth: 60,
      dataKey: "fillPrice",
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function renderCell({ cellData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right">
            <NumberFormat number={cellData} decimals={8} />
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Type",
      dataKey: "type",
      maxWidth: 80,
      width: 80,
      minWidth: 80,
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ rowData, wrap, rowHeight: height }) {
        return (
          <div
            className="cpn-virtualized-table__cellwrapper text-right"
            style={{
              height: !height ? "" : wrap === 1 ? height * 2 : height,
              lineHeight: !height ? "" : `${height}px`,
            }}
          >
            Limit
          </div>
        );
      },
    },
    {
      dataKey: "createdAt",
      title: "Date",
      width: 140,
      minWidth: 105,
      maxWidth: 140,
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      // wrapFunc: function wrapFunc({tableWidth}) {
      //     return tableWidth <= 800;
      // },
      renderCell: function renderCell({ cellData, wrap, rowHeight }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right">
            <span>{moment(cellData).format("DD/MM/YYYY HH:mm:ss")}</span>
          </div>
        );
      },
    },
  ];
};

export default getOrderHistoryColumns;
