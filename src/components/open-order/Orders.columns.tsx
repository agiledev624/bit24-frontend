import React from "react";
import { Icon, IconButton, NumberFormat } from "@/ui-components";
import moment from "moment";
import { greenText, insertsAt, redText } from "@/exports";
import CancelOrderBtn from "./Orders.cancel-order";
import CancelAllOrderBtn from "./Orders.cancel-all";
import { LastTradePriceType, OrderSide } from "@/constants/order-enums";
import { getLabelOrderType } from "@/exports/order.utils";
import DisplayConfirmModalBtn from "../DisplayConfirmModalBtn";
import EditOrderBtn from "./Orders.edit.modal";
import PoisitonTpSlModal from "../positions/Poisiton.tp-sl.modal";

export enum OrderKind {
  OPEN = 1,
  STOP,
}

/**
 *  {
    //@TODO i18n
    title: 'Trigger Cond.',
    width: 100,
    minWidth: 60,
    dataKey: 'stopPrice',
    flexGrow: 1,
    headerStyle: {
      textAlign: 'right'
    },
    renderCell: function renderCell({ rowData }) {
      return <div
        className="cpn-virtualized-table__cellwrapper text-right font-semi-bold"
      >
        {rowData.diplayStopPrice}
      </div>
    }
  }, {
    //@TODO i18n
    title: 'Order ID',
    dataKey: 'clientOrderId',
    maxWidth: 80,
    width: 80,
    minWidth: 80,
    headerStyle: {
      textAlign: 'right'
    },
    renderCell: function ({ rowData }) {
      return (
        <div
          className="cpn-virtualized-table__cellwrapper text-right font-semi-bold"
        >
          {rowData.clientOrderId}
        </div>
      )
    }
  },
  
 */
