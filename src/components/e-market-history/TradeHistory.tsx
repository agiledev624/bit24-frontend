import React, { useMemo, useEffect, useState } from "react";
import { Table, Column } from "react-virtualized";
import { Scrollbars } from "react-custom-scrollbars";
import moment from "moment";
import { NumberFormat } from "@/ui-components";
import { ordering } from "./helper";
import { AppTradeType } from "@/constants/trade-type";
interface TradesProps {
  trades?: any[];
  loading?: boolean;
  size?: {
    width?: number;
    height?: number;
  };
  tradeType?: AppTradeType;
}
const a = (amount?: number) => ({
  id: 1,
  uuid: 1,
  symbol: "BTCUSDT",
  pair: "BTCUSDT",
  orderType: 1,
  tradeType: 1,
  totalFilled: 1,
  avgPrice: 2,
  stopPrice: 0,
  ccy: "BTC",
  type: 1,
  side: 1,
  amount: amount ? amount : 2,
  price: 2.01,
  status: 1,
  createdAt: Date.now(),
});

const o = [
  a(1),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(),
  a(3),
];

export const TradeHistory = ({
  trades = o,
  loading = false,
  tradeType,
  size: { width, height },
}: TradesProps) => {
  const [scrollerTop, setScrollerTop] = React.useState(0);
  const [data, setData] = useState<any>([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleScroll = ({ target: { scrollTop } }) => {
    setScrollerTop(scrollTop);
  };

  useEffect(() => {
    setData(trades);
  }, [trades]);

  const orderedData = useMemo(
    () => ordering(data, sortBy, sortDirection),
    [data, sortBy, sortDirection]
  );

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
            rowCount={orderedData.length}
            rowGetter={({ index }) => orderedData[index]}
            sortBy={sortBy}
            sortDirection={sortDirection}
            sort={(info) => {
              const { sortBy: _sortBy, sortDirection: _sortDir } = info;
              setSortBy(_sortBy);
              setSortDirection(_sortDir);
            }}
          >
            <Column dataKey="symbol" label="Pair" width={100} />
            <Column
              dataKey="type"
              label="Type"
              width={80}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
            />
            <Column
              dataKey="side"
              label="Side"
              width={80}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
            />
            <Column
              dataKey="amount"
              label="Size"
              width={80}
              headerStyle={{ textAlign: "right" }}
              style={{ textAlign: "right" }}
            />
            <Column
              dataKey="avgPrice"
              label="Avg. Fill Price"
              width={150}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.price} decimals={8} />
              )}
            />
            <Column
              dataKey="stopPrice"
              label="Executed"
              width={150}
              headerStyle={{ textAlign: "right" }}
              style={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.stopPrice} decimals={8} />
              )}
            />
            <Column
              dataKey="totalFilled"
              label="Fee"
              width={150}
              headerStyle={{ textAlign: "right" }}
              style={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.totalFilled} decimals={8} />
              )}
            />
            <Column
              dataKey="createdAt"
              label="Date"
              width={200}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) =>
                moment(rowData.createdAt).format("DD/MM/YYYY HH:mm:ss")
              }
            />
          </Table>
        )}
        {tradeType !== "spot" && (
          <Table
            autoHeight
            height={height}
            scrollTop={scrollerTop}
            width={width < 700 ? 700 : width}
            rowHeight={30}
            headerHeight={30}
            rowCount={orderedData.length}
            rowGetter={({ index }) => orderedData[index]}
            sortBy={sortBy}
            sortDirection={sortDirection}
            sort={(info) => {
              const { sortBy: _sortBy, sortDirection: _sortDir } = info;
              setSortBy(_sortBy);
              setSortDirection(_sortDir);
            }}
          >
            <Column dataKey="symbol" label="Symbol" width={150} />

            <Column
              dataKey="price"
              label="Price"
              width={200}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.price} decimals={8} />
              )}
            />
            <Column
              dataKey="amount"
              label="Size"
              width={80}
              headerStyle={{ textAlign: "right" }}
              style={{ textAlign: "right" }}
            />
            <Column
              dataKey="totalFilled"
              label="Fee"
              width={150}
              headerStyle={{ textAlign: "right" }}
              style={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.totalFilled} decimals={8} />
              )}
            />
            <Column
              dataKey="stopPrice"
              label="Realized Profit"
              width={80}
              headerStyle={{ textAlign: "right" }}
              style={{ textAlign: "right" }}
              cellRenderer={({ rowData }) => (
                <NumberFormat number={rowData.stopPrice} decimals={8} />
              )}
            />
            <Column
              dataKey="createdAt"
              label="Date"
              width={200}
              style={{ textAlign: "right" }}
              headerStyle={{ textAlign: "right" }}
              cellRenderer={({ rowData }) =>
                moment(rowData.createdAt).format("DD/MM/YYYY HH:mm:ss")
              }
            />
          </Table>
        )}
      </Scrollbars>
      {/* <MarketHistoryEmptyMessage /> */}
    </div>
  );
};
