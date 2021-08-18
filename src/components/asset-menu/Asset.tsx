import { Dropdown, DropdownPosition } from "@/ui-components";
import React from "react";
import { AssetPopup } from "./Asset.Popup";
import { TickerObject } from "@/selectors/ticker.selectors";
import { AppTradeType } from "@/constants/trade-type";

interface AssetProps {
  symbol: string;
  tickers: TickerObject;
  tradeType: AppTradeType;
  toggledDropdown?: any;
}

export class Asset extends React.Component<Partial<AssetProps>> {
  render() {
    const { symbol, tradeType, toggledDropdown } = this.props;

    return (
      <Dropdown
        displayArrow={true}
        titleClasses="market-info-asset__ticker-btn"
        position={DropdownPosition.LEFT}
        arrowClass="icon-arrow_down_icon font-size-16"
        title={
          <div className="currency-button">
            <span className="currency">{symbol}</span>
          </div>
        }
        contentClasses="market-info-asset__dropdown"
        toggledDropdown={toggledDropdown}
      >
        <div className="market-info-asset__wrapper">
          <AssetPopup tradeType={tradeType} />
        </div>
      </Dropdown>
    );
  }
}
