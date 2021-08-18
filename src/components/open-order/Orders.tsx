import { Table } from "@/ui-components";
// import { TableInfiniteLoader } from '@/ui-components/ui/Table.Infinite';
import React, { useCallback, useMemo } from "react";
import getOrderColumns, { OrderKind } from "./Orders.columns";
import { OrderItem } from "@/models/order.model";
import { AppTradeType } from "@/constants/trade-type";
import MarketHistoryEmptyMessage from "../market-history/MarketHistory.emptyMessage";
interface OrdersProps {
  orders?: any[];
  loading?: boolean;
  cancelOrder: (order: OrderItem) => void;
  cancelAllOrders: (orders: OrderItem[]) => void;
  tradeType: AppTradeType;
  orderKind: OrderKind;
}

const Orders = ({
  orders = [],
  loading = false,
  cancelOrder,
  tradeType,
  orderKind = OrderKind.OPEN,
  cancelAllOrders,
}: Partial<OrdersProps>) => {
  const onCancelAllBtnClick = useCallback(
    (e) => {
      cancelAllOrders(orders);
    },
    [orders, cancelAllOrders]
  );

  const columns = useMemo(
    () =>
      getOrderColumns({
        cancelAllOrders: onCancelAllBtnClick,
        cancelOrder,
        tradeType,
        orderKind,
      }),
    [onCancelAllBtnClick, cancelOrder, tradeType, orderKind]
  );

  return (
    <>
      <Table
        enabledHorizontalScroll
        name="openorders"
        data={orders}
        loading={loading}
        columns={columns}
        defaultFontSize={13}
        rowHeight={20}
        headerHeight={25}
        maxHeight={90}
        emptyListMessage={"There is no open orders"}
      />
      <MarketHistoryEmptyMessage />
      {/* <TableInfiniteLoader 
        enabledHorizontalScroll
        name="openorders"
        data={orders}
        loading={loading}
        columns={columns}
        defaultFontSize={11}
        rowHeight={30}
        headerHeight={30}
        maxHeight={170}
        emptyListMessage={"emptyListMessage"}
      /> */}
    </>
  );
};

export default Orders;
