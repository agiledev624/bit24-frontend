import { bookInitialized, BOOK_INIT } from "@/actions/book.action";
import { makeRequest } from "@/exports";
import { convertToBookData, toRawBook } from "@/transformers/book.transformer";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { distinctUntilChanged, filter, map, switchMap } from "rxjs/operators";

export const initBookEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<any>
) =>
  action$.pipe(
    ofType(BOOK_INIT),
    map((action) => action.payload),
    distinctUntilChanged(
      (prevPayload, payload) =>
        payload.symbol === prevPayload.symbol &&
        payload.limit === prevPayload.limit
    ),
    switchMap((payload) => makeRequest("depth", { params: payload })), // payload: {symbol, limit}
    filter(({ error }) => !error),
    map((data) => {
      const { lastUpdateId, asks, bids } = data;

      // const b =  [
      //   { price: 10871.5, size: 980924 },
      //   { price: 10872.0, size: 1427 },
      //   { price: 10872.5, size: 17499 },
      //   { price: 10873.0, size: 512 },
      //   { price: 10873.5, size: 5000 },
      //   { price: 10874.0, size: 3264 },
      //   { price: 10874.5, size: 3003 },
      //   { price: 10875.0, size: 312 },
      //   { price: 10875.5, size: 3213 },
      // ];

      // const a = [
      //   { price: 10867.0, size: 3542 },
      //   { price: 10867.5, size: 23542 },
      //   { price: 10868.0, size: 53542 },
      //   { price: 10868.5, size: 1153 },
      //   { price: 10869.0, size: 17590 },
      //   { price: 10869.5, size: 40036 },
      //   { price: 10870.0, size: 94611 },
      //   { price: 10870.5, size: 20528 },
      //   { price: 10871.0, size: 936853 },
      // ]

      return bookInitialized({
        asks: convertToBookData(asks),
        bids: convertToBookData(bids),
        lastUpdateId,
      });
    })
  );
