import {
  switchMap,
  mergeMap,
  filter,
  catchError,
  map,
  tap,
  ignoreElements,
  withLatestFrom,
  bufferTime,
  take,
  delay,
} from "rxjs/operators";
import { throwError, EMPTY } from "rxjs";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { WS_CONNECT } from "@/actions/ws.actions";
import { StreamingWS } from "./socket.stream.class";
import {
  WebSocketKindEnum,
  WebSocketKindStateEnum,
} from "@/constants/websocket.enums";
import { WsActionType, WsConnectParams } from "@/models/ws-action-types";
import { wsCollectionSelector } from "@/selectors/ws.selectors";
import { SingletonWSManager } from "@/internals";

function defaultSubTransformer({ requestId, params }) {
  return {
    method: "SUBSCRIBE",
    params: [params],
    id: requestId,
  };
}

function defaultUnsubTransformer({ requestId, params }) {
  return {
    method: "UNSUBSCRIBE",
    params: [params],
    id: requestId,
  };
}

export const initWSStream =
  (
    wsId: WebSocketKindEnum,
    {
      subTransformer = defaultSubTransformer,
      unsubTransformer = defaultUnsubTransformer,
      isBinary = true,
    } = {}
  ) =>
  (action$: ActionsObservable<any>, state$: StateObservable<any>) =>
    action$.pipe(
      ofType(WS_CONNECT),
      tap((action) => console.log("[connect] init stream" + wsId)),
      filter(
        (action) => action.id === wsId && !SingletonWSManager.hasInstance(wsId)
      ),
      map((action: WsActionType<WsConnectParams>) => {
        const { id } = action;
        const { url, reconn } = action.payload;
        console.log(
          "[connect] setting ws stream",
          "id:",
          id,
          "url:",
          url,
          "reconn",
          reconn
        );
        const ws$ = new StreamingWS({
          url,
          id,
          reconn,
          subTransformer,
          unsubTransformer,
          binaryType: isBinary,
        });
        SingletonWSManager.registerInstance(id, url);

        return ws$;
      }),
      filter((ws) => !ws.isCreated),
      switchMap((ws) => {
        if (ws.isCreated) {
          return throwError("Attempted to connect to opened ws:");
        }

        return ws.connect(action$, state$);
      }),
      //@ts-ignore
      mergeMap((v) => v),
      catchError((e) => {
        console.error(">>> e", e);
        return EMPTY;
      })
    );
