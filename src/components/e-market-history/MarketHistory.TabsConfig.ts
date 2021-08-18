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
      title: `Stops [${totalStopOrders}]`,
      to: "stop-order",
    },
    {
      title: "Fills",
      to: "trade-history",
    },
    {
      title: "Order History",
      to: "order-history",
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
