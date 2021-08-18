import React from "react";
import {
  closeWs,
  establishWsConn,
  sendSubscribe,
  sendUnsubscribe,
  sendWsData,
} from "@/actions/ws.actions";
import { useDispatch, useSelector } from "react-redux";
import { withErrorBoundary } from "@/HOCs";
// import { getAccessToken, getUserEmail } from '@/selectors/auth.selectors';
// import { requestLogoutAction } from '@/actions/auth.actions';
// import { testurl1 } from '@/config/config';
// import { MessageType, OrderSide, OrderType } from '@/constants/order-enums';
// import { PacketSender } from '@/internals/packet/Packet.Sender';
// import { PacketReader } from '@/internals/packet/Packet.Reader';
// import { requestConnectToAdminRisk } from '@/actions/ws.actions';
// import { fromWorker, fromWorkerPool } from '@/exports/streams/rx-worker';
// import { Subject } from 'rxjs';
// import NewWindow from '@/ui-components/NewWindow';
// import { readUserLogin, sendUserLogin } from '@/transformers/user-login.transformer';
// import { ClientLoginManner } from '@/packets/client-login.packet';
// import { SubscribeManner } from '@/packets/subscribe.packet';
// import { SymbolType, SymbolValue } from '@/constants/symbol-enums';
// import { TradesManner } from '@/packets/trades.packet';
// import { TransactionManner } from '@/packets/transaction.packet';
// import { WalletType } from '@/constants/balance-enums';
// import { OrderForm } from '@/components/order-form';
import {
  InstrumentRequestManner,
  InstrumentRequestType,
} from "@/packets/instrument.packet";
import { SymbolType } from "@/constants/symbol-enums";

// worker.onmessage = function (event) {
//   console.log('on message ?', event.data);
// };

// setTimeout(() => {
//   worker.postMessage('hello!?')
// }, 1000)

