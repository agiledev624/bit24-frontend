import {
  FundingType,
  getPositionSide,
  PositionSide,
  PositionType,
} from "@/constants/position-enums";
import { DerivativePositionModel } from "@/models/position";
import { Table } from "@/ui-components";
import React, { useMemo } from "react";
import getPositionColumns from "./Positions.columns";
import { connect } from "react-redux";
import { getTickerBySymbol } from "@/selectors/ticker.selectors";
import { divide, multiply, subtract } from "@/exports/math";
import { PositionFooter } from "./Positions.footer";
import MarketHistoryEmptyMessage from "../market-history/MarketHistory.emptyMessage";

interface PositionsProps {
  positions?: DerivativePositionModel[];
  loading?: boolean;
  eye?: boolean;
}

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
export const Positions = connect(mapStateToProps)(
  ({
    eye,
    // positions = [],
    loading = false,
    executedLongPosition,
    executedShortPosition,
    executedLongCash,
    executedShortCash,
    markPrice,
    mmr,
    symbolEquity,
  }: any) => {
    const columns = useMemo(() => getPositionColumns({ eye }), [eye]);
    let positions = [];

    // if (executedLongPosition !== undefined) {
    //   const size = +subtract(executedLongPosition, executedShortPosition);
    //   if (size) {
    //     const side = size > 0 ? PositionSide.LONG : PositionSide.SHORT;
    //     const entryPrice = 0 || executedLongPosition > 0
    //       ? +divide(executedLongCash, executedLongPosition)
    //       : +divide(executedShortCash, executedShortPosition);

    //     const positionValue = +multiply(Math.abs(size), entryPrice);
    //     const unrealizedPnl = +multiply(size, +subtract(markPrice, entryPrice));
    //     const pnlPercent = +multiply(+divide(unrealizedPnl, positionValue), 100);
    //     const mmrPercent = +divide(mmr, 100);
    //     const margin = +multiply(mmrPercent, positionValue);

    //     const liqPrice = +divide(
    //       +subtract(+multiply(size, entryPrice), symbolEquity),
    //       +subtract(size, +multiply(Math.abs(size), mmrPercent))
    //     );

    positions = [
      {
        id: `pos-${Math.random()}`,
        niceSymbol: "btc/usdt",
        symbol: "BTCUSDT",
        side: 1,
        pnl: 0.93,
        pnlEquiv: 0.5,
        fundingCost: 0.1,
        fundingCostEquiv: 0.2,
        pnlPerc: 1.44,
        baseCC: "BTC",
        counterCC: "USDT",
        type: PositionType.MARGIN,
        niceType: "Margin",
        maintenanceMargin: 1,
        fundingType: FundingType.DAILY,
        niceFundingType: "Daily",
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
    ];
    //   }
    // }

    return (
      <div className="positions__wrapper">
        <Table
          enabledHorizontalScroll
          name="positions"
          data={positions}
          loading={loading}
          columns={columns}
          defaultFontSize={13}
          rowHeight={20}
          headerHeight={25}
          maxHeight={60}
          emptyListMessage={"No Open Positions"}
        />
        <PositionFooter columns={columns} eye={eye} />
        <MarketHistoryEmptyMessage />
      </div>
    );
  }
);
