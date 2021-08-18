import { AppTradeType } from "@/constants/trade-type";

export const getMarketHistoryTabsConfig = ({
  tradeType,
  totalEntryPositions = 0,
  totalStopOrders = 0,
  totalEntryOrders = 0,
}) => {
  let tabs = [
    {
      title: `Open Orders [${totalEntryOrders}]`,
      to: "open-order",
    },
    {
      title: `Stop Orders [${totalStopOrders}]`,
      to: "stop-order",
    },
    {
      title: "Order History",
      to: "order-history",
    },
    {
      title: "Trade History",
      to: "trade-history",
    },
  ];

  if (tradeType === AppTradeType.DERIVATIVE) {
    tabs = [
      {
        title: `Positions [${totalEntryPositions}]`,
        to: "positions",
      },
      ...tabs,
    ];
  }

  return tabs;
};
