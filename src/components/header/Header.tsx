import { useRouteToTradeType } from "@/hooks/useRouteToTradeType";
import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHeaderConfig } from "./Header.config";
import {
  defaultCoinOptions,
  defaultLangOptions,
  getHeaderItems,
  getHeaderMarketDropdown,
} from "./Header.helpers";
import { HeaderUserSection } from "./Header.user.section";
import { capitalize } from "@/exports";
import { Link, matchPath, withRouter } from "react-router-dom";
import _get from "lodash/get";
import { Market } from "../market/Market";
import { AppTradeType } from "@/constants/trade-type";
import { updateUISetting } from "@/actions/ui-setting.actions";
import { THEMES } from "@/constants/app.constants";
// import { MarketBalance } from '../market/Market.balance';

interface HeaderProps {
  location: any;
}

export const Header = React.memo(
  withRouter(({ location }: Partial<HeaderProps>) => {
    const tradeType = useRouteToTradeType();
    const { theme } = useSelector((state: any) => state.setting);
    const dispatch = useDispatch();
    const label = tradeType ? capitalize(tradeType) : "Market";
    const [lang, setLang] = useState(defaultLangOptions[0].value);
    const [coin, setCoin] = useState(defaultCoinOptions[0].value);

    const configs = useMemo(
      () =>
        getHeaderConfig({
          marketLbl: label,
          tradeType,
          theme,
          lang,
          setLang,
          coin,
          setCoin,
          switchTheme: () =>
            dispatch(
              updateUISetting({
                key: "theme",
                value:
                  theme === THEMES.LIGHT_THEME
                    ? THEMES.DARK_THEME
                    : THEMES.LIGHT_THEME,
                persist: true,
              })
            ),
        }),
      [tradeType, label, dispatch, theme]
    );

    const match = matchPath(location.pathname, {
      path: `/${
        tradeType === AppTradeType.SPOT ? "exchange" : "derivative"
      }/:symbol`,
    });
    const symbol = _get(match, ["params", "symbol"]);

    // const marketHeader = useMemo(
    //   () => [getHeaderMarketDropdown({ label, tradeType })],
    //   [label, tradeType]
    // );

    return (
      <div className="cpn-header">
        <div className="cpn-header__logo">
          <Link to="/">
            <span>bit</span>
            <span>24</span>
          </Link>
          {/* {getHeaderItems(marketHeader)} */}
        </div>
        {symbol && <Market symbol={symbol} tradeType={tradeType} />}
        <div className="cpn-header__nav">
          {getHeaderItems(configs)}
          <HeaderUserSection />
        </div>
      </div>
    );
  })
);
