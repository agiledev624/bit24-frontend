import { webSocket } from "rxjs/webSocket";
import {
  map,
  switchMap,
  take,
  takeUntil,
  tap,
  filter,
  catchError,
  skipUntil,
  delay,
  ignoreElements,
  withLatestFrom,
} from "rxjs/operators";
import {
  of,
  Subject,
  merge,
  race,
  timer,
  EMPTY,
  interval,
  iif,
  Observable,
} from "rxjs";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import {
  WS_OPEN,
  WS_REQUEST_AUTH,
  WS_DISCONNECTED,
  WS_ON_MESSAGE,
  WS_SEND,
  closeWs,
  sendWsData,
  establishWsConn,
  WS_REQUEST_CLOSE,
  WS_REQUEST_SUBSCRIBE,
  WS_REQUEST_UNSUBSCRIBE,
  WS_UNAUTH,
  requestAuthWs,
  sendSubscribe,
  openWs,
  wsDisconnected,
} from "@/actions/ws.actions";
import { Action } from "@/models/action";
import {
  DisonnectedParams,
  SubscribeParams,
  WsActionType,
  WsAuthenticatedParams,
} from "@/models/ws-action-types";
import { SingletonWSManager } from "@/internals";
import { ClientLoginManner } from "@/packets/client-login.packet";
import { WebSocketKindStateEnum } from "@/constants/websocket.enums";
import { wsCollectionSelector } from "@/selectors/ws.selectors";

type ReduxObservableStreamType = (action$) => Observable<any>;
interface StreamingParams {
  url: string;
  id: number;
  reconn: boolean;
  binaryType: boolean;
  subTransformer?: ({ params, requestId }) => any;
  unsubTransformer?: ({ params, requestId }) => any;
  onMessageTransformer?: (evt) => any;
  sendMessageTransformer?: (payload) => any;
}

const defaultTransformer = ({ params, requestId }) => ({ params, requestId });

export class StreamingWS {
  public isCreated: boolean = false;

  private websocketSubject;
  private wsOpenSubject = new Subject<any>();
  private wsCloseSubject = new Subject<CloseEvent>();

  // private channelToSubscriberMap: Map<string, Subscription> = new Map<string, Subscription>();
  // private channelToIdMap: Map<string, number> = new Map<string, number>();

  private _url: string;
  private _reconn: boolean;
  private _id: number;
  private _binaryType: boolean;

  private _subTransformer = defaultTransformer;
  private _unsubTransformer = defaultTransformer;
  private _onMessageTransformer = (evt) => evt;
  private _sendMessageTransformer = (payload) => payload;

  public constructor({
    url,
    id,
    reconn,
    binaryType = false,
    subTransformer,
    unsubTransformer,
    onMessageTransformer,
    sendMessageTransformer,
  }: StreamingParams) {
    this._url = url;
    this._reconn = reconn;
    this._id = id;
    this._binaryType = binaryType;

    if (subTransformer) {
      this._subTransformer = subTransformer;
    }
    if (unsubTransformer) {
      this._unsubTransformer = unsubTransformer;
    }
    if (onMessageTransformer) {
      this._onMessageTransformer = onMessageTransformer;
    }
    if (sendMessageTransformer) {
      this._sendMessageTransformer = sendMessageTransformer;
    }
  }

