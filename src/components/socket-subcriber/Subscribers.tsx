import { sendSubscribe, sendUnsubscribe } from "@/actions/ws.actions";
import { OrderBookDepthLimitEnum } from "@/constants/order-book-enums";
import { WebSocketChannelEnum } from "@/constants/websocket.enums";
import { SubscribeParams } from "@/models/ws-action-types";
import { getSetting } from "@/selectors/ui-setting.selectors";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import Subscriber from "./Subscriber";

interface SubscribersProps {
  symbol: string;
  channels: WebSocketChannelEnum[];
  subscribeFunc: (x: SubscribeParams) => void;
  unsubscribeFunc: (x: SubscribeParams) => void;
  chartInterval?: string;
  depthLevel?: OrderBookDepthLimitEnum;
  depthUpdateSpeed?: number;
}

function getSubscribers(data: SubscribersProps): JSX.Element[] {
  const { channels, subscribeFunc, unsubscribeFunc, symbol } = data;
  const handlers = {
    subscribeFunc,
    unsubscribeFunc,
  };

  return channels.map((channel: WebSocketChannelEnum) => {
    switch (channel) {
      case WebSocketChannelEnum.MARKET: {
        // there are no any dependencies
        return <Subscriber key={channel} channel={channel} {...handlers} />;
      }
      case WebSocketChannelEnum.ORDERBOOK: {
        const props = {
          ...handlers,
          channel,
          dependencies: {
            symbol,
            level: data.depthLevel,
            speed: data.depthUpdateSpeed,
          },
        };
        return <Subscriber key={channel} {...props} />;
      }
      case WebSocketChannelEnum.TRADES: {
        const props = {
          ...handlers,
          channel,
          dependencies: {
            symbol,
          },
        };
        return <Subscriber key={channel} {...props} />;
      }
      case WebSocketChannelEnum.CHART: {
        const props = {
          ...handlers,
          channel,
          dependencies: {
            symbol,
            interval: data.chartInterval,
          },
        };
        return <Subscriber key={channel} {...props} />;
      }
      default: {
        return null;
      }
    }
  });
}

const Subscribers = React.memo(
  ({
    channels,
    subscribeFunc,
    unsubscribeFunc,
    symbol,
    chartInterval = "30",
    depthLevel = OrderBookDepthLimitEnum.LVL3,
    depthUpdateSpeed = 100,
  }: Partial<SubscribersProps>) => {
    const subscribers = useMemo(
      () =>
        getSubscribers({
          channels,
          subscribeFunc,
          unsubscribeFunc,
          symbol,
          chartInterval,
          depthLevel,
          depthUpdateSpeed,
        }),
      [
        channels,
        subscribeFunc,
        unsubscribeFunc,
        symbol,
        chartInterval,
        depthLevel,
        depthUpdateSpeed,
      ]
    );

    return <div>{subscribers}</div>;
  }
);

const mapStateToProps = (state) => ({
  chartInterval: getSetting(state)("chart_interval"),
});

const mapDispatchToProps = (dispatch) => ({
  subscribeFunc: function (data: SubscribeParams) {
    dispatch(sendSubscribe(data));
  },
  unsubscribeFunc: function (data: SubscribeParams) {
    dispatch(sendUnsubscribe(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Subscribers);
