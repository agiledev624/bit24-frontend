import { LocationChangeAction, RouterState } from "connected-react-router";
import { Reducer } from "redux";
import { AuthReducerState } from "./auth-reducer-state";
import { TickerState } from "./ticker-state.model";
import { WSReducerState } from "./ws-reducer-state";

export interface RootState {
  router: Reducer<RouterState, LocationChangeAction>;
  user: Reducer<AuthReducerState>;
  ws: Reducer<WSReducerState>; // any is action
  setting: Reducer<any>; // @todo: define reducer
  app: Reducer<any>; // @todo: define reducer
  balance: Reducer<any>; // @todo: define reducer
  book: Reducer<any>; // @todo: define reducer
  trade: Reducer<any>; // @todo: define reducer
  order: Reducer<any>; // @todo: define reducer
  ticker: Reducer<TickerState>;
}
