import React from "react";
import { Icon, IconButton, NumberFormat } from "@/ui-components";
import Tooltip from "@/ui-components/ui/Tooltip";
import { greenText, redText } from "@/exports";
import ClosePositionBtn from "./Positions.close";
import { PositionSide } from "@/constants/position-enums";
import DisplayConfirmModalBtn from "../DisplayConfirmModalBtn";
import PositionsUpdateMarginModal from "./Positions.update-margin.modal";
import { LastTradePriceType } from "@/constants/order-enums";
import PoisitonTpSlModal from "./Poisiton.tp-sl.modal";

const getPositionColumns = function ({ eye }) {
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
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      renderCell: function ({ cellData }) {
        const symbol = cellData;

        return (
          <Tooltip tooltipContent={symbol}>
            <span>{symbol}</span>
          </Tooltip>
        );
      },
    },
    {
      dataKey: "size",
      //@TODO i18n
      title: "Size",
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ cellData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            <span>
              <NumberFormat number={cellData} decimals={2} />
            </span>
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Entry Price",
      dataKey: "entryPrice",
      width: 60,
      minWidth: 60,
      flexGrow: 1,
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
      title: "Mark Price",
      dataKey: "markPrice",
      disableSort: true,
      width: 60,
      minWidth: 60,
      flexGrow: 1,
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
      title: "Liq.Price",
      width: 60,
      minWidth: 60,
      flexGrow: 1,
      dataKey: "liqPrice",
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function renderCell({ cellData, rowData }) {
        const c = cellData < 0 ? redText() : cellData > 0 ? greenText() : "";

        return (
          <div
            className={`${c} cpn-virtualized-table__cellwrapper text-right font-semi-bold`}
          >
            <NumberFormat number={cellData} decimals={2} />
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Margin",
      width: 60,
      minWidth: 60,
      dataKey: "margin",
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
        paddingRight: 10,
      },
      renderCell: function renderCell({ cellData, rowData }) {
        const props = {
          popupId: "edit_position_margin_popup",
          symbol: "BTCUSD",
          marginPrice: 1,
          leverage: 44.1,
          availableMargin: 0.435,
          liqPrice: 8412.5,
        };
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            <DisplayConfirmModalBtn
              popupId="edit_position_margin_popup"
              popupComp={PositionsUpdateMarginModal}
              popupData={props}
            >
              <NumberFormat number={cellData} decimals={2} /> BTC
            </DisplayConfirmModalBtn>
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Position Value",
      width: 60,
      minWidth: 60,
      dataKey: "netValue",
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function renderCell({ cellData, rowData }) {
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            <NumberFormat number={cellData} decimals={2} />
          </div>
        );
      },
    },
    {
      //@TODO i18n
      title: "Unrealised PnL",
      width: 80,
      minWidth: 80,
      dataKey: "pnl",
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function renderCell({ cellData, rowData }) {
        const c = greenText();
        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            <span className={c}>
              {eye ? (
                "********"
              ) : (
                <>
                  <NumberFormat number={cellData} decimals={3} />(
                  <NumberFormat number={rowData.pnlPerc} decimals={2} />
                  %)
                </>
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: "Take Profit/Stop Loss",
      disableSort: true,
      width: 120,
      minWidth: 120,
      flexGrow: 1,
      headerStyle: {
        textAlign: "right",
        paddingRight: 10,
      },
      renderCell: function ({ cellData }) {
        const takeProfit = 1000;
        const stopLoss = 8500;

        const props = {
          takeProfit: 1000,
          stopLoss: 8500,
          takeProfitTradePriceType: LastTradePriceType.LAST_PRICE,
          stopLossTradePriceType: LastTradePriceType.LAST_PRICE,
          symbol: "BTCUSD",
          popupId: "edit_tp_sl_popup",
          sendSubmit: (data) => {
            console.log("data", data);
          },
        };

        const tpsl =
          takeProfit && stopLoss ? (
            <span className="font-semi-bold">
              <span className={/*greenText()*/ "text--silver-300"}>
                <NumberFormat number={takeProfit} decimals={2} />
              </span>
              /
              <span className={/*redText()*/ "text--silver-300"}>
                <NumberFormat number={stopLoss} decimals={2} />
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
    {
      disableSort: true,
      width: 180,
      minWidth: 180,
      maxWidth: 180,
      title: "Close Position",
      headerStyle: {
        textAlign: "right",
      },
      renderCell: function ({ rowData }) {
        const { symbol } = rowData;

        return (
          <div className="cpn-virtualized-table__cellwrapper text-right font-semi-bold">
            <ClosePositionBtn
              position={rowData}
              closePosition={(price, qty) => {
                console.log("position close", price, qty);
              }}
              symbol={symbol}
            />
          </div>
        );
      },
    },
  ];
};

export default getPositionColumns;
