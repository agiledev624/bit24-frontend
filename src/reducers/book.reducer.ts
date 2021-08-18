import { BOOK_INITIALIZED, BOOK_RECEIVED_UPDATE } from "@/actions/book.action";
import { WS_REQUEST_UNSUBSCRIBE } from "@/actions/ws.actions";
import { EMPTY_OBJ } from "@/exports";
import { BookData } from "@/models/book.model";

interface BookReducerState {
  bids: BookData;
  asks: BookData;
  lastUpdateId: number;
}

const initialState: BookReducerState = {
  bids: EMPTY_OBJ,
  asks: EMPTY_OBJ,
  lastUpdateId: 0,
};

/**
 * @param {} state
 * @param {*} action
 */
export function bookReducer(state: BookReducerState = initialState, action) {
  switch (action.type) {
    case BOOK_INITIALIZED: {
      const { bids, asks, lastUpdateId } = action.payload;

      return {
        ...state,
        bids,
        asks,
        lastUpdateId,
      };
    }
    case BOOK_RECEIVED_UPDATE: {
      const { lastUpdateId } = action.payload;

      if (lastUpdateId < state.lastUpdateId) return state;

      const { bids, asks } = action.payload;

      return {
        ...state,
        bids,
        asks,
        lastUpdateId,
      };
    }
    default:
      return state;
  }
}
