import {
  switchMap,
  filter,
  map,
  tap,
  ignoreElements,
  take,
} from "rxjs/operators";
import { EMPTY, of } from "rxjs";
import { ActionsObservable, ofType } from "redux-observable";
import { wsAuthenticated, WS_ON_MESSAGE } from "@/actions/ws.actions";
import {
  PacketHeaderMessageType,
  WebSocketKindEnum,
} from "@/constants/websocket.enums";
import { tickerUpdate2, updateInstrument } from "@/actions/ticker.actions";
import { tradeUpdate2 } from "@/actions/trade.actions";
import { bookUpdate2 } from "@/actions/book.action";
import { ChartSubject } from "@/components/chart";
import { PacketReader, SingletonWSManager } from "@/internals";
import { updateSocketUrlEntries } from "@/actions/app.actions";
import { initWSStream } from "@/exports/streams/socket/create-socket-stream";
import {
  wsOnMessageObservable$,
  wsOnMessageSrc$,
} from "@/exports/streams/socket/on-message.subject";
import { fromWorker } from "@/exports/streams/rx-worker";
//@ts-ignore
import TestWorker from "@/internals/workers/file.worker.js";
import { ClientLoginManner } from "@/packets/client-login.packet";
import { TransactionManner } from "@/packets/transaction.packet";
import { MessageType } from "@/constants/order-enums";
import { newOrderAccepted, orderUpdated } from "@/actions/order.actions";
import { RiskSymbolManner } from "@/packets/user-risk.packet";
import { updateUserInfo } from "@/actions/auth.actions";
import {
  InstrumentManner,
  InstrumentResponseType,
} from "@/packets/instrument.packet";
import { initInstrument } from "@/exports/ticker.utils";

export const wsOnAdminRiskMessageEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(WS_ON_MESSAGE),
    filter((action) => SingletonWSManager.isRiskAdminWsById(action._id)),
    switchMap((action) => {
      const data = action.payload;
      const wsId = action._id;

      const reader = new PacketReader(data);
      const msgType = reader.getMessageType();
      console.log("[ws epic] >>>> msgType", msgType);

      switch (msgType) {
        case PacketHeaderMessageType.CLIENT_LOGIN: {
          const serverInfo = ClientLoginManner.read(data);
          console.log(
            "ClientLoginManner.read(data);",
            ClientLoginManner.read(data)
          );

          SingletonWSManager.addWs(
            `ws://${serverInfo.orderEntryIp1}`,
            WebSocketKindEnum.ORDERS
          );
          // SingletonWSManager.addWs(`ws://123.321.122:123`, WebSocketKindEnum.ORDERS);
          // SingletonWSManager.addWs(`ws://123.321.112:123`, WebSocketKindEnum.MARKET);
          // SingletonWSManager.addWs(`ws://123.321.121:123`, WebSocketKindEnum.MARKET);

          const saveEntries = SingletonWSManager.getUrlEntries();

          SingletonWSManager.acceptEntries();
          return of(updateSocketUrlEntries(saveEntries), wsAuthenticated(wsId));
        }
        default: {
          return EMPTY;
        }
      }
      // wsOnMessageSrc$.next(data);
    })
  );

export const wsOnMessageEpic = (action$: ActionsObservable<any>, state$) =>
  action$.pipe(
    ofType(WS_ON_MESSAGE),
    filter((action) => SingletonWSManager.isOrderWsById(action._id)),
    // bufferTime(200),
    // filter(batch => batch.length > 0),
    // take(2),
    switchMap((action) => {
      const data = action.payload;
      const wsId = action._id;

      const reader = new PacketReader(data);
      const msgType = reader.getMessageType();
      console.log("[ws epic] >>>> msgType", msgType);

      switch (msgType) {
        // risk symbol returns automatically after logon
        case PacketHeaderMessageType.RISK_USER_SYMBOL: {
          const userSymbols = RiskSymbolManner.read(data);
          console.log("RiskSymbolManner.read(data);", userSymbols);

          return of(updateUserInfo(userSymbols), wsAuthenticated(wsId));
        }
        case PacketHeaderMessageType.TRANSACTION: {
          const orderRaw = TransactionManner.read(data);
          const { rejectReason, orderMessageType, ...order } = orderRaw;

          console.warn(
            "[TRANSACTION]",
            orderRaw,
            "ordermessageType",
            orderMessageType
          );

          if (rejectReason) {
            console.error("order rejected >>>>", rejectReason);
            return EMPTY;
          }

          if (orderMessageType === MessageType.ORDER_ACK) {
            return of(newOrderAccepted(order));
          } else {
            return of(orderUpdated(orderMessageType, order));
          }
        }
        case PacketHeaderMessageType.INSTRUMENT: {
          const instrumentReader = InstrumentManner.read(data);
          console.log("instrumentReader", instrumentReader);
          const responseType = instrumentReader.responseType;
          const instrument = {
            minSize: instrumentReader.minSize,
            maxSize: instrumentReader.maxSize,
            priceIncrement: instrumentReader.priceIncrement,
            symbolEnum: instrumentReader.symbolEnum,
            symbol: instrumentReader.symbolName,
            bidPrice: 0,
            askPrice: 0,
          };

          // update instrument info
          initInstrument(instrument);
          return of(
            updateInstrument(
              instrument,
              responseType === InstrumentResponseType.SNAPSHOT_FINISH
            )
          );
        }
        default: {
          return EMPTY;
        }
      }
      // wsOnMessageSrc$.next(data);
    })

    // ignoreElements()
  );