  public connect(action$, state$: StateObservable<any>) {
    if (this.websocketSubject) return;
    const pingTimeout = 45 * 1000;
    // after 10s if there is no response from server and `autoCloseIfThereIsNoPong` === true => close connection
    const pongTimeout = 10 * 1000;
    const reconnectInterval = 10 * 1000;

    console.warn(`------initalizing ws ${this._id}.....--------`);

    let wsConfig: any = {
      url: this._url,
      openObserver: this.wsOpenSubject,
      closeObserver: this.wsCloseSubject,
    };

    if (this._binaryType) {
      wsConfig = {
        ...wsConfig,
        binaryType: "arraybuffer",
        serializer: (value: any) => {
          for (
            var b = new Int8Array(value.length), d = 0;
            d < value.length;
            d++
          )
            b[d] = value[d];
          return b.buffer;
        },
        deserializer: ({ data }) => {
          return new Uint8Array(data);
        },
      };
    }

    this.websocketSubject = webSocket(wsConfig);

    const open$ = this.wsOpenSubject.pipe(
      take(1),
      withLatestFrom(state$),
      map(([, state]) => ({
        username: state.user.username,
        accountId: state.user.accountId,
      })),
      tap(() => {
        this.isCreated = true;
      }),
      map(({ username, accountId }) => {
        const isLoggedIn = !SingletonWSManager.isMarketWsById(this._id);
        if (isLoggedIn) {
          // sent auth
          const loginData = {
            accountId,
            username,
            sendingTime: Date.now(),
          };
          // const isLoggedIn = token && SingletonWSManager.isOrderWsById(this._id);
          return of(
            // socket opened already, just in order to update states
            openWs({ id: this._id }),
            requestAuthWs({ data: loginData, id: this._id })
          );
        } else {
          return of(openWs({ id: this._id }));
        }
        // // console.log('[stream dataaaaaaa]>>>>>>>>>', isLoggedIn);
        // return !isLoggedIn ? of(
        //   openWs({ id: this._id })
        // ) : of(
        //   openWs({ id: this._id }),
        //   requestAuthWs({ token, id: this._id })
        // );
      })
    );

    const beforeClose$ = this.wsCloseSubject.pipe(
      take(1),
      map((closeEvent: CloseEvent) => {
        this.websocketSubject = null;
        this.isCreated = false;
        console.log("closing id", this._id);
        SingletonWSManager.removeInstance(this._id);

        return of(wsDisconnected({ id: this._id, errorCode: closeEvent.code }));
      })
    );

    // @todo limit reconnect attempts
    const retryConn$ = this._createRetryConnStream(reconnectInterval)(action$);
    const write$ = this._createWriteStream(this.websocketSubject)(action$);
    const message$ = this._createMessageStream(
      this.websocketSubject,
      this._onMessageTransformer
    )(action$);
    const subscribers$ = this._createSubscribeStream(this._subTransformer)(
      action$
    );
    const unsubscribers$ = this._createUnsubscribeStream(
      this._unsubTransformer
    )(action$);
    //tmp comment
    // const heartbeat$ = this._createHeartBeatStream(pingTimeout, pongTimeout)(action$);
    const close$ = this._createCloseStream(this.websocketSubject)(action$);
    //tmp comment
    const auth$ = this._createAuthStream(action$, state$);
    // const unauth$ = this._createUnauthStream(action$, state$);

    return merge(
      open$,
      auth$,
      beforeClose$,
      message$,
      write$,
      retryConn$,
      subscribers$,
      unsubscribers$,
      close$
    );
  }

  private _createMessageStream(
    wsSubject,
    messageTransformer
  ): ReduxObservableStreamType {
    return (action$) =>
      wsSubject.pipe(
        takeUntil(this._stopStream(action$)),
        map((evt: any) => {
          // {result, id}
          return of({
            type: WS_ON_MESSAGE,
            payload: messageTransformer(evt),
            _id: this._id,
          });
        }),
        catchError((error) => {
          console.error("socket error", error);
          return EMPTY;
        })
      );
  }

  private _createWriteStream(wsSubject): ReduxObservableStreamType {
    return (action$) =>
      action$.ofType(WS_SEND).pipe(
        takeUntil(this._stopStream(action$)),
        filter((action: WsActionType<any>) => {
          const { id } = action;
          return id === this._id && !!wsSubject;
        }),
        tap((action: WsActionType<any>) => {
          // otherwise send next message to server
          wsSubject.next(this._sendMessageTransformer(action.payload));
        }),
        ignoreElements()
      );
  }

  private _createSubscribeStream(subTransformer): ReduxObservableStreamType {
    return (action$) =>
      action$.pipe(
        ofType(WS_REQUEST_SUBSCRIBE),
        filter(this._wsIdentify),
        map((action: Action<SubscribeParams>) =>
          of({
            type: WS_SEND,
            payload: subTransformer(action.payload),
            id: this._id,
          })
        )
      );
  }

  private _createUnsubscribeStream(
    unsubTransformer
  ): ReduxObservableStreamType {
    return (action$) =>
      action$.pipe(
        ofType(WS_REQUEST_UNSUBSCRIBE),
        filter(this._wsIdentify),
        map((action: Action<SubscribeParams>) =>
          of({
            type: WS_SEND,
            payload: unsubTransformer(action.payload),
            id: this._id,
          })
        )
      );
  }

