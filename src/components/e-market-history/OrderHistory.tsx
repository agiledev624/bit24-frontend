import React, { useState, useEffect, useMemo } from 'react';
import { Table, Column } from 'react-virtualized';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import { NumberFormat } from '@/ui-components';
import {ordering} from './helper';
interface OrdersProps {
  orders?: any[];
  loading?: boolean;
  size?: {
    width?: number;
    height?: number;
  };
}

const a = (amount?: number) => ({
  id: 1,
  uuid: 1,
  symbol: 'BTCUSDT',
  pair: 'BTCUSDT',
  tradeType: 1,
  totalFilled: 1,
  avgPrice: 2,
  stopPrice: 0,
  ccy: 'BTC',
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

export const OrderHistory = ({
  orders = o,
  loading = false,
  size: { width, height },
}: OrdersProps) => {
  const [scrollerTop, setScrollerTop] = React.useState(0);
  const [data, setData] = useState<any>([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleScroll = ({ target: { scrollTop } }) => {
    setScrollerTop(scrollTop);
  };

  useEffect(() => {
    setData(orders);
  }, [orders]);  

  const orderedData = useMemo(() => ordering(data, sortBy, sortDirection), [data, sortBy, sortDirection]);

  return (
    <div className='e-market-history-container'>
      <Scrollbars
        style={{ width, height }}
        onScroll={handleScroll}
        renderTrackVertical={(props) => (
          <div className='track-vertical' {...props} />
        )}
        renderTrackHorizontal={(props) => (
          <div className='track-horizontal' {...props} />
        )}
      >
        <Table
          autoHeight
          height={height}
          scrollTop={scrollerTop}
          width={width < 700 ? 700 : width}
          rowHeight={30}
          headerHeight={30}
          rowCount={orderedData.length}
          rowGetter={({ index }) => orderedData[index]}
          // headerRenderer={defaultHeaderRenderer}
          sortBy={sortBy}
          sortDirection={sortDirection}
          sort={(info) => {
            const {sortBy: _sortBy, sortDirection: _sortDir} = info;
            setSortBy(_sortBy);
            setSortDirection(_sortDir);
          }}
        >
          <Column dataKey='pair' label='Symbol' width={150} />
          <Column
            dataKey='amount'
            label='Size'
            width={80}
            headerStyle={{ textAlign: 'right' }}
            style={{ textAlign: 'right' }}
          />
          <Column
            dataKey='price'
            label='Price'
            width={200}
            style={{ textAlign: 'right' }}
            headerStyle={{ textAlign: 'right' }}
            cellRenderer={({ rowData }) => (
              <NumberFormat number={rowData.price} decimals={8} />
            )}
          />
          <Column
            dataKey='execShares'
            label='Filled'
            width={200}
            style={{ textAlign: 'right' }}
            headerStyle={{ textAlign: 'right' }}
            cellRenderer={({ rowData }) => (
              <NumberFormat number={rowData.execShares} decimals={8} />
            )}
          />
          <Column
            dataKey='stopPrice'
            label='Stop Price'
            width={200}
            style={{ textAlign: 'right' }}
            headerStyle={{ textAlign: 'right' }}
            cellRenderer={({ rowData }) => (
              <NumberFormat number={rowData.stopPrice} decimals={8} />
            )}
          />
          <Column
            dataKey='fillPrice'
            label='Fill Price'
            width={200}
            style={{ textAlign: 'right' }}
            headerStyle={{ textAlign: 'right' }}
            cellRenderer={({ rowData }) => (
              <NumberFormat number={rowData.fillPrice} decimals={8} />
            )}
          />
          <Column dataKey='type' label='Type' width={100} />
          <Column
            dataKey='createdAt'
            label='Date'
            width={200}
            style={{ textAlign: 'right' }}
            headerStyle={{ textAlign: 'right' }}
            cellRenderer={({ rowData }) =>
              moment(rowData.createdAt).format('DD/MM/YYYY HH:mm:ss')
            }
          />
        </Table>
      </Scrollbars>
      {/* <MarketHistoryEmptyMessage /> */}
    </div>
  );
};