export const Home = () => {
  const dispatch = useDispatch();
  // const [lastOrderId, setLastOrderId] = useState(0);

  // const email = useSelector(getUserEmail);
  // const token = useSelector(getAccessToken);
  // const transaction = [
  //   MessageType.ORDER_NEW, // message type
  //   OrderType.LIMIT,
  //   OrderSide.BUY,
  //   1.2,
  //   2.1998,
  //   "Test",
  // Date.now()
  // ]
  // const sender = new PacketSender();
  // sender.initData(100);
  // // sender.packHeader();
  // sender.putString("T");
  // sender.putShort(MessageType.ORDER_NEW);
  // sender.putShort(OrderType.LIMIT);
  // sender.putShort(OrderSide.BUY);
  // sender.putDouble(1.2);
  // sender.putDouble(5.12);
  // // sender.updateSize();

  // const reader = new PacketReader(sender.getData());
  // const transaction = {
  //   messageType: reader.getString(),
  //   mst: reader.getShort(),
  //   orderType: reader.getShort(),
  //   orderSide: reader.getShort(),
  //   price: reader.getDouble(),
  //   qty: reader.getDouble(),
  // };

  // const s$ = new Subject<string>();
  // client login
  // const loginData = ClientLoginManner.send({
  //   accountId: 100500,
  //   username: 'NAM',
  //   sendingTime: Date.now(),
  // });
  // // console.log('sentData', sentData);
  // const readData = ClientLoginManner.read(loginData);

  return (
    <div className="App">
      <h3>HOME PAGE</h3>
      {/* <button onClick={() => {
        console.log('login buffer:', loginData)
        console.log('login readed:', readData)
      }}>test log sender</button> */}
      <br />
      {/* <button onClick={() => {
        const params = {
          type: SubscribeManner.messageType,
          accountId: 100500,
          sendingTime: Date.now(),
          // price: 123.321,
          bit24Subscribe: [{
            symbolEnum: SymbolValue.BTC,
            symbolType: SymbolType.SPOT,
            symbol: 'BTC',
            layer: 1,
            subscribe: 'S'
          }]
        }
        const subSender = SubscribeManner.send(params);

        console.log('subscribe buffer:', subSender);
        console.log('subscribe reader:', SubscribeManner.read(subSender));
        dispatch(sendWsData(1, subSender));
        
      }}>test log subscriber</button> */}
      <button
        onClick={() => {
          const params = {
            type: InstrumentRequestManner.messageType,
            accountId: 100500,
            sendingTime: Date.now(),
            requestType: InstrumentRequestType.ALL,
            symbolType: SymbolType.SPOT,
          };
          const subSender = InstrumentRequestManner.send(params);

          console.log("instrument request buffer:", subSender);
          console.log(
            "instrument request reader:",
            InstrumentRequestManner.read(subSender)
          );
          dispatch(sendWsData(2, subSender));
        }}
      >
        test request instrument
      </button>
      <br />
      {/* <button onClick={() => {
        const params = {
          type: TradesManner.messageType,
          accountId: 100500,
          sendingTime: Date.now(),
          symbolEnum: SymbolValue.BTC,
          symbolType: SymbolType.SPOT,
          price: 123.321,
          side: OrderSide.SELL,
          volume: 234.341,
          bit24Symbol:'Bitcoin',
        }
        const subSender = TradesManner.send(params);

        console.log('subscribe buffer:', subSender);
        console.log('subscribe reader:', TradesManner.read(subSender))
      }}>test log trades</button> */}
      <br />
      {/* <button onClick={() => {
        const lastOrderId = Date.now();

        const params = {
          type: MessageType.ORDER_NEW,
          accountId: 100500,
          clientOrderId: lastOrderId,
          symbolEnum: SymbolValue.BTC,
          orderType: OrderType.LIMIT,
          symbolType: SymbolType.SPOT,
          price: 9190,
          side: OrderSide.SELL,
          qty: 1,
          tif: 2,
          sendingTime: Date.now(),
          // stopPrice: 12.21233,
        }
        const order = TransactionManner.send(params);
        
        setLastOrderId(lastOrderId);

        console.log('transaction origin:', TransactionManner.read(order));
        console.log('transaction reader:', TransactionManner.read(order, true));

        dispatch(sendWsData(1, order))
      }}>test new transaction</button>
      <button onClick={() => {
        const params = {
          type: MessageType.ORDER_CANCEL,
          accountId: 100500,
          clientOrderId: Date.now(),
          orderId: lastOrderId,
          symbolEnum: SymbolValue.BTC,
          orderType: OrderType.LIMIT,
          symbolType: SymbolType.SPOT,
          price: 9190,
          side: OrderSide.SELL,
          qty: 1,
          tif: 2,
          sendingTime: Date.now(),
          // stopPrice: 12.21233,
        }
        const order = TransactionManner.send(params);

        console.log('cancel transaction reader:', TransactionManner.read(order, true));
        dispatch(sendWsData(1, order))
      }}>
        cancel order {lastOrderId}
      </button>
      <button onClick={() => {
        const params = {
          type: MessageType.CANCEL_REPLACE,
          accountId: 100500,
          clientOrderId: Date.now(),
          orderId: lastOrderId,
          symbolEnum: SymbolValue.BTC,
          orderType: OrderType.LIMIT,
          symbolType: SymbolType.SPOT,
          price: 9190,
          origPrice: 9190,
          side: OrderSide.SELL,
          qty: 2,
          tif: 2,
          sendingTime: Date.now(),
          // stopPrice: 12.21233,
        }
        const order = TransactionManner.send(params);

        console.log('cancel transaction reader:', TransactionManner.read(order, true));
        dispatch(sendWsData(1, order))
      }}>
        cancel replace order {lastOrderId}
      </button> */}
      <header>
        {/* <button onClick={() => dispatch(requestConnectToAdminRisk())}>test admin risk</button>
        <br /> */}
        {/* <button onClick={() => dispatch(establishWsConn({
          reconn: true, 
          id: 2, 
          url: testurl1
        }))}>test open market ws</button>
        <button onClick={() => dispatch(closeWs({id: 2}))}>test close market ws</button>
        <button onClick={() => dispatch(sendWsData(2, {event: 'ping'}))}>send ping</button> */}
      </header>
      {/* <section>
        <button onClick={() => {
          console.log(loginData);
          dispatch(sendWsData(1, loginData));
        }}>send login</button>
      </section> */}
      {/* <section>
        <button onClick={() => dispatch(sendSubscribe({
          params: 'btcusdt@depth',
          id: 1,
          requestId: 0x42544355534454
        }))}>manually subscribe</button>
        <button onClick={() => dispatch(sendUnsubscribe({
          params: 'btcusdt@depth',
          id: 1,
          requestId: 0x42544355534454
        }))}>manually unsubscribe</button>
      </section> */}
      {/* {email && <div>
        <h1>Hello {email}</h1>
        <button onClick={() => dispatch(requestLogoutAction(token))}>logout</button>
      </div>} */}
    </div>
  );
};

export default withErrorBoundary(Home, "Home");
