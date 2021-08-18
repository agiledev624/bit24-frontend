import { tradeInitliazed, TRADE_INIT } from "@/actions/trade.actions";
import { makeRequest } from "@/exports";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { filter, map, switchMap, withLatestFrom } from "rxjs/operators";

export const initTradeEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<any>
) =>
  action$.pipe(
    ofType(TRADE_INIT),
    withLatestFrom(state$),
    filter(([_, state]) => !state.trade.initialized),
    map(([action]) => action.payload),
    switchMap((payload: any) => makeRequest("trades", { params: payload })),
    filter(({ error }) => !error),
    map((data) => tradeInitliazed(data))
  );
