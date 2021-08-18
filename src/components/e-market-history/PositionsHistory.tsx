import React, { useState, useMemo } from 'react';
import { Table, Column } from 'react-virtualized';
// import { DerivativePositionModel } from '@/models/position';
import { getTickerBySymbol } from '@/selectors/ticker.selectors';
import { Scrollbars } from 'react-custom-scrollbars';
import { FundingType, PositionType } from '@/constants/position-enums';
import { LastTradePriceType } from '@/constants/order-enums';
import { NumberFormat, Icon } from '@/ui-components';
import DisplayConfirmModalBtn from '../DisplayConfirmModalBtn';
import ClosePositionBtn from './Positions.close';
import PoisitonTpSlModal from './Poisiton.tp-sl.modal';
import { connect } from 'react-redux';
import { ordering } from './helper';

const mapStateToProps = (state, props) => {
  const ticker = getTickerBySymbol(state)(props.symbol);
  const p = {
    executedLongPosition: state.user.executedLongPosition,
    executedShortPosition: state.user.executedShortPosition,
    executedLongCash: state.user.executedLongCash,
    executedShortCash: state.user.executedShortCash,
    mmr: state.user.mmr,
    symbolEquity: state.user.symbolEquity, // symbol balance
  };

  if (ticker) {
    return {
      ...p,
      markPrice: ticker.markPrice,
    };
  }

  return p;
};

