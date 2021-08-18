import { riskWsUrl, testurl1 } from "@/config/config";
import { WebSocketKindEnum } from "@/constants/websocket.enums";
import {
  DisonnectedParams,
  SubscribeParams,
  WsActionType,
  WsAuthenticatedParams,
  WsConnectParams,
} from "@/models/ws-action-types";

export const TEST_ADMIN_RISK_RESPONSE = "@ws/TEST_ADMIN_RISK_RESPONSE";
// request connect to server
export const WS_CONNECT = "@ws/WS_CONNECT";
export const WS_CONNECTED = "@ws/CONNECTED";
// opened
export const WS_OPEN = "@ws/OPEN";
// closed
export const WS_DISCONNECTED = "@ws/DISCONNECTED";
export const WS_ON_MESSAGE = "@ws/ON_MESSAGE";
export const WS_SEND = "@ws/SEND";
// no long use ws anymore
export const WS_REQUEST_CLOSE = "@ws/REQUEST_CLOSE";

export const WS_REQUEST_SUBSCRIBE = "@ws/REQUEST_SUBSCRIBE";
// export const WS_SUBSCRIBED = '@ws/SUBSCRIBED';

export const WS_REQUEST_UNSUBSCRIBE = "@ws/REQUEST_UNSUBSCRIBE";
// export const WS_UNSUBSCRIBED = '@ws/UNSUBSCRIBED';

export const WS_REQUEST_AUTH = "@ws/REQUEST_AUTH";
export const WS_AUTH = "@ws/AUTH";
export const WS_UNAUTH = "@ws/UNAUTH";

export const establishWsConn = ({
  id,
  reconn = false,
  url,
}: WsConnectParams): WsActionType<WsConnectParams> => {
  console.log(">>>>>>>>>ESSSSSTABLISH", id, url);
  return {
    type: WS_CONNECT,
    payload: { reconn: url === testurl1, url },
    id,
  };
};

// @temporary hide
export const requestConnectToAdminRisk = (): WsActionType<WsConnectParams> =>
  establishWsConn({
    id: WebSocketKindEnum.ADMIN_RISK,
    reconn: false,
    url: riskWsUrl,
  });

// export const requestConnectToAdminRisk = () => ({
//   type: TEST_ADMIN_RISK_RESPONSE
// })

export const openWs = ({ id }) => ({
  type: WS_OPEN,
  id,
});

export const closeWs = ({ id, reconn }: { id; reconn?: boolean }) => ({
  type: WS_REQUEST_CLOSE,
  id,
  payload: { reconn: id === 3 },
});

export const sendWsData = (id, payload: any) => ({
  type: WS_SEND,
  id,
  payload,
});

export const sendSubscribe = ({
  params,
  id,
  requestId,
}: SubscribeParams): WsActionType<SubscribeParams> => ({
  type: WS_REQUEST_SUBSCRIBE,
  id,
  payload: { params, requestId },
});

export const sendUnsubscribe = ({
  params,
  id,
  requestId,
}: SubscribeParams): WsActionType<SubscribeParams> => ({
  type: WS_REQUEST_UNSUBSCRIBE,
  payload: { params, requestId },
  id,
});

export const requestAuthWs = ({
  data,
  id,
}: WsAuthenticatedParams): WsActionType<WsAuthenticatedParams> => ({
  type: WS_REQUEST_AUTH,
  payload: { data },
  id,
});

export const wsAuthenticated = (id) => ({
  type: WS_AUTH,
  payload: { id },
  id,
});

//@todo
export const requestUnauthWs = ({
  data,
  id,
}: WsAuthenticatedParams): WsActionType<WsAuthenticatedParams> => ({
  type: WS_UNAUTH,
  payload: { data },
  id,
});

export const wsDisconnected = ({
  id,
  errorCode,
}: DisonnectedParams): WsActionType<DisonnectedParams> => ({
  type: WS_DISCONNECTED,
  id,
  payload: { errorCode },
});
