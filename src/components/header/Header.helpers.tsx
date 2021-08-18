import { RoutePaths } from "@/constants/route-paths";
import { AppTradeType } from "@/constants/trade-type";
import {
  Collapsible,
  Dropdown,
  DropdownPosition,
  Icon,
  InputRadioInline,
  Tooltip,
  SelectDropdown,
} from "@/ui-components";
import { Menu, MenuItemProps, MenuProps } from "@/ui-components/Menu";
import React, { ReactNode, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import MarketSetting from "@/components/market/Market.setting";
import { THEMES } from "@/constants/app.constants";
import Book from "@/ui-components/icons/book";
import Lifesaver from "@/ui-components/icons/lifesaver";
import Email from "@/ui-components/icons/email";
import Twitter from "@/ui-components/icons/twitter";
import Discord from "@/ui-components/icons/discord";
import Telegram from "@/ui-components/icons/telegram";
interface HeaderItem {
  title: ReactNode;
  contentClasses?: string;
  displayArrow?: boolean;
  dropdownClasses?: string;
  position?: DropdownPosition;
  arrowClass?: string;
  menu: MenuProps;
}

function lineRenderer(
  element: ReactNode,
  divider: boolean = true,
  spaceBottom: boolean = false
): MenuItemProps {
  return {
    content: horizontal(element),
    divider,
    spaceBottom,
  };
}

function horizontal(element: ReactNode): ReactNode {
  return (
    <div className="d-flex d-justify-content-space-between w-100">
      {element}
    </div>
  );
}

export function getHeaderMarketDropdown({ label, tradeType }) {
  return {
    title: <span className="text--base">{label}</span>,
    displayArrow: true,
    position: DropdownPosition.LEFT,
    arrowClass: "icon-arrow_down_icon font-size-16",
    dropdownClasses: "market-navigator",
    menu: {
      hoverable: true,
      header: <div>Choose Platform</div>,
      items: [
        {
          content: (
            <NavLink
              activeClassName="cpn-menu__link--active"
              to={`${RoutePaths.EXCHANGE}/BTCUSDT`}
            >
              Spot
            </NavLink>
          ),
          isActive: tradeType === AppTradeType.SPOT,
        },
        {
          content: (
            <NavLink
              activeClassName="cpn-menu__link--active"
              to={`${RoutePaths.DERIVATIVE}/BTCUSDT`}
            >
              Derivatives
            </NavLink>
          ),
          isActive: tradeType === AppTradeType.DERIVATIVE,
        },
      ],
    },
  };
}

// @todo: update data
export function getHeaderContralDetail(data?: any): HeaderItem {
  return {
    title: <span className="text--white">Contract Details</span>,
    contentClasses: "cpn-header__contract-details",
    menu: {
      header: (
        <span className="text--mariner font-bold">
          Full Contract Details(BTCUSD)
        </span>
      ),
      hoverable: true,
      items: [
        lineRenderer(
          <>
            <span>Initial Margin</span>
            <span>1.00%</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Maintenance Margin</span>
            <span>0.50%</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Funding Rate</span>
            <span>0.025%</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Funding Interval</span>
            <span>Continous</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Mark Price</span>
            <span>9601.24</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Index Price</span>
            <span>9598.49</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Funding Index Symbol</span>
            <span className="text--mariner">BTCUSDFI</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Mark Method</span>
            <span>Mark Price</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Auto-Deleveraging Enabled</span>
            <span>Yes</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Risk Limit</span>
            <span>200 BTC</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Risk Limit Increment</span>
            <span>100 BTC</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Open Interest</span>
            <span>612,414,932</span>
          </>
        ),
        lineRenderer(
          <>
            <span>24H Volume</span>
            <span>481,494,818</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Contract Size</span>
            <span>1 USD</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Commission</span>
            <span>
              See <span className="text--mariner">Fees</span> for more details.
            </span>
          </>
        ),
        lineRenderer(
          <>
            <span>Min Price Increment</span>
            <span>0.5 USD</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Max Order Price</span>
            <span>500,000</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Min Order Quantity</span>
            <span>1,000,000</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Type</span>
            <span>Settled in BTC, quoted in USD</span>
          </>
        ),
      ],
    },
  };
}

export function getHeaderMultilanguage(data?: any): HeaderItem {
  return {
    displayArrow: true,
    title: (
      <div className="cpn-header__lang__icon">
        <img src="https://www.countryflags.io/gb/flat/64.png" alt="gb" />
        <span>EN</span>
      </div>
    ),
    contentClasses: "cpn-header__lang__dropdown__content",
    menu: {
      hoverable: true,
      items: [
        {
          content: (
            <div className="menu__lang__item active">
              <img src="https://www.countryflags.io/gb/flat/64.png" alt="gb" />
              <span>English</span>
            </div>
          ),
        },
        {
          content: (
            <div className="menu__lang__item">
              <img src="https://www.countryflags.io/cn/flat/64.png" alt="gb" />
              <span>中文</span>
            </div>
          ),
        },
        {
          content: (
            <div className="menu__lang__item">
              <img src="https://www.countryflags.io/ru/flat/64.png" alt="gb" />
              <span>Pусский</span>
            </div>
          ),
        },
        {
          content: (
            <div className="menu__lang__item">
              <img src="https://www.countryflags.io/jp/flat/64.png" alt="gb" />
              <span>日本語</span>
            </div>
          ),
        },
        {
          content: (
            <div className="menu__lang__item">
              <img src="https://www.countryflags.io/kr/flat/64.png" alt="gb" />
              <span>한국어</span>
            </div>
          ),
        },
      ],
    },
  };
}
export function getHeaderQuestions() {
  return {
    title: (
      <span className="text--white r-font-size-18">
        <Icon id="question-circle" cssmodule="fas" />
      </span>
    ),
    contentClasses: "cpn-header__help",
    menu: {
      header: (
        <div className="cpn-header__menu-header title-2">Help & Support</div>
      ),
      hoverable: true,
      items: [
        {
          content: (
            <Link to="#" className="cpn-header__menu-item-outer-wrapper">
              <div className="cpn-header__menu-item-wrapper support">
                <div className="cpn-header__menu-item">
                  <Book />
                  <span className="text">Knowledge Base</span>
                </div>
              </div>
            </Link>
          ),
        },
        {
          content: (
            <Link to="#" className="cpn-header__menu-item-outer-wrapper">
              <div className="cpn-header__menu-item-wrapper support">
                <div className="cpn-header__menu-item">
                  <Lifesaver />
                  <span className="text">Submit Ticket</span>
                </div>
              </div>
            </Link>
          ),
        },
        {
          content: (
            <Link to="#" className="cpn-header__menu-item-outer-wrapper">
              <div className="cpn-header__menu-item-wrapper">
                <div className="cpn-header__menu-item">
                  <Email />
                  <span className="text">Feedback</span>
                </div>
              </div>
            </Link>
          ),
        },
        {
          content: (
            <div className="cpn-header__menu-header title-2 community">
              Join Community
            </div>
          ),
        },
        {
          content: (
            <Link to="#" className="cpn-header__menu-item-wrapper community">
              <div className="cpn-header__menu-item">
                <Twitter />
                <span className="text">Twitter</span>
              </div>
            </Link>
          ),
        },
        {
          content: (
            <Link to="#" className="cpn-header__menu-item-wrapper community">
              <div className="cpn-header__menu-item">
                <Discord />
                <span className="text">Discord</span>
              </div>
            </Link>
          ),
        },
        {
          content: (
            <Link to="#" className="cpn-header__menu-item-wrapper community">
              <div className="cpn-header__menu-item">
                <Telegram />
                <span className="text">Telegram</span>
              </div>
            </Link>
          ),
        },
      ],
    },
  };
}

export const defaultLangOptions = [
  {
    label: "English",
    value: "eng",
  },
  {
    label: "中文",
    value: "chn",
  },
  {
    label: "Русский",
    value: "rus",
  },
  {
    label: "한국어",
    value: "kor",
  },
  {
    label: "日本語",
    value: "jpn",
  },
];

export const defaultCoinOptions = [
  {
    label: "Tether (USDT)",
    value: "usdt",
  },
  {
    label: "Bitcoin (BTC)",
    value: "btc",
  },
  {
    label: "Ethereum (ETH)",
    value: "eth",
  },
];

export function getHeaderSetting(data?: any): HeaderItem {
  const { theme, switchTheme, tradeType, lang, setLang, coin, setCoin } = data;

  const onLangChange = ({ value }) => {
    setLang(value);
  };

  const onCoinChange = ({ value }) => {
    setCoin(value);
  };

  return {
    title: (
      <span className="text--white font-size-18">
        <Icon id="cog" />
      </span>
    ),
    contentClasses: "cpn-header__platform-settings",
    menu: {
      items: [
        {
          content: <div className="section-header">Platform Settings</div>,
        },
        {
          content: (
            <div className="section-item-outer">
              <div className="section-item settings divider">
                <div className="text">Theme</div>
                <div className="right">
                  <div className="tabs tab-radio-buttons market-tabs">
                    <div
                      className={`tab market-tab ${
                        theme === THEMES.LIGHT_THEME ? " active" : ""
                      }`} onClick={switchTheme}
                    >
                      <span className="ui-tooltip ui-tooltip--underline ui-tooltip--cursor-help">
                        <span>Light</span>
                      </span>
                    </div>
                    <div
                      className={`tab market-tab ${
                        theme === THEMES.DARK_THEME ? " active" : ""
                      }`} onClick={switchTheme}
                    >
                      <span className="ui-tooltip ui-tooltip--underline ui-tooltip--cursor-help">
                        <span>Dark</span>
                      </span>
                    </div>
                  </div>
                  {/* <InputRadioInline
                    value={""}
                    checked={theme === THEMES.LIGHT_THEME}
                    onChange={switchTheme}
                    label="Light"
                    radioClasses="font-size-10"
                  />
                  <InputRadioInline
                    value={""}
                    checked={theme === THEMES.DARK_THEME}
                    onChange={switchTheme}
                    label="Dark"
                    radioClasses="font-size-10"
                  /> */}
                </div>
              </div>
            </div>
          ),
        },
        {
          content: (
            <div className="section-item-outer">
              <div className="section-item settings divider">
                <div className="text">Language</div>
                <div className="right">
                  <SelectDropdown
                    options={defaultLangOptions}
                    value={lang}
                    onChange={onLangChange}
                    className={"section-item__lang-dropdown"}
                    closeOnMouseLeave={true}
                  />
                </div>
              </div>
            </div>
          ),
        },
        {
          content: (
            <div className="section-item-outer">
              <div className="section-item settings divider">
                <Tooltip
                  tooltipContent={"Disable to reduce CPU load."}
                  place={"bottom"}
                >
                  <div className="text dot-underline cursor-help-tooltip">
                    Animations
                  </div>
                </Tooltip>
                <div className="right">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          ),
        },
        {
          content: (
            <div className="section-item-outer">
              <div className="section-item settings divider">
                <Tooltip
                  tooltipContent={"Show order notification popups."}
                  place={"bottom"}
                >
                  <div className="text dot-underline cursor-help-tooltip">
                    Notifications
                  </div>
                </Tooltip>
                <div className="right">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          ),
        },
        {
          content: (
            <div className="section-item-outer">
              <div className="section-item settings">
                <Tooltip
                  tooltipContent={
                    "Total row in Positions and Open Orders displays the equivalent value in the preferred cryptocurrency."
                  }
                  place={"bottom"}
                >
                  <div className="text dot-underline cursor-help-tooltip">
                    Reference Currency
                  </div>
                </Tooltip>
                <div className="right">
                  <SelectDropdown
                    options={defaultCoinOptions}
                    value={coin}
                    onChange={onCoinChange}
                    className={"section-item__coin-dropdown"}
                    closeOnMouseLeave={true}
                  />
                </div>
              </div>
            </div>
          ),
        },
        {
          content: <MarketSetting tradeType={tradeType} />,
        },
      ],
    },
  };
}

export function getHeaderItems(headerConfig) {
  return (
    <>
      {headerConfig.map((hconfig: HeaderItem, index: number) => (
        <Dropdown
          hoverable={true}
          key={`dropdown_${index}`}
          arrowClass={hconfig.arrowClass}
          position={hconfig.position}
          title={hconfig.title}
          contentClasses={hconfig.contentClasses}
          dropdownClasses={hconfig.dropdownClasses}
          displayArrow={hconfig.displayArrow}
        >
          <Menu
            header={hconfig.menu.header}
            hoverable={hconfig.menu.hoverable}
            items={hconfig.menu.items}
          />
        </Dropdown>
      ))}
    </>
  );
}
