import { RoutePaths } from "@/constants/route-paths";
import { AppTradeType } from "@/constants/trade-type";
import { matchPath, useParams, useRouteMatch } from "react-router";

export function useRouteToTradeType() {
  const isExchange = !!useRouteMatch(getRouteMatchConfig(true));
  const isDerivative = !!useRouteMatch(getRouteMatchConfig(false));

  return isExchange
    ? AppTradeType.SPOT
    : isDerivative
    ? AppTradeType.DERIVATIVE
    : undefined;
}

export function useRouteSymbolParam() {
  //@ts-ignore
  let isExchange = !!useRouteMatch(getRouteMatchConfig(true));
  /*
    `matchPath` will return `null` if it doesn't match the path format.
    If it matches, it will return some object with parameters put into it
    nicely like `match.params`.
    */
  let match = matchPath(window.location.search, "/:symbol");
  console.log("math", match);
  return "XXX";
}

function getRouteMatchConfig(isExchange: boolean) {
  return {
    path: getTradingPathByParam(isExchange),
    strict: true,
    sensitive: true,
  };
}

function getTradingPathByParam(isExchange: boolean): string {
  return `${isExchange ? RoutePaths.EXCHANGE : RoutePaths.DERIVATIVE}/:symbol`;
}