export const PositionsHistory = connect(mapStateToProps)(
  ({
    // positions = [],
    loading = false,
    markPrice,
    size: { width, height },
    eye,
  }: any) => {
    const [scrollerTop, setScrollerTop] = React.useState(0);

    const [sortBy, setSortBy] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);

    const positions = [
      {
        id: `pos-${Math.random()}`,
        niceSymbol: 'btc/usdt',
        symbol: 'BTCUSDT',
        side: 1,
        pnl: 0.93,
        pnlEquiv: 0.5,
        fundingCost: 0.1,
        fundingCostEquiv: 0.2,
        pnlPerc: 1.44,
        baseCC: 'BTC',
        counterCC: 'USDT',
        type: PositionType.MARGIN,
        niceType: 'Margin',
        maintenanceMargin: 1,
        fundingType: FundingType.DAILY,
        niceFundingType: 'Daily',
        liqPrice: 1.878,
        markPrice: markPrice,
        entryPrice: 1.575,
        size: 5.1,
        active: true,
        realisedPnl: 0,
        stopPrice: 0,
        margin: 1.5,
        borrowedValue: 1, //side, cost, amount, lastPrice)
        netValue: 3.6,
      },
      // this is for total row
      {
        id: `pos-${Math.random()}`,
        symbol: 'Total',
        fillPrice: 12781.41,
        pnl: 12781.41,
        tpsl: 12781.41,
      },
    ];
    const [data, setData] = useState<any>(positions);

    const handleScroll = ({ target: { scrollTop } }) => {
      setScrollerTop(scrollTop);
    };

    // useEffect(() => {
    //   setData(positions);
    // }, [positions]);

    const orderedData = useMemo(
      () => ordering(data, sortBy, sortDirection),
      [data, sortBy, sortDirection]
    );

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
            className='position-history-table'
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
            <Column dataKey='symbol' label='Symbol' width={70} />
            <Column
              dataKey='size'
              label='Size'
              width={80}
              headerStyle={{ textAlign: 'right' }}
              style={{ textAlign: 'right' }}
              cellRenderer={({ rowData }) => (eye ? rowData.size : '********')}
            />
            <Column
              dataKey='entryPrice'
              label='Entry Price'
              width={70}
              style={{ textAlign: 'right' }}
              headerStyle={{ textAlign: 'right' }}
              cellRenderer={({ rowData }) =>
                eye ? (
                  <NumberFormat number={rowData.entryPrice} decimals={2} />
                ) : (
                  '********'
                )
              }
            />
            <Column
              dataKey='markPrice'
              label='Mark Price'
              width={70}
              style={{ textAlign: 'right' }}
              headerStyle={{ textAlign: 'right' }}
              cellRenderer={({ rowData }) =>
                eye ? (
                  rowData.symbol === 'Total' ? (
                    ''
                  ) : (
                    <NumberFormat number={rowData.markPrice} decimals={2} />
                  )
                ) : (
                  '********'
                )
              }
            />
            <Column
              dataKey='liqPrice'
              label='Liq.Price'
              width={70}
              style={{ textAlign: 'right' }}
              headerStyle={{ textAlign: 'right' }}
              cellRenderer={({ rowData }) =>
                eye ? (
                  <NumberFormat number={rowData.liqPrice} decimals={2} />
                ) : (
                  '********'
                )
              }
            />
            <Column
              dataKey='margin'
              label='Margin'
              width={100}
              style={{ textAlign: 'right' }}
              headerStyle={{ textAlign: 'right' }}
              cellRenderer={({ rowData }) =>
                eye ? (
                  rowData.symbol === 'Total' ? (
                    ''
                  ) : (
                    <NumberFormat
                      number={rowData.stopPrice}
                      decimals={8}
                      suffix='BTC'
                    />
                  )
                ) : (
                  '********'
                )
              }
            />
            <Column
              dataKey='netValue'
              label='Position Value'
              width={120}
              style={{ textAlign: 'right' }}
              headerStyle={{ textAlign: 'right' }}
              cellRenderer={({ rowData }) =>
                eye ? (
                  rowData.symbol === 'Total' ? (
                    <NumberFormat
                      number={rowData.fillPrice}
                      decimals={4}
                      suffix='USD'
                      prefix='$'
                    />
                  ) : (
                    <NumberFormat number={rowData.fillPrice} decimals={4} />
                  )
                ) : (
                  '********'
                )
              }
            />
            <Column
              dataKey='pnl'
              label='Unrealised Pnl'
              width={120}
              style={{ textAlign: 'right' }}
              headerStyle={{ textAlign: 'right' }}
              cellRenderer={({ rowData }) =>
                eye ? (
                  rowData.symbol === 'Total' ? (
                    <NumberFormat
                      number={rowData.pnl}
                      decimals={4}
                      suffix='USD'
                      prefix='$'
                    />
                  ) : (
                    <div className='d-flex d-justify-content-flex-end'>
                      <NumberFormat number={rowData.pnl} decimals={4} />(
                      {rowData.pnlPerc}%)
                    </div>
                  )
                ) : (
                  '********'
                )
              }
            />
            <Column
              dataKey='tpsl'
              label={<div className='mr-10'>Take Profit/Stop Loss</div>}
              width={150}
              style={{ textAlign: 'right' }}
              headerStyle={{ textAlign: 'right' }}
              cellRenderer={({ rowData }) => {
                if (!eye) {
                  return '********';
                }
                if (rowData.symbol === 'Total') {
                  return (
                    <NumberFormat
                      number={rowData.pnl}
                      decimals={4}
                      suffix='USD'
                      prefix='$'
                      classes={'pr-10'}
                    />
                  );
                }
                const takeProfit = 1000;
                const stopLoss = 8500;

                const props = {
                  takeProfit: 1000,
                  stopLoss: 8500,
                  takeProfitTradePriceType: LastTradePriceType.LAST_PRICE,
                  stopLossTradePriceType: LastTradePriceType.LAST_PRICE,
                  symbol: 'BTCUSD',
                  popupId: 'edit_tp_sl_popup',
                  sendSubmit: (data) => {
                    console.log('data', data);
                  },
                };

                const tpsl =
                  takeProfit && stopLoss ? (
                    <span className='font-semi-bold'>
                      <span className={/*greenText()*/ 'text--silver-300'}>
                        <NumberFormat number={takeProfit} decimals={2} />
                      </span>
                      /
                      <span className={/*redText()*/ 'text--silver-300'}>
                        <NumberFormat number={stopLoss} decimals={2} />
                      </span>
                    </span>
                  ) : (
                    <span className='font-semi-bold'>
                      <Icon cssmodule='far' id='plus' /> TP/SL
                    </span>
                  );
                return (
                  <div className='text-right font-semi-bold'>
                    <DisplayConfirmModalBtn
                      popupId='edit_tp_sl_popup'
                      popupComp={PoisitonTpSlModal}
                      popupData={props}
                    >
                      {tpsl}
                    </DisplayConfirmModalBtn>
                  </div>
                );
              }}
            />
            <Column
              dataKey='closePosition'
              label='Close Position'
              width={200}
              style={{ textAlign: 'right' }}
              headerStyle={{ textAlign: 'right' }}
              cellRenderer={({ rowData }) => {
                if (rowData.symbol === 'Total') return <></>;
                if (!eye) {
                  return '********';
                }
                return (
                  <div className='text-right font-semi-bold'>
                    <ClosePositionBtn
                      position={rowData}
                      closePosition={(price, qty) => {
                        console.log('position close', price, qty);
                      }}
                      symbol={rowData.symbol}
                    />
                  </div>
                );
              }}
            />
          </Table>
        </Scrollbars>
        {/* <MarketHistoryEmptyMessage /> */}
      </div>
    );
  }
);
