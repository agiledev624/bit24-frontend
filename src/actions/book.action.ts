import { OrderBookDepthLimitEnum } from "@/constants/order-book-enums";
import { BookData } from "@/models/book.model";
import { convertToBookData } from "@/transformers/book.transformer";

export const BOOK_INIT = "@book/INIT";
export const BOOK_INITIALIZED = "@book/INITIALIZED";
export const BOOK_RECEIVED_UPDATE = "@book/RECEIVED_UPDATE";

export function initBook({ symbol, limit = OrderBookDepthLimitEnum.LVL3 }) {
  return {
    type: BOOK_INIT,
    payload: { symbol, limit },
  };
}

interface BookInitializedParams {
  bids: BookData;
  asks: BookData;
  lastUpdateId: number;
}

export function bookInitialized({
  bids,
  asks,
  lastUpdateId,
}: BookInitializedParams) {
  return {
    type: BOOK_INITIALIZED,
    payload: { bids, asks, lastUpdateId },
  };
}

// {
//   "lastUpdateId": 1027024,
//   "bids": [
//     [
//       "4.00000000",     // PRICE
//       "431.00000000"    // QTY
//     ]
//   ],
//   "asks": [
//     [
//       "4.00000200",
//       "12.00000000"
//     ]
//   ]
// }
export function bookUpdate({ bids, asks, lastUpdateId }) {
  return {
    type: BOOK_RECEIVED_UPDATE,
    payload: {
      asks: convertToBookData(asks),
      bids: convertToBookData(bids),
      lastUpdateId,
    },
  };
}

export function bookUpdate2({ bids, asks, lastUpdateId }) {
  return {
    type: BOOK_RECEIVED_UPDATE,
    payload: {
      asks,
      bids,
      lastUpdateId,
    },
  };
}
