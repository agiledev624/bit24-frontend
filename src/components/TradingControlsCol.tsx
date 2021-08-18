import {
  WorkspaceSetting,
  WorkspaceSettingEnum,
} from "@/models/workspace-setting";
import { Collapsible } from "@/ui-components";
import React, { useState } from "react";
import { Balances } from "./balances";
import { BalanceEyeToggle } from "./balances/Balances.EyeToggle";
import { WatchList } from "./watch-list";
import _omit from "lodash/omit";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { connect } from "react-redux";
import { AppTradeType } from "@/constants/trade-type";
import { OrderForm } from "./order-form";
import { getWalletIdFromName } from "@/constants/balance-enums";
import { isUserLoggedIn } from "@/selectors/auth.selectors";
import Assets from "@/components/e-assets/Assets";

interface Props {
  tradeType: AppTradeType;
  enabledWorkspaces: WorkspaceSetting;
  symbol: string;
  isLoggedIn: boolean;
}

const TradingControlsCol = ({
  symbol,
  tradeType,
  enabledWorkspaces = {},
  isLoggedIn,
}: Partial<Props>) => {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="trading-main-vertical-grid">
      <div className="trading-main-layout__paddingwrapper">
        <div className="trading-main-layout__item">
          <OrderForm
            wallet={getWalletIdFromName(tradeType)}
            tradeType={tradeType}
            pair={symbol}
            hidden={hidden}
          />
        </div>

        {/* {enabledWorkspaces[WorkspaceSettingEnum.BALANCE] && isLoggedIn && (
          <div className='trading-main-layout__item'>
            <Balances tradeType={tradeType} />
          </div>
        )} */}
        {enabledWorkspaces[WorkspaceSettingEnum.BALANCE] && isLoggedIn && (
          <div className="trading-main-layout__item">
            <Assets
              tradeType={tradeType}
              hidden={hidden}
              setHidden={setHidden}
            />
          </div>
        )}

        {/* {enabledWorkspaces[WorkspaceSettingEnum.WATCHLIST] && <div className="trading-main-layout__item">
          <Collapsible title="Watch List">
            <WatchList />
          </Collapsible>
        </div>} */}

        {/* {tradeType === AppTradeType.DERIVATIVE && <div className="trading-main-layout__item">
          <ContractDetail/>
        </div>} */}
      </div>
    </div>
  );
};

export function omitWorkspace(workpsaces: WorkspaceSetting): WorkspaceSetting {
  return _omit(workpsaces, [
    WorkspaceSettingEnum.CHART,
    WorkspaceSettingEnum.ORDERBOOK,
    WorkspaceSettingEnum.MARKET_HISTORY,
    WorkspaceSettingEnum.TRADE,
  ]);
}

const mapStateToProps = (state) => ({
  enabledWorkspaces: omitWorkspace(getSetting(state)("enabled_workspaces")),
  isLoggedIn: isUserLoggedIn(state),
});

export default connect(mapStateToProps)(TradingControlsCol);
