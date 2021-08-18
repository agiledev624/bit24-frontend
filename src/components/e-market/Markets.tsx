import { Tabs, IconButton, List } from "@/ui-components";
import React, { useState, useCallback, useEffect } from "react";
import _pick from "lodash/pick";
import MarketHistoryEmptyMessage from "../market-history/MarketHistory.emptyMessage";
import { TABLE_PRESCAN_ROWS } from "@/constants/app.constants";
import { Item, MarketHeader, SORT_TYPE } from "./Market.item";
import { genMock } from "./mock";
import { compare } from "mathjs";

const TABLE_ROW_HEIGHT = 54;

interface MarketsProps {
  markets?: any[];
  loading?: boolean;
  height?: number;
  hideColumns?: string[];
  isPopup?: boolean;
}
const tabsConfig = [
  {
    title: <IconButton id="star" cssmodule="fas" classes={"font-size-9"} />,
    // linkTo: `${RoutePaths.EXCHANGE}/BTCUSDT`,
    to: "star",
  },
  {
    title: "Spot",
    // linkTo: `${RoutePaths.DERIVATIVE}/BTCUSDT`,
    to: "spot",
  },
  {
    title: "USDT-M",
    // linkTo: `${RoutePaths.DERIVATIVE}/BTCUSDT`,
    to: "usdt-m",
  },
  {
    title: "Coin-M",
    // linkTo: `${RoutePaths.DERIVATIVE}/BTCUSDT`,
    to: "coin-m",
  },
];

const compareSort = (a, b) => (a > b ? 1 : a < b ? -1 : 0);

export const MarketsList = ({
  markets = genMock(),
  loading = false,
  height = 360,
  hideColumns = [],
  isPopup = false,
}: MarketsProps) => {
  const [selected, setSelected] = useState<string>(tabsConfig[0].to);
  const [sort, setSort] = useState(null);
  const [sortedMarkets, setSortedMarkets] = useState(markets);

  const renderItemFunc = useCallback((source, index) => {
    return (
      <Item
        key={index}
        {...source}
        hideColumns={hideColumns}
        isPopup={isPopup}
      />
    );
  }, []);

  const changeSort = (sort) => {
    setSort(sort);
    const sorted = markets.sort((a, b) => {
      if (sort === SORT_TYPE.SYMBOLS_ASC) {
        return compareSort(a.pair, b.pair);
      } else if (sort === SORT_TYPE.SYMBOLS_DESC) {
        return compareSort(b.pair, a.pair);
      } else if (sort === SORT_TYPE.PERCENT_ASC) {
        return compareSort(a.percent, b.percent);
      } else if (sort === SORT_TYPE.PERCENT_DESC) {
        return compareSort(b.percent, a.percent);
      } else if (sort === SORT_TYPE.PRICE_ASC) {
        return compareSort(a.price, b.price);
      } else if (sort === SORT_TYPE.PRICE_DESC) {
        return compareSort(b.price, a.price);
      }
      return compareSort(a.pair, b.pair);
    });
    setSortedMarkets(sorted);
  };

  return (
    <div className="e-markets-container">
      <Tabs
        elements={tabsConfig}
        selected={selected}
        onChange={(to) => setSelected(to)}
        containerClassName="e-markets-tabs"
        tabClassName="e-markets-tab"
      />
      <MarketHeader
        sort={sort}
        setSort={changeSort}
        hideColumns={hideColumns}
        isPopup={isPopup}
      />
      <List
        data={sortedMarkets}
        height={height}
        rowHeight={TABLE_ROW_HEIGHT}
        loading={false}
        overscanRowCount={TABLE_PRESCAN_ROWS}
        renderItem={renderItemFunc}
      />
      {/* <MarketHistoryEmptyMessage /> */}
    </div>
  );
};
