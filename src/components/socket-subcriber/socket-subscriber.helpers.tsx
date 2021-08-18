import {
  WebSocketChannelEnum,
  WebSocketChannelParams,
} from "@/constants/websocket.enums";
import { strTemplate } from "@/exports";
import { SingletonWSManager } from "@/internals";
import { SubscribeParams } from "@/models/ws-action-types";

export function getSubscribeData(
  channel: WebSocketChannelEnum,
  dependencies: object
): SubscribeParams | null {
  const wsId = SingletonWSManager.getSocketInChargeOfByChannel(channel);

  if (!wsId) {
    return null;
  }

  return {
    params: strTemplate(WebSocketChannelParams[channel], dependencies, {
      symbol: (symbol: string) => symbol.toLowerCase(),
    }),
    requestId: channel,
    id: wsId,
  };
}
