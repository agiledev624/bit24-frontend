import { SocketWrapper } from "@/pages/SocketWrapper.page";
import React from "react";
import { Redirect } from "react-router";
import { RoutePaths } from "../constants/route-paths";
// import App from './App';
import { withRouteGuard } from "../HOCs";
import { withLoadable } from "../HOCs/withLoadable";

const privateRoute = (Component) =>
  withRouteGuard({ directTo: RoutePaths.LOGIN })(Component);

const App = withLoadable({
  loader: () => import("../App"),
});

const Home = withLoadable({
  loader: () => import("../pages/Home.page"),
});

const Login = withLoadable({
  loader: () => import("../pages/Login.page"),
});

const ExchangePage = withLoadable({
  loader: () => import("../pages/Exchange.page"),
});

const DerivativePage = withLoadable({
  loader: () => import("../pages/Derivative.page"),
});

const TwoFA = withLoadable({
  loader: () => import("../pages/TwoFA"),
});

const NotFound = () => <div>404</div>;

export const routes = [
  {
    component: App,
    routes: [
      {
        path: RoutePaths.ROOT,
        exact: true,
        component: Home,
      },
      {
        path: RoutePaths.LOGIN,
        component: Login,
      },
      {
        path: RoutePaths.TWO_FACTOR,
        component: TwoFA,
      },
      //@todo: invalid symbol
      // cuz '/' is relative path then it MUST BE defined at the end of array
      {
        path: RoutePaths.ROOT,
        component: SocketWrapper,
        routes: [
          {
            path: RoutePaths.EXCHANGE,
            exact: true,
            component: () => (
              <Redirect
                from={RoutePaths.EXCHANGE}
                to={`${RoutePaths.EXCHANGE}/BTCUSDT`}
              />
            ),
          },
          {
            path: `${RoutePaths.EXCHANGE}/:symbol`,
            component: ExchangePage,
          },
          {
            path: RoutePaths.DERIVATIVE,
            exact: true,
            component: () => (
              <Redirect
                from={RoutePaths.DERIVATIVE}
                to={`${RoutePaths.DERIVATIVE}/BTCUSDT`}
              />
            ),
          },
          {
            path: `${RoutePaths.DERIVATIVE}/:symbol`,
            component: DerivativePage,
          },
        ],
      },
      {
        path: RoutePaths.WALLET,
        component: privateRoute(() => <div>WALLET Page</div>),
      },
      { component: NotFound },
    ],
  },
];
