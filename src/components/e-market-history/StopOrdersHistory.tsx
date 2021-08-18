import React from "react";
import { Table, Column } from "react-virtualized";
import { Scrollbars } from "react-custom-scrollbars";
import moment from "moment";
import { NumberFormat } from "@/ui-components";
import CancelAllOrderBtn from "./Orders.cancel-all";
import { AppTradeType } from "@/constants/trade-type";
import { MOCK_STOPS } from "@/utils/mocks/stops";
interface StopOrdersProps {
  openOrders?: any[];
  loading?: boolean;
  size?: {
    width?: number;
    height?: number;
  };
  tradeType: AppTradeType;
}

export const StopOrdersHistory = ({
  openOrders = MOCK_STOPS,
  loading = false,
  size: { width, height },
  tradeType,
}: StopOrdersProps) => {
  const message = "Are you sure you want to cancel all stop orders?";
  const tooltip = "Cancel all stop orders";
  const [scrollerTop, setScrollerTop] = React.useState(0);

  const handleScroll = ({ target: { scrollTop } }) => {
    setScrollerTop(scrollTop);
  };

  return (
    <div className="e-market-history-container">
      <Scrollbars
        style={{ width, height }}
        onScroll={handleScroll}
        renderTrackVertical={(props) => (
          <div className="track-vertical" {...props} />
        )}
        renderTrackHorizontal={(props) => (
          <div className="track-horizontal" {...props} />
        )}
      >
        {tradeType === AppTradeType.SPOT && (
          <Table
            autoHeight
            height={height}
            scrollTop={scrollerTop}
            width={width < 700 ? 700 : width}
            rowHeight={30}
            headerHeight={30}
            rowCount={openOrders.length}
            rowGetter={({ index }) => openOrders[index]}
          >
            <Column dataKey="pair" label="Pair" width={150} />
            <Column dataKey="type" label="Type" width={80} />
            <Column dataKey="side" label="Side" width={80} />
            <Column
              dataKey="amount"
              label="Size"
              width={80}
              headerStyle={{ textAlign: "right" }}
              style={{ textAlign: "right" }}
            />
            <Column
              dataKey="orderPrice"
              label="Order Price"
              width={100}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.orderPrice} decimals={8} />
              )}
            />
            <Column
              dataKey="triggerPrice"
              label="Trigger Price"
              width={200}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.triggerPrice} decimals={8} />
              )}
            />
            <Column dataKey="status" label="TP/SL" width={100} />
            <Column dataKey="status" label="Status" width={100} />
            <Column
              dataKey="createdAt"
              label={
                <div>
                  <span className="mr-4">Date</span>
                </div>
              }
              width={300}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) =>
                moment(rowData.createdAt).format("DD/MM/YYYY HH:mm:ss")
              }
            />
            <Column
              dataKey=""
              label="Actions"
              width={300}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <CancelAllOrderBtn
                  tooltip={tooltip}
                  message={message}
                  onClick={() => {}}
                />
              )}
            />
          </Table>
        )}
        {tradeType !== AppTradeType.SPOT && (
          <Table
            autoHeight
            height={height}
            scrollTop={scrollerTop}
            width={width < 700 ? 700 : width}
            rowHeight={30}
            headerHeight={30}
            rowCount={openOrders.length}
            rowGetter={({ index }) => openOrders[index]}
          >
            <Column dataKey="pair" label="Symbol" width={150} />
            <Column dataKey="type" label="Type" width={100} />
            <Column
              dataKey="amount"
              label="Size"
              width={80}
              headerStyle={{ textAlign: "right" }}
              style={{ textAlign: "right" }}
            />
            <Column
              dataKey="orderPrice"
              label="OrderPrice"
              width={100}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.orderPrice} decimals={8} />
              )}
            />
            <Column
              dataKey="execShares"
              label="Filled"
              width={100}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.execShares} decimals={8} />
              )}
            />
            <Column
              dataKey="stopPrice"
              label="Stop Price"
              width={100}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.stopPrice} decimals={8} />
              )}
            />
            <Column
              dataKey="triggerPrice"
              label="Trigger Price"
              width={200}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.triggerPrice} decimals={8} />
              )}
            />
            <Column
              dataKey="timeInForce"
              label="Time In Force"
              width={200}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) =>
                moment(rowData.timeInForce).format("DD/MM/YYYY HH:mm:ss")
              }
            />
            <Column dataKey="status" label="Status" width={100} />
            <Column dataKey="orderID" label="Order ID" width={100} />
            <Column
              dataKey="createdAt"
              label={
                <div>
                  <span className="mr-4">Date</span>
                  <CancelAllOrderBtn
                    tooltip={tooltip}
                    message={message}
                    onClick={() => {}}
                  />
                </div>
              }
              width={300}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) =>
                moment(rowData.createdAt).format("DD/MM/YYYY HH:mm:ss")
              }
            />
          </Table>
        )}
      </Scrollbars>
    </div>
  );
};
