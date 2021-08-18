import { AppTradeType } from "@/constants/trade-type";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { useHistory } from "react-router";
import { Tabs, Tooltip } from "@/ui-components";
import { RoutePaths } from "@/constants/route-paths";
import { Asset } from "../asset-menu/Asset";
import { SpotMarketInfo, DerivativeMarketInfo } from "./Market.info";
import MarketLastTick from "./Market.LastTick";
import { TabTypes } from "@/ui-components/Tabs";

interface MarketProps {
  symbol: string;
  tradeType?: string;
  rightTool?: ReactNode;
  marketInfo?: ReactNode;
}

export const Market = React.memo(
  ({ symbol, tradeType, rightTool }: MarketProps) => {
    const tabConfig = [
      {
        title: "Spot",
        linkTo: `${RoutePaths.EXCHANGE}/BTCUSDT`,
        to: `${AppTradeType.SPOT}`,
        tooltip: "Spot",
      },
      {
        title: "USDT-M",
        linkTo: `${RoutePaths.DERIVATIVE}/BTCUSDT`,
        to: `${AppTradeType.DERIVATIVE}`,
        tooltip: "USDT Margined Futures",
      },
      {
        title: "Coin-M",
        linkTo: `${RoutePaths.DERIVATIVE}/BTCUSDT`,
        to: `${AppTradeType.COIN_M}`,
        tooltip: "Coin Margined Futures",
      },
    ];
    const history = useHistory();

    const [selectedTab, setSelectedTab] = React.useState<string>(
      AppTradeType.DERIVATIVE
    );
    const [highlightPanel, setHighlightPanel] = React.useState<boolean>(false);

    const onTabChanged = (to: string) => {
      setSelectedTab(to);
      const linkTo = tabConfig.find((tc) => tc.to === to).linkTo;
      history.push(linkTo);
    };
    const onToggledDropdown = (toggled: boolean) => {
      setHighlightPanel(toggled);
    };
    const marketInfo =
      tradeType === AppTradeType.SPOT ? (
        <SpotMarketInfo symbol={symbol} />
      ) : (
        <DerivativeMarketInfo symbol={symbol} />
      );

    const cpnMarketInfoPanelClasses = classNames("cpn-market-info-panel", {
      highlight: highlightPanel,
    });

    return (
      <div className="cpn-market-info">
        <div className="cpn-market-info--left">
          <div className={cpnMarketInfoPanelClasses}>
            <Asset symbol={symbol} toggledDropdown={onToggledDropdown} />
            <Tabs
              elements={tabConfig}
              selected={selectedTab}
              onChange={onTabChanged}
              tabType={TabTypes.RADIO_BUTTONS}
              containerClassName="market-tabs"
              tabClassName="market-tab"
              hasTooltip
            />
          </div>
          <Tooltip tooltipContent="Last traded price on bit24.">
            <div className="cpn-market-info__short-info cursor-help-tooltip">
              <div className="title">Last Price</div>
              <MarketLastTick symbol={symbol} />
            </div>
          </Tooltip>
          {marketInfo}
        </div>
        <div className="cpn-market-info--right pr-10">
          {/* {rightTool} */}
          {/* <MarketSetting tradeType={tradeType}/> */}
        </div>
      </div>
    );
  }
);
