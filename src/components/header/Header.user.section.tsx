import { requestLogoutAction } from "@/actions/auth.actions";
import { RoutePaths } from "@/constants/route-paths";
import {
  getAccessToken,
  getUserEmail,
  isUserLoggedIn,
} from "@/selectors/auth.selectors";
import {
  Button,
  Dropdown,
  Icon,
  Menu,
  MenuItem,
  Tooltip,
} from "@/ui-components";
import Account from "@/ui-components/icons/account";
import Api from "@/ui-components/icons/api";
import Book from "@/ui-components/icons/book";
import Dashboard from "@/ui-components/icons/dashboard";
import History from "@/ui-components/icons/history";
import Logout from "@/ui-components/icons/log-out";
import Referral from "@/ui-components/icons/referral";
import Wallet from "@/ui-components/icons/wallet";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const token = useSelector(getAccessToken);

  return (
    <div
      className="clickable"
      onClick={() => dispatch(requestLogoutAction(token))}
    >
      Logout
    </div>
  );
};

const menuItems = [
  {
    content: <Link to={RoutePaths.WALLET}>Wallet</Link>,
  },
  {
    content: <Link to="/deposit">Deposit</Link>,
  },
  {
    content: <Link to="/transfer">Transfer</Link>,
  },
  {
    content: <Link to="/withdraw">Withdrawal</Link>,
    divider: true,
    spaceBottom: true,
  },
  {
    content: <Link to="/account">Account</Link>,
  },
  {
    content: <Link to="/affiliate">Affiliate</Link>,
    divider: true,
    spaceBottom: true,
  },
  {
    content: <Link to="/security">Security</Link>,
  },
  {
    content: <Link to="/history">History</Link>,
    divider: true,
    spaceBottom: true,
  },
  {
    content: <LogoutBtn />,
  },
];

function asterisk(str: string): string {
  return str.slice(0, 1) + "*".repeat(str.length - 1);
}

export const HeaderUserSection = () => {
  const isLoggedIn = useSelector(isUserLoggedIn);
  const email = useSelector(getUserEmail);

  if (!isLoggedIn)
    return (
      <div className="auth-navigators">
        <Link className="login-btn" to={RoutePaths.LOGIN}>
          Login
        </Link>
        <Link className="register-btn" to={RoutePaths.LOGIN}>
          Register
        </Link>
      </div>
    );

  const title = (
    <div className="d-flex d-align-items-center cpn-header__account__button">
      <div className="r-font-size-18">
        <Icon id="user-circle" />
      </div>
      {/* <div className="username">{asterisk(email)}</div> */}
    </div>
  );

  const emailLong = "DOWNONLYLONG@CRYPTO.BTC";

  return (
    <Dropdown
      hoverable={true}
      title={title}
      displayArrow={false}
      dropdownClasses="user-section-dropdown"
      contentClasses="cpn-header__account__content"
    >
      <Menu hoverable={true}>
        <Tooltip tooltipContent={emailLong} place="top" offset={{ top: 0 }}>
          <div className="section-header cursor-help-tooltip">{emailLong}</div>
        </Tooltip>
        <div className="section-item">
          <Dashboard />
          <div className="text">Dashboard</div>
        </div>
        <div className="section-item">
          <Wallet />
          <div className="text">Wallet</div>
        </div>
        {/* <div className="section-item">
          <Account />
          <div className="text">Account</div>
        </div> */}
        <div className="section-item ">
          <Referral />
          <div className="text-column">
            <div className="text emphasize">Referral</div>
            <div className="description">Up to 60% commision</div>
          </div>
        </div>
        <div className="section-item">
          <Api />
          <div className="text">API</div>
        </div>
        <div className="section-item">
          <History />
          <div className="text">History</div>
        </div>
        <div className="section-item">
          <Logout />
          <div className="text">Log Out</div>
        </div>
        {/* <div className="account__content-balance">
          <div className="account__content-balance-col account__content-balance-equity">
            <div className="title">Equity</div>
            <div className="font-bold number-text">110.41947798 BTC</div>
            <div className="account__content-balance-btncnt">
              <Link to="#">DEPOSIT</Link>
            </div>
          </div>
          <div className="account__content-balance-col account__content-balance-pnl">
            <div className="title">PNL</div>
            <div className="font-bold number-text">1.67539937 BTC</div>
            <div className="account__content-balance-btncnt">
              <Link to="#">WITHDRAW</Link>
            </div>
          </div>
        </div>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="wallet" cssmodule="fal" />
            <span className="font-bold">Wallet</span>
          </Link>
        </div>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="usd-circle" cssmodule="fal" />
            <span className="font-bold">Referral</span>
          </Link>
        </div>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="link" cssmodule="fal" />
            <span className="font-bold">API</span>
          </Link>
        </div>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="lock-alt" cssmodule="fal" />
            <span className="font-bold">Security</span>
          </Link>
        </div>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="sign-out" cssmodule="fal" />
            <span className="font-bold">
              <LogoutBtn />
            </span>
          </Link>
        </div> */}
      </Menu>
    </Dropdown>
  );
};
