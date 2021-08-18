import { WebSocketKindStateEnum } from "@/constants/websocket.enums";

export type WSReducerState = {
  wsCollection?:
    | {
        [x: number]: WebSocketKindStateEnum;
      }
    | {};
};
