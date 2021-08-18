import React, { useCallback } from "react";
import { firstInPair } from "@/exports/ticker.utils";
import DisplayConfirmModalBtn from "../DisplayConfirmModalBtn";
import PositionCloseModal from "./Positions.close.modal";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { connect } from "react-redux";
import { Button } from "@/ui-components";

interface ClosePositionProps {
  position: any;
  symbol: string;
  closePosition: (price: number, qty: number, isMarket?: boolean) => void;
  isEnableLimitClosePopup: boolean;
  isEnableMarketClosePopup: boolean;
}

class ClosePositionBtn extends React.Component<Partial<ClosePositionProps>> {
  constructor(props) {
    super(props);

    this.onLimitClosePositionBtnClick =
      this.onLimitClosePositionBtnClick.bind(this);
    this.onMarketClosePositionBtnClick =
      this.onMarketClosePositionBtnClick.bind(this);
  }

  onLimitClosePositionBtnClick(e) {
    const { position, closePosition } = this.props;
    closePosition(position.entryPrice, position.size);
  }

  //@todo seperate to other closePosition function
  onMarketClosePositionBtnClick(e) {
    const { position, closePosition } = this.props;
    closePosition(position.entryPrice, position.size);
  }

  renderLimitBtn() {
    const { symbol, position, closePosition, isEnableLimitClosePopup } =
      this.props;

    const limitProps = {
      position,
      symbol,
      confirmFunc: closePosition,
    };

    return isEnableLimitClosePopup ? (
      <DisplayConfirmModalBtn
        popupComp={PositionCloseModal}
        popupId="position_limit_close_popup"
        popupData={limitProps}
        classes="position__cancel position__cancel__limit"
      >
        Limit
      </DisplayConfirmModalBtn>
    ) : (
      <Button
        classes="position__cancel position__cancel__limit"
        onClick={this.onLimitClosePositionBtnClick}
      >
        Limit
      </Button>
    );
  }

  renderMarketBtn() {
    const { symbol, position, closePosition, isEnableMarketClosePopup } =
      this.props;

    const limitProps = {
      position,
      symbol,
      confirmFunc: closePosition,
      isMarket: true,
    };

    return isEnableMarketClosePopup ? (
      <DisplayConfirmModalBtn
        popupComp={PositionCloseModal}
        popupId="position_market_close_popup"
        popupData={limitProps}
        classes="position__cancel position__cancel__market"
      >
        Market
      </DisplayConfirmModalBtn>
    ) : (
      <Button
        classes="position__cancel position__cancel__market"
        onClick={this.onMarketClosePositionBtnClick}
      >
        Market
      </Button>
    );
  }
  render() {
    const { symbol, position } = this.props;

    const quote = firstInPair(symbol);

    return (
      <div className="position__close__groups">
        <div className="position-cell-limit-price">
          <div className="text-right">{position.entryPrice}</div>
          <span>{quote}</span>
        </div>
        {this.renderLimitBtn()}
        {this.renderMarketBtn()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isEnableLimitClosePopup: getSetting(state)(
    "enabled_position_close_limit_popup"
  ),
  isEnableMarketClosePopup: getSetting(state)(
    "enabled_position_close_market_popup"
  ),
});

export default connect(mapStateToProps)(ClosePositionBtn);
