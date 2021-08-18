import React from "react";
import { Table, Column } from "react-virtualized";
import { Scrollbars } from "react-custom-scrollbars";
import moment from "moment";
import { NumberFormat } from "@/ui-components";
import CancelAllOrderBtn from "./Orders.cancel-all";
import { MOCK_OPEN_ORDERS } from "@/utils/mocks/open-orders";
interface OpenOrdersProps {
  openOrders?: any[];
  loading?: boolean;
  size?: {
    width?: number;
    height?: number;
  };
}

// function defaultHeaderRenderer({ dataKey, label, sortBy, sortDirection }) {
//   const showSortIndicator = sortBy === dataKey;
//   const message = 'Are you sure you want to cancel all order?';
//   const tooltip = 'Cancel all order';
//   const children = [
//     <span
//       className='ReactVirtualized__Table__headerTruncatedText'
//       key='label'
//       title={typeof label === 'string' ? label : null}
//     >
//       {label}
//     </span>,
//   ];

//   // if (showSortIndicator) {
//   //   children.push(
//   //     <SortIndicator key="SortIndicator" sortDirection={sortDirection} />,
//   //   );
//   // }

//   return children;
// }

export const OpenOrdersHistory = ({
  openOrders = MOCK_OPEN_ORDERS,
  loading = false,
  size: { width, height },
}: OpenOrdersProps) => {
  const message = "Are you sure you want to cancel all orders?";
  const tooltip = "Cancel all orders";
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
          <Column
            dataKey="pair"
            label="Pair"
            width={150}
            headerStyle={{ textAlign: "right" }}
          />
          <Column
            dataKey="type"
            label="Type"
            width={80}
            headerStyle={{ textAlign: "right" }}
          />
          <Column
            dataKey="side"
            label="Side"
            width={80}
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
            dataKey="orderPrice"
            label="Price"
            width={130}
            style={{ textAlign: "right" }}
            headerStyle={{ textAlign: "right" }}
            cellRenderer={({ rowData }) => (
              <NumberFormat number={rowData.orderPrice} decimals={8} />
            )}
          />
          <Column
            dataKey="execShares"
            label="Filled"
            width={130}
            style={{ textAlign: "right" }}
            headerStyle={{ textAlign: "right" }}
            cellRenderer={({ rowData }) => (
              <NumberFormat number={rowData.execShares} decimals={8} />
            )}
          />
          <Column
            dataKey="remainingPrice"
            label="Remaining"
            width={130}
            style={{ textAlign: "right" }}
            headerStyle={{ textAlign: "right" }}
            cellRenderer={({ rowData }) => (
              <NumberFormat number={rowData.remainingPrice} decimals={8} />
            )}
          />
          <Column
            dataKey="tp_sl"
            label="TP/SL"
            width={130}
            style={{ textAlign: "right" }}
            headerStyle={{ textAlign: "right" }}
            cellRenderer={({ rowData }) => (
              <NumberFormat number={rowData.tp_sl} decimals={8} />
            )}
          />
          <Column
            dataKey="status"
            label="Status"
            width={100}
            headerStyle={{ textAlign: "right" }}
          />
          <Column
            dataKey="orderID"
            label="Order ID"
            width={100}
            headerStyle={{ textAlign: "right" }}
          />
          <Column
            dataKey="createdAt"
            label={
              <div>
                <span className="mr-4">Date</span>
              </div>
            }
            width={200}
            style={{ textAlign: "right" }}
            headerStyle={{ textAlign: "right" }}
            cellRenderer={({ rowData }) =>
              moment(rowData.createdAt).format("DD/MM/YYYY HH:mm")
            }
          />
          <Column
            dataKey=""
            label={
              <div>
                <span className="mr-4">Actions</span>
              </div>
            }
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
      </Scrollbars>
    </div>
  );
};
