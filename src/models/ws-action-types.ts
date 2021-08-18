import { Action } from "./action";

export interface WsActionType<T> extends Action<T> {
  id: number; // ws id
}
export interface BaseWsParams {
  id?: number; // ws id
}

export interface SubscribeParams extends BaseWsParams {
  params: string;
  requestId: number;
}

export interface DisonnectedParams extends BaseWsParams {
  errorCode: number;
}

export interface WsAuthenticatedParams extends BaseWsParams {
  data: any;
}

export interface WsConnectParams extends BaseWsParams {
  reconn: boolean;
  url: string;
}