const getOrderColumns = function ({
  cancelOrder,
  tradeType,
  orderKind,
  cancelAllOrders,
}) {
  const baseColumns = [
    {
      disableSort: true,
      width: 20,
      minWidth: 20,
      maxWidth: 20,
      title: "",
      renderCell: function ({ rowData }) {
        const c = rowData.side === OrderSide.BUY ? greenText() : redText();

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
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      renderCell: function ({ cellData }) {
        const pair = cellData;

        return <span className="font-semi-bold">{pair || "BTC"}</span>;
      },
    },
    {
      //@TODO i18n
      title: "Type",
      dataKey: "orderType",
      maxWidth: 65,
      width: 65,
      minWidth: 65,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ rowData, wrap, rowHeight: height }) {
        return (
          <div
            className="cpn-virtualized-table__cellwrapper text-right font-semi-bold"
            style={{
              height: !height ? "" : wrap === 1 ? height * 2 : height,
              lineHeight: !height ? "" : `${height}px`,
            }}
          >
            {getLabelOrderType(rowData.orderType)}
          </div>
        );
      },
    },
    {
      dataKey: "qty",
      //@TODO i18n
      title: "Size",
      flexGrow: 1,
      width: 80,
      minWidth: 80,
      headerStyle: {
        textAlign: "right",
        paddingRight: 10,
      },
      renderCell: function ({ cellData, rowData }) {
        const props = {
          popupId: "edit_order_size_popup",
          order: rowData,
          symbol: rowData.symbol,
          cellType: "qty",
          tradeType,
        };
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            <DisplayConfirmModalBtn
              popupId="edit_order_size_popup"
              popupComp={EditOrderBtn}
              popupData={props}
            >
              <NumberFormat
                classes={greenText()}
                number={cellData}
                decimals={8}
              />
            </DisplayConfirmModalBtn>
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Order Price",
      width: 80,
      minWidth: 80,
      dataKey: "price",
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
        paddingRight: 10,
      },
      renderCell: function renderCell({ cellData, rowData }) {
        const props = {
          popupId: "edit_order_price_popup",
          order: rowData,
          symbol: rowData.symbol,
          cellType: "price",
          tradeType,
        };
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            <DisplayConfirmModalBtn
              popupId="edit_order_price_popup"
              popupComp={EditOrderBtn}
              popupData={props}
            >
              <NumberFormat number={cellData} decimals={2} />
            </DisplayConfirmModalBtn>
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Filled",
      width: 80,
      minWidth: 80,
      dataKey: "execShares",
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function renderCell({ cellData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            <NumberFormat number={cellData} decimals={8} />
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Status",
      dataKey: "status",
      maxWidth: 70,
      width: 70,
      minWidth: 70,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ rowData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            {orderKind === OrderKind.OPEN ? "NEW" : "Untriggered"}
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Order ID",
      dataKey: "clientOrderId",
      // maxWidth: 80,
      width: 80,
      minWidth: 80,
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ rowData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            {rowData.clientOrderId}
          </div>
        );
      },
    },
    {
      dataKey: "createdAt",
      title: "Time",
      width: 120,
      minWidth: 115,
      maxWidth: 140,
      headerStyle: {
        textAlign: "right",
      },
      // wrapFunc: function wrapFunc({tableWidth}) {
      //     return tableWidth <= 800;
      // },
      renderCell: function renderCell({ cellData, wrap, rowHeight }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            <span>{moment(cellData).format("DD/MM/YYYY HH:mm:ss")}</span>
          </div>
        );
      },
    },
    {
      disableSort: true,
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      renderCell: function ({ rowData }) {
        const { symbol } = rowData;

        // if (isSuspend(pair) || t === 'groupLabel')
        //   return null;

        return (
          <div className="cpn-virtualized-table__cellwrapper text-center font-semi-bold">
            <CancelOrderBtn
              tooltip="cancel this order"
              symbol={symbol}
              order={rowData}
              onClick={cancelOrder}
            />
          </div>
        );
      },
      renderHeader: function renderHeader() {
        const isStopOrder = orderKind === OrderKind.STOP;

        const message = `Are you sure you want to cancel all${
          isStopOrder ? " stop" : ""
        } order?`;
        const tooltip = `Cancel all${isStopOrder ? " stop" : ""} order`;

        return (
          <CancelAllOrderBtn
            tooltip={tooltip}
            message={message}
            onClick={cancelAllOrders}
          />
        );
      },
    },
  ];

  if (orderKind === OrderKind.OPEN) {
    return insertsAt(
      6,
      [
        {
          //@TODO i18n
          title: "Remaining",
          dataKey: "clientOrderId",
          minWidth: 80,
          width: 80,
          flexGrow: 1,
          headerStyle: {
            textAlign: "right",
          },
          renderCell: function ({ rowData }) {
            return (
              <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
                <NumberFormat
                  number={rowData.qty - rowData.execShares}
                  decimals={8}
                />
              </div>
            );
          },
        },
        {
          //@TODO i18n
          title: "Take Profit/Stop Lost",
          disableSort: true,
          width: 110,
          minWidth: 80,
          flexGrow: 1,
          headerStyle: {
            textAlign: "right",
            paddingRight: 10,
          },
          renderCell: function ({ rowData }) {
            const props = {
              takeProfit: rowData.takeProfitPrice,
              stopLoss: rowData.stopLossPrice,
              takeProfitTradePriceType: LastTradePriceType.LAST_PRICE,
              stopLossTradePriceType: LastTradePriceType.LAST_PRICE,
              symbol: rowData.symbol,
              popupId: "edit_tp_sl_popup",
              sendSubmit: (data) => {
                console.log("data", data);
              },
            };

            const tpsl =
              rowData.takeProfitPrice && rowData.stopLossPrice ? (
                <span className="font-semi-bold">
                  <span className={greenText()}>
                    <NumberFormat
                      number={rowData.takeProfitPrice}
                      decimals={2}
                    />
                  </span>
                  /
                  <span className={redText()}>
                    <NumberFormat number={rowData.stopLossPrice} decimals={2} />
                  </span>
                </span>
              ) : (
                <span className="font-semi-bold">
                  <Icon cssmodule="far" id="plus" /> TP/SL
                </span>
              );
            return (
              <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
                <DisplayConfirmModalBtn
                  popupId="edit_tp_sl_popup"
                  popupComp={PoisitonTpSlModal}
                  popupData={props}
                >
                  {tpsl}
                </DisplayConfirmModalBtn>
              </div>
            );
          },
        },
      ],
      baseColumns
    );
  } else if (orderKind === OrderKind.STOP) {
    return insertsAt(
      6,
      [
        {
          //@TODO i18n
          title: "Stop Price",
          dataKey: "stopPrice",
          width: 80,
          minWidth: 80,
          flexGrow: 1,
          headerStyle: {
            textAlign: "right",
            paddingRight: 10,
          },
          renderCell: function ({ rowData, cellData }) {
            const props = {
              popupId: "edit_order_stop_price_popup",
              order: rowData,
              symbol: rowData.symbol,
              cellType: "stop-price",
              tradeType,
            };
            return (
              <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
                <DisplayConfirmModalBtn
                  popupId="edit_order_stop_price_popup"
                  popupComp={EditOrderBtn}
                  popupData={props}
                >
                  <span>&#8805;</span>{" "}
                  <NumberFormat number={cellData} decimals={2} />
                </DisplayConfirmModalBtn>
              </div>
            );
          },
        },
        {
          //@TODO i18n
          title: "Trigger Price",
          dataKey: "stopPrice",
          width: 80,
          flexGrow: 1,
          minWidth: 80,
          headerStyle: {
            textAlign: "right",
          },
          renderCell: function ({ cellData }) {
            return (
              <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
                <NumberFormat number={cellData} decimals={2} />
              </div>
            );
          },
        },
        {
          //@TODO i18n
          title: "Time In Force",
          dataKey: "clientOrderId",
          maxWidth: 70,
          width: 70,
          minWidth: 70,
          headerStyle: {
            textAlign: "right",
          },
          renderCell: function ({ rowData }) {
            return (
              <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
                <span>GTC</span>
              </div>
            );
          },
        },
      ],
      baseColumns
    );
  }

  return baseColumns;
};

export default getOrderColumns;
