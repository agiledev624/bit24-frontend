import { navigate } from "@/actions/app.actions";
import { RoutePaths } from "@/constants/route-paths";
import { AppTradeType } from "@/constants/trade-type";
import { TickerModel } from "@/models/ticker.model";
import { getTickers, TickerObject } from "@/selectors/ticker.selectors";
import { Table } from "@/ui-components";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import { Markets } from "../e-market";
import { WatchList } from "../watch-list";
import { assetColumns } from "./Asset.columns";

interface AssetPopupProps {
  tradeType: AppTradeType;
}

export const AssetPopup = ({ tradeType }: Partial<AssetPopupProps>) => {
  return (
    <div className="market-info-asset__content">
      {/* <WatchList tradeType={tradeType} enableFilter={true} /> */}
      <Markets isPopup={true} />
    </div>
  );
};
