import React, { useState } from "react";
import cn from "classnames";
import {
  NumberFormatExtent,
  NumberFormat,
  Icon,
  IconButton,
} from "@/ui-components";
import TrendLine from "@/components/TrendLine";
import ArrowUp from "@/ui-components/icons/arrow-up";
import ArrowDown from "@/ui-components/icons/arrow-down";
interface MarketItemProps {
  pair?: string;
  amount: number;
  tradeType: string;
  price: number;
  percent: number;
  series: any[];
  hideColumns: string[];
  isPopup?: boolean;
}

export const Item = React.memo(
  ({
    pair,
    amount,
    tradeType,
    price,
    percent,
    series,
    hideColumns,
    isPopup = false,
  }: MarketItemProps) => {
    // const priceDecimals = getPriceDecimals(symbol);
    // const amountDecimals = getAmountDecimals(symbol);
    const [favorite, setFavorite] = useState(true);
    const onClick = () => {
      setFavorite((prev) => !prev);
    };

    const displayHighLow = !hideColumns.includes("high_low");

    return (
      <div
        className={cn("e-markets-list-item-wrapper", { "popup-mode": isPopup })}
      >
        <div className="list-item">
          <div className={cn("pair__vol", { high_low: displayHighLow })}>
            <IconButton
              cssmodule="fa"
              id="star"
              classes={cn("font-size-9", {
                "text--blue-40": favorite,
                "text--cool-grey-50": !favorite,
              })}
              style={{ width: "20px !important", height: "20px !important" }}
              onClick={onClick}
            />

            <div className="d-flex d-flex-direction-column pl-2">
              <div className="pair-title">{pair}</div>
              <NumberFormatExtent decimals={2} number={percent} suffix="%" />
            </div>
          </div>
          <div className={cn("price__percent", { high_low: displayHighLow })}>
            <NumberFormat
              decimals={8}
              number={price}
              classes="text--cool-grey-30 font-size-13"
            />
            {/* <NumberFormat
              number={amount}
              decimals={2}
              classes={"text--cool-grey-50 font-size-12"}
            /> */}
          </div>
          <div className={cn("chart__24", { high_low: displayHighLow })}>
            <TrendLine width={76} height={32} data={series} />
          </div>
          {(displayHighLow || isPopup) && (
            <div className="high_low_col">
              <div className="slider-shape">
                <div className="slider-shape-active" style={{ width: "22%" }}></div>
                <div className="slider-shape-ball" style={{ left: "22%" }}></div>
              </div>
              <div className="high_low_numbers">
                <NumberFormat
                  decimals={8}
                  number={price}
                  classes="text--cool-grey-30 font-size-13"
                />
                <NumberFormat
                  decimals={8}
                  number={price}
                  classes="text--cool-grey-30 font-size-13"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export const SORT_TYPE = {
  SYMBOLS_ASC: 1,
  SYMBOLS_DESC: 2,
  PERCENT_ASC: 3,
  PERCENT_DESC: 4,
  PRICE_ASC: 5,
  PRICE_DESC: 6,
};

export const MarketHeader = ({ sort, setSort, hideColumns, isPopup }) => {
  const toggleSortSymbols = () => {
    if (sort === SORT_TYPE.SYMBOLS_ASC) {
      setSort(SORT_TYPE.SYMBOLS_DESC);
    } else if (sort === SORT_TYPE.SYMBOLS_DESC) {
      setSort(SORT_TYPE.SYMBOLS_ASC);
    } else {
      setSort(SORT_TYPE.SYMBOLS_ASC);
    }
  };

  const toggleSortPercent = () => {
    if (sort === SORT_TYPE.PERCENT_ASC) {
      setSort(SORT_TYPE.PERCENT_DESC);
    } else if (sort === SORT_TYPE.PERCENT_DESC) {
      setSort(SORT_TYPE.PERCENT_ASC);
    } else {
      setSort(SORT_TYPE.PERCENT_ASC);
    }
  };

  const toggleSortPrice = () => {
    if (sort === SORT_TYPE.PRICE_ASC) {
      setSort(SORT_TYPE.PRICE_DESC);
    } else if (sort === SORT_TYPE.PRICE_DESC) {
      setSort(SORT_TYPE.PRICE_ASC);
    } else {
      setSort(SORT_TYPE.PRICE_ASC);
    }
  };

  const displayHighLow = !hideColumns.includes("high_low");

  return (
    <div className="e-markets-header">
      <div className={cn("pair", { high_low: displayHighLow })}>
        {sort === SORT_TYPE.SYMBOLS_ASC && (
          <ArrowUp className="e-markets-header__arrow" />
        )}
        {sort === SORT_TYPE.SYMBOLS_DESC && (
          <ArrowDown className="e-markets-header__arrow" />
        )}
        <span
          onClick={toggleSortSymbols}
          className={cn({
            "e-markets-header__sort":
              sort === SORT_TYPE.SYMBOLS_ASC || sort === SORT_TYPE.SYMBOLS_DESC,
          })}
        >
          Symbols/
        </span>
        {sort === SORT_TYPE.PERCENT_ASC && (
          <ArrowUp className="e-markets-header__arrow" />
        )}
        {sort === SORT_TYPE.PERCENT_DESC && (
          <ArrowDown className="e-markets-header__arrow" />
        )}
        <span
          onClick={toggleSortPercent}
          className={cn({
            "e-markets-header__sort":
              sort === SORT_TYPE.PERCENT_ASC || sort === SORT_TYPE.PERCENT_DESC,
          })}
        >
          24H %
        </span>
      </div>
      <div
        onClick={toggleSortPrice}
        className={cn("price", {
          high_low: displayHighLow,
          "e-markets-header__sort":
            sort === SORT_TYPE.PRICE_ASC || sort === SORT_TYPE.PRICE_DESC,
        })}
      >
        {sort === SORT_TYPE.PRICE_ASC && (
          <ArrowUp className="e-markets-header__arrow" />
        )}
        {sort === SORT_TYPE.PRICE_DESC && (
          <ArrowDown className="e-markets-header__arrow" />
        )}
        <span>Last Price</span>
      </div>
      <div className={cn("chart", { high_low: displayHighLow })}>
        <span>24H Chart</span>
      </div>
      {displayHighLow && (
        <div className="high_low_col">
          <span>24H High/Low</span>
        </div>
      )}
    </div>
  );
};
