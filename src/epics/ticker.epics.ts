import {
  TICKER_INIT,
  TICKER_INITIALIZED,
  GET_TICKER_FUTURE,
  updateFutureTicker,
  INSTRUMENT_REQUEST,
} from "@/actions/ticker.actions";
import { sendWsData } from "@/actions/ws.actions";
import { AppTradeType } from "@/constants/trade-type";
import { WebSocketKindEnum } from "@/constants/websocket.enums";
import { makeRequest } from "@/exports";
import {
  InstrumentRequestManner,
  InstrumentRequestType,
} from "@/packets/instrument.packet";
import { dailyChangeToTicker } from "@/transformers/symbol-to-ticker-config.transformer";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { filter, map, switchMap, withLatestFrom } from "rxjs/operators";

export const initTickerEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<any>
) =>
  action$.pipe(
    ofType(TICKER_INIT),
    withLatestFrom(state$),
    filter(([_, state]) => !state.ticker.initialized),
    switchMap(() => makeRequest("ticker/24hr")),
    filter(({ error }) => !error),
    map((data) => {
      return {
        type: TICKER_INITIALIZED,
        payload: data
          .slice(0, 200)
          .filter(({ count }) => !!count)
          .map(dailyChangeToTicker),
      };
    })
  );

export const getFutureTickerEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<any>
) =>
  action$.pipe(
    ofType(GET_TICKER_FUTURE),
    switchMap((action: any) =>
      makeRequest("premiumIndex", {
        params: { symbol: action.payload },
        tradeType: AppTradeType.DERIVATIVE,
      })
    ),
    filter(({ error }) => !error),
    map((data) => updateFutureTicker(data))
  );

export const instrumentRequestEpic = (action$, state$) =>
  action$.pipe(
    ofType(INSTRUMENT_REQUEST),
    withLatestFrom(state$),
    //@ts-ignore
    map(([action, state]) => {
      const instrumentRequestData = {
        type: InstrumentRequestManner.messageType,
        accountId: state.user.accountId,
        sendingTime: Date.now(),
        requestType: InstrumentRequestType.ALL,
        symbolType: action.payload,
      };

      const data = InstrumentRequestManner.send(instrumentRequestData);
      console.log(
        "sending request for walletType",
        action.payload,
        "data",
        data
      );

      return sendWsData(WebSocketKindEnum.ORDERS, data);
    })
  );
