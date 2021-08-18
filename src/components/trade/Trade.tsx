import React, { useCallback, useEffect } from "react";
import _pick from "lodash/pick";

import { Item, TradeHeader } from "./Trade.item";
import { List } from "@/ui-components";
import {
  TABLE_PRESCAN_ROWS,
  TABLE_ROW_HEIGHT,
} from "@/constants/app.constants";
import { TradeItemModel } from "@/models/trade.model";
import { EMPTY_ARRAY } from "@/exports";

interface TradeHistoryProps {
  symbol: string;
  data: TradeItemModel[];
  height: number;
  loading?: boolean;
  initTrades: (symbol: string) => void;
}

export const TradeList = ({
  symbol,
  data = EMPTY_ARRAY,
  height = 361,
  loading,
  initTrades,
}: Partial<TradeHistoryProps>) => {
  const renderItemFunc = useCallback(
    (source, index) => {
      const props = _pick(source, ["price", "amount", "side", "date"]);

      return <Item key={source.id} symbol={symbol} {...props} />;
    },
    [symbol]
  );

  useEffect(() => {
    initTrades(symbol);
  }, [initTrades, symbol]);

  return (
    <div className="trade-history__container">
      <TradeHeader />
      <List
        data={data}
        height={height}
        rowHeight={TABLE_ROW_HEIGHT}
        loading={loading}
        overscanRowCount={TABLE_PRESCAN_ROWS}
        renderItem={renderItemFunc}
      />
    </div>
  );
};
