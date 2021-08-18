import { BookData, OrderBookModel } from "@/models/book.model";
import { bookDataToArray } from "@/transformers/book.transformer";
import { createSelector } from "reselect";

const _getBookState = (state) => state.book;

const getBidsObject = createSelector<any, any, BookData>(
  _getBookState,
  (book) => book.bids
);

const getAsksObject = createSelector<any, any, BookData>(
  _getBookState,
  (book) => book.asks
);

export const getBidsSelector = createSelector<any, BookData, OrderBookModel[]>(
  getBidsObject,
  (bids) => {
    return bookDataToArray(bids as BookData, true);
  }
);

export const getAsksSelector = createSelector<any, BookData, OrderBookModel[]>(
  getAsksObject,
  (asks) => {
    return bookDataToArray(asks, false);
  }
);

export const getBookMaxSumsize = createSelector<any, OrderBookModel[], number>(
  [getBidsSelector, getAsksSelector],
  (bids, asks) => {
    const maxBid = (bids[bids.length - 1] || {}).sumSize || 0;
    const maxAsk = (asks[asks.length - 1] || {}).sumSize || 0;

    const maxSumSize = Math.max(+maxBid, +maxAsk);

    return maxSumSize;
  }
);

export const isBookLoaded = createSelector(
  _getBookState,
  (book) => book.initialized
);
