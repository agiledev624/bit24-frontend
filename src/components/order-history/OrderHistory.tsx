import { useQMQueryString } from "@/hooks/useQueryString";
import { Table } from "@/ui-components";
import ResizeSensor from "@/ui-components/ResizeSensor";
import { TableInfiniteLoader } from "@/ui-components/ui/Table.Infinite";
import React, { useEffect, useMemo } from "react";
import MarketHistoryEmptyMessage from "../market-history/MarketHistory.emptyMessage";
import getOrderHistoryColumns from "./OrderHistory.columns";

interface OrdersProps {
  orders?: any[];
  loading?: boolean;
}

const a = (amount?: number) => ({
  id: 1,
  uuid: 1,
  symbol: "BTCUSDT",
  pair: "BTCUSDT",
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

// function MyTestComponent() {
//     // let [active, setActive] = useQueryString('active', true)
//     // const [stringAny, setStringAny] = useQueryString('string', '')
//     const [xxx, setBatch] = useQueryStrings({
//       active: true,
//       string: ''
//     });

//     const {active, string: stringAny} = xxx;

//     useEffect( () => console.log("mount"), [] );
//     useEffect( () => console.log("will update active or stringAny"), [ active, stringAny ] );
//     useEffect( () => console.log("will update active"), [active]);
//     useEffect( () => console.log("will update stringAny"), [stringAny]);

//     return (
//         <div>
//             <button type="button" onClick={() => {
//                 // setStringAny(`this is random number from 0 - 1: ${Math.random()}`);
//                 // setActive(!active)
//             }}>multiple set</button>
//             <button type="button" onClick={() => {
//                 // setActive(!active);
//                 setBatch({active: !active});
//             }}>toggle active</button>
//             <button type="button" onClick={() => {
//                 setBatch({string: `this is random number from 0 - 1: ${Math.random()}`});
//                 // setStringAny(`this is random number from 0 - 1: ${Math.random()}`);
//             }}>update string</button>
//             <button type="button" onClick={() => {
//                 setBatch({string: stringAny});
//                 // setStringAny(`this is random number from 0 - 1: ${Math.random()}`);
//             }}>update same string</button>
//             <button type="button" onClick={() => {
//                 setBatch({active: !active, string: `this is random number from 0 - 1: ${Math.random()}`});
//             }}>update batch</button>
//             <button type="button" onClick={() => {
//                 setBatch({active, string: stringAny});
//             }}>update batch with the same value</button>
//             {active && <p>Some active content</p>}
//             {stringAny && <p>{stringAny}</p>}
//         </div>
//     )
// }

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

export const OrderHistory = ({ orders = o, loading = false }: OrdersProps) => {
  const [page, setPage] = useQMQueryString("page", 1);

  const columns = useMemo(() => getOrderHistoryColumns(), []);
  console.log(orders, 'orders')
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
        emptyListMessage={"There is no order history"}
      />
      <MarketHistoryEmptyMessage />
    </>
  );
};
