import React, { useEffect } from "react";
import {
  WebSocketChannelEnum,
  WebSocketKindStateEnum,
} from "@/constants/websocket.enums";
import { SubscribeParams } from "@/models/ws-action-types";
import { getSubscribeData } from "./socket-subscriber.helpers";
import { connect } from "react-redux";
import { wsCollectionSelector } from "@/selectors/ws.selectors";
import { shallowCompareObjects } from "@/exports";
import { SingletonWSManager } from "@/internals";

type Dependencies = {
  [x: string]: string | number;
};

interface SubscriberProps {
  channel: WebSocketChannelEnum;
  subscribeFunc: (x: SubscribeParams) => void;
  unsubscribeFunc: (x: SubscribeParams) => void;
  dependencies?: Dependencies;
  isSocketReady?: boolean;
}

const Subscriber = React.memo(
  ({
    channel,
    subscribeFunc,
    unsubscribeFunc,
    dependencies = {},
    isSocketReady,
  }: Partial<SubscriberProps>) => {
    useEffect(() => {
      if (!isSocketReady) return;
      const subData = getSubscribeData(channel, dependencies);

      if (subData) {
        // console.log('[subscriber] >>>>> sub', channel, 'dependencies', dependencies)
        subscribeFunc(subData);
      }

      // because Subscriber is rendered via `Subscribers` props,
      // so everytime `dependecies` changes, this effect calls unmount as well
      return () => unsubscribeFunc(subData); // called when unmount
    }, [channel, dependencies, unsubscribeFunc, subscribeFunc, isSocketReady]);

    return null;
  },
  (prevProp, nextProps) => {
    return (
      shallowCompareObjects(prevProp.dependencies, nextProps.dependencies) &&
      prevProp.isSocketReady === nextProps.isSocketReady
    );
  }
);

const mapStateToProps = (state, props: SubscriberProps) => {
  const wsId = SingletonWSManager.getSocketInChargeOfByChannel(props.channel);
  const socketState = wsCollectionSelector(state)[wsId];

  return {
    isSocketReady: SingletonWSManager.isMarketWsById(wsId)
      ? socketState === WebSocketKindStateEnum.OPENED
      : socketState === WebSocketKindStateEnum.AUTHORIZED,
  };
};

export default connect(mapStateToProps)(Subscriber);
