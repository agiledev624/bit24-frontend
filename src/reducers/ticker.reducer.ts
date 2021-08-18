import {
  TICKER_FUTURE_UPDATE,
  TICKER_INITIALIZED,
  INSTRUMENT_RECEIVED_UPDATE,
  TICKER_RECEIVED_UPDATE,
  INSTRUMENT_REQUEST,
} from "@/actions/ticker.actions";
import { EMPTY_ARRAY, EMPTY_OBJ } from "@/exports";
import { Instrument } from "@/models/instrument.model";
import { TickerState } from "@/models/ticker-state.model";
import { TickerMarkPriceModel, TickerModel } from "@/models/ticker.model";
import _isArray from "lodash/isArray";
import _set from "lodash/set";

const initialState: TickerState = {
  items: EMPTY_ARRAY,
  instruments: EMPTY_OBJ,
  instrumentLoaded: false,
};

export function tickerReducer(state: TickerState = initialState, action) {
  switch (action.type) {
    case INSTRUMENT_REQUEST: {
      return {
        ...state,
        instrumentLoaded: false,
      };
    }
    case INSTRUMENT_RECEIVED_UPDATE: {
      const instrument = action.payload.instrument as Instrument;
      const instrumentLoaded = action.payload.finished;

      const instruments = _set(
        { ...state.instruments },
        [instrument.symbolEnum],
        instrument
      );

      return {
        ...state,
        instruments,
        instrumentLoaded: instrumentLoaded,
      };
    }
    case TICKER_RECEIVED_UPDATE: {
      const payload = action.payload;
      if (_isArray(payload)) {
        return state;
      }

      const items = state.items.map((item: TickerModel) => {
        if (payload[item.ccy]) {
          return {
            ...item,
            ...payload[item.ccy],
          };
        }

        return item;
      });

      return {
        ...state,
        items,
      };
    }
    case TICKER_FUTURE_UPDATE: {
      const markTicker = action.payload as TickerMarkPriceModel;

      const items = state.items.map((item: TickerModel) => {
        if (markTicker.symbol === item.ccy) {
          return {
            ...item,
            markPrice: +markTicker.markPrice,
            indexPrice: +markTicker.indexPrice,
            lastFundingRate: +markTicker.lastFundingRate,
            nextFundingRate: +markTicker.nextFundingRate,
            interestRate: +markTicker.interestRate,
          };
        }

        return item;
      });

      return {
        ...state,
        items,
      };
    }
    case TICKER_INITIALIZED: {
      const items = action.payload;

      return {
        ...state,
        initialized: true,
        items,
      };
    }
    // TICKER_UPDATE
    default:
      return state;
  }
}
