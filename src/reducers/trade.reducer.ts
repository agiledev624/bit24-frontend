import { TradeItemModel } from "@/models/trade.model";
import _isArray from "lodash/isArray";
import {
  TRADE_INIT,
  TRADE_INITIALIZED,
  TRADE_RECEIVED_UPDATE,
} from "@/actions/trade.actions";
import { EMPTY_ARRAY } from "@/exports";
import { WS_REQUEST_UNSUBSCRIBE } from "@/actions/ws.actions";

const LIMIT_ITEMS = 150;

interface TradeState {
  initialized: boolean;
  items: TradeItemModel[];
}

const initialState: TradeState = {
  initialized: false,
  items: EMPTY_ARRAY,
};

export function tradeReducer(state: TradeState = initialState, action) {
  switch (action.type) {
    case TRADE_INIT: {
      return {
        ...state,
        items: EMPTY_ARRAY,
        initialized: false,
      };
    }
    case TRADE_INITIALIZED: {
      const data = action.payload;

      return {
        ...state,
        initialized: true,
        items: data,
      };
    }
    case TRADE_RECEIVED_UPDATE: {
      const payload = action.payload;
      if (!_isArray(payload)) {
        return state;
      }

      const items = payload.concat(
        ...state.items.slice(0, LIMIT_ITEMS - payload.length)
      );

      return {
        ...state,
        items,
      };
    }
    // TICKER_UPDATE
    default:
      return state;
  }
}
