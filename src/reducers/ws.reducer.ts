import {
  WS_OPEN,
  WS_DISCONNECTED,
  WS_AUTH,
  WS_UNAUTH,
  WS_CONNECT,
} from "@/actions/ws.actions";
import { WebSocketKindStateEnum } from "@/constants/websocket.enums";
import { WSReducerState } from "@/models/ws-reducer-state";
import _set from "lodash/set";

// const EMPTY_COLLECTION = {
//   [WebSocketKindEnum.MARKET]: WebSocketKindStateEnum.IDLE,
//   [WebSocketKindEnum.ORDERS]: WebSocketKindStateEnum.IDLE,
// };

const initialState: WSReducerState = {
  wsCollection: {},
};

export const wsReducer = (state = initialState, action) => {
  // console.log('%c[ws reducer]', 'background: #222; color: #bada55', action.type, action.payload);

  switch (action.type) {
    case WS_CONNECT: {
      const { id } = action;
      const { wsCollection } = state;
      console.log("[reducer WS_CONNECT] >>> id", id);

      if (
        wsCollection[id] === WebSocketKindStateEnum.CONNECTING ||
        wsCollection[id] === WebSocketKindStateEnum.OPENED
      ) {
        return state;
      }

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.CONNECTING
        ),
      };
    }
    case WS_OPEN: {
      const { id } = action;
      console.log("[WS_OPEN] >>> id", id);
      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.OPENED
        ),
      };
    }
    case WS_DISCONNECTED: {
      const { id } = action;

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.IDLE
        ),
      };
    }
    case WS_AUTH: {
      const { id } = action.payload;

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.AUTHORIZED
        ),
      };
    }
    case WS_UNAUTH: {
      const { id } = action;

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.OPENED
        ),
      };
    }
    default: {
      return state;
    }
  }
};