export const wsOnMarketMessageEpic = (
  action$: ActionsObservable<any>,
  state$
) =>
  action$.pipe(
    ofType(WS_ON_MESSAGE),
    filter((action) => SingletonWSManager.isMarketWsById(action._id)),
    map((action) => action.payload),
    tap((data) => {
      wsOnMessageSrc$.next(data);
    }),
    ignoreElements()
  );

const worker$ = fromWorker(() => new TestWorker(), wsOnMessageObservable$);

export const onWebWorkerEpic = (action$, state$) =>
  worker$.pipe(
    // map((batch) => batch[0]),
    switchMap((data: any) => {
      const { marketData, tradesData, bookData, charts } = data;

      const streams = [tickerUpdate2(marketData), tradeUpdate2(tradesData)];
      if (bookData) {
        streams.push(bookUpdate2(bookData));
      }

      charts.map((payload) => ChartSubject.next(payload));

      return action$.pipe(
        take(1),
        switchMap(() => of(...streams))
      );
    })
    // ignoreElements()
  );

// export const wsOnMessageEpic = (action$: ActionsObservable<any>, state$) => action$.pipe(
//   ofType(WS_ON_MESSAGE),
//   map(action => action.payload),
//   bufferTime(500),
//   filter(batch => batch.length > 0),
//   switchMap(data => {
//     let marketData = [];
//     const tradesData = [];
//     let bookData;

//     for (let i = data.length - 1; i >= 0; i--) {
//       const payload = data[i];

//       if (_isArray(payload) && !marketData.length) {
//         marketData = payload.slice(0, 100);
//       } else {
//         if (payload["e"] === 'aggTrade') {
//           tradesData.push(payload)
//         } else if(payload["lastUpdateId"]) {
//           bookData = payload
//         } else if(payload["e"] === 'kline') {
//           ChartSubject.next(payload)
//         }
//       }
//     }

//     const streams = [
//       tickerUpdate(marketData),
//       tradeUpdate(tradesData)
//     ];
//     if(bookData) {
//       streams.push(bookUpdate(bookData))
//     }
//     return of(...streams)
//   })
// );

// SingletonWSManager.addWs(testurl1 as string, WebSocketKindEnum.MARKET);

// @temporary hide
// export const setupWsConnectionEpic = initWSStream(WebSocketKindEnum.MARKET);

export const adminRisk = initWSStream(WebSocketKindEnum.ADMIN_RISK);
export const dataFeed = initWSStream(WebSocketKindEnum.MARKET, {
  isBinary: false,
});

// export const testAdminRiskEpic = (action$, state$) => action$.pipe(
//   ofType(TEST_ADMIN_RISK_RESPONSE),
//   delay(1000),
//   tap(() => {
//     const response = ['H', null, 0, 0, 1, null, '', 'guest', 0, 'ws://192.81.111.25:32026', '', testurl2, '', Date.now()];
//     const orderEntryIp1 = response[9],
//       orderEntryIp2 = response[10],
//       marketEntryIp1 = response[11],
//       marketEntryIp2 = response[12];

//     SingletonWSManager.addWs(marketEntryIp1 as string, WebSocketKindEnum.MARKET);
//     SingletonWSManager.addWs(marketEntryIp2 as string, WebSocketKindEnum.MARKET);
//     SingletonWSManager.addWs(orderEntryIp1 as string, WebSocketKindEnum.ORDERS);
//     SingletonWSManager.addWs(orderEntryIp2 as string, WebSocketKindEnum.ORDERS);
//   }),
//   map(() => updateSocketUrlEntries(SingletonWSManager.getUrlEntries())),
//   tap(() => {
//     SingletonWSManager.acceptEntries()
//   })
// );