  private _createRetryConnStream(
    reconnectInterval: number
  ): ReduxObservableStreamType {
    return (action$) =>
      action$.pipe(
        ofType(WS_DISCONNECTED),
        filter(this._wsIdentify),
        // retryWhen(errors => errors.pipe(
        //   delay(delayInMs),
        //   take(attempts),
        // )),
        // timeout(totalTimeout)
        take(1),
        switchMap((action: WsActionType<DisonnectedParams>) =>
          iif(
            () => {
              const errorCode = action.payload && action.payload.errorCode;
              // removed from manager
              SingletonWSManager.removeInstance(this._id);

              console.warn(
                "needReconn && errorCode !== 1000",
                this._reconn,
                errorCode,
                this._id
              );
              return this._reconn && errorCode !== 1000;
            },
            of(
              establishWsConn({
                id: this._id,
                reconn: this._reconn,
                url: this._url,
              })
            ).pipe(
              tap(() =>
                console.log(`[ws] retry connection after ${reconnectInterval}s`)
              ),
              delay(reconnectInterval),
              map((o) => of(o)),
              tap(() => console.log("[ws] retry ends"))
            ),
            EMPTY
          )
        )
      );
  }

  private _stopStream(action$): Observable<any> {
    return action$.pipe(ofType(WS_DISCONNECTED), filter(this._wsIdentify));
  }

  private _createHeartBeatStream(
    pingTimeout: number,
    pongTimeout: number
  ): ReduxObservableStreamType {
    return (action$) => {
      // const ignore$ = action$.pipe(
      //   ofType(WS_ON_MESSAGE),
      //   switchMap(() => merge(of(true), of(false).pipe(delay(pingTimeout)))),
      // );
      // @todo, stop emits ping intervally, just emits if after xx timeouts + there is no WS_ON_MESSAGE
      const ping$ = interval(pingTimeout).pipe(
        skipUntil(action$.ofType(WS_OPEN).pipe(filter(this._wsIdentify))),
        takeUntil(this._stopStream(action$)),
        map(() => of(this._sendData({ event: "ping" }))),
        tap(() =>
          console.log(`[ws ${this._id}] ping sent after ${pingTimeout}s`)
        )
      );

      const terminate$ = timer(pongTimeout).pipe(
        takeUntil(this._stopStream(action$)),
        map(() => of(closeWs({ id: this._id, reconn: this._reconn }))),
        tap(() =>
          console.log(`[ws ${this._id}] disposed after ${pongTimeout}s`)
        )
      );

      const isPongMessage$ = action$.pipe(
        ofType(WS_ON_MESSAGE),
        filter(
          (action: any) => action.payload && action.payload.event === "pong"
        ),
        tap(() => console.log(`[ws ${this._id}] action message$ pong found`)),
        map(() => EMPTY)
      );

      const pongOrTerminate$ = action$.pipe(
        ofType(WS_SEND),
        filter(
          (action: any) => action.payload && action.payload.event === "ping"
        ),
        switchMap(() => race(terminate$, isPongMessage$))
      );

      // heartbeat
      return merge(pongOrTerminate$, ping$);
    };
  }
  private _createCloseStream(wsSubject) {
    return (action$) =>
      action$.pipe(
        ofType(WS_REQUEST_CLOSE),
        filter(this._wsIdentify),
        tap((action: any) => {
          const reconn = action.payload.reconn;
          console.log("reconn", reconn);
          if (reconn !== undefined) {
            this._reconn = reconn;
          }
          wsSubject.unsubscribe();
        }),
        ignoreElements()
      );
  }

  // auth stream
  private _createAuthStream(
    action$: ActionsObservable<any>,
    state$: StateObservable<any>
  ) {
    return action$.pipe(
      ofType(WS_REQUEST_AUTH),
      filter(this._wsIdentify),
      tap((action) => console.log("create auth streammmmmm", action)),
      takeUntil(this._stopStream(action$)),
      withLatestFrom(state$),
      filter(
        ([, state]) =>
          wsCollectionSelector(state)[this._id] !==
          WebSocketKindStateEnum.AUTHORIZED
      ),
      map(
        ([action]: [WsActionType<WsAuthenticatedParams>, any]) =>
          action.payload.data
      ),
      map((data) => {
        const dataBuffer = ClientLoginManner.send(data);

        return of(this._sendData(dataBuffer));
      })
    );
  }

  private _sendData(payload: any) {
    return sendWsData(this._id, payload);
  }

  // unath stream
  private _createUnauthStream(
    action$: ActionsObservable<any>,
    state$: StateObservable<any>
  ) {
    return action$.pipe(
      ofType(WS_UNAUTH),
      filter(this._wsIdentify),
      takeUntil(this._stopStream(action$)),
      withLatestFrom(state$),
      filter(([, state]) => state.ws.isAuthenticated),
      map(
        ([action]: [WsActionType<WsAuthenticatedParams>, any]) =>
          action.payload.data
      ),
      //@todo
      map((token) => of(this._sendData({ event: "unauth", token })))
    );
  }

  private _wsIdentify = (action: WsActionType<any>) => {
    const { id } = action;
    return id === this._id;
  };
}
