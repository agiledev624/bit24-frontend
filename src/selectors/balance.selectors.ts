import { createSelector } from "reselect";
import _get from "lodash/get";
import { EQUIV_CCY } from "@/exports/balances.utils";
import { add } from "lodash";
import { walletNameFromId } from "@/constants/balance-enums";
import { createEmptyWallet } from "@/components/balances/Balances.constants";
import { AppTradeType } from "@/constants/trade-type";
import {
  BalanceInfo,
  BalancesObject,
  CurrencyInfo,
} from "@/models/balance.model";

const _getBalances = (state) => state.balance;

const _getItems = createSelector<any, any, BalanceInfo[]>(
  _getBalances,
  (balances) => balances.items
);
export const getCurrencies = createSelector<any, any, CurrencyInfo[]>(
  _getBalances,
  (balances) => balances.currencies
);

/**
 * returns the balance object
 * {
 *  [symbol]: {
 *      [walletName1]: {available, reserved, total},
 *      [walletName2]: {available, reserved, total},
 *  }
 * }
 */
export const getBalances = createSelector<
  any,
  BalanceInfo[],
  CurrencyInfo[],
  BalancesObject
>(_getItems, getCurrencies, (balances, currencies) => {
  // const currencyObj = {};
  const results: BalancesObject = {};

  currencies.forEach((currency) => {
    const { code, ...rest } = currency;

    results[code] = createEmptyWallet({
      ...rest,
      ccy: code,
    });
  });

  balances.forEach((balance) => {
    const { code, available, reserved, total, wallet } = balance;

    const walletName = walletNameFromId(wallet);

    if (results[code] && walletName) {
      results[code] = {
        ...results[code],
        code,
        [walletName]: {
          available,
          reserved: reserved,
          total: +total,
        },
      };
    }
  });

  return results;
});

/**
 * returns the total amount of certain wallet
 * @param {object} state
 * @param {boolean} isDemo
 * @param {string} walletName
 * @returns {object}
 * {
 *  [symbol]: total amount in `walletName` wallet of `symbol`
 * }
 */
export function getBalancesTotal(
  state,
  isDemo,
  walletName = AppTradeType.SPOT
) {
  const balances = getBalances(state);
  const results = {};

  Object.keys(balances)
    // .filter((symbol) => isDemo ? balances[symbol].isDemo : !balances[symbol].isDemo)
    .forEach((symbol) => {
      const total = _get(balances, [symbol, walletName, "total"], 0) || 0;

      results[symbol] = total;
    });

  return results;
}

/**
 * returns the total amount of all wallets
 *
 * @param {object} state
 * @param {boolean} isDemo
 * {
 *  [symbol]: total amount in wallets of `symbol`
 * }
 */
export const getBalancesTotalAllWallets = createSelector(
  getBalances,
  (balances) => {
    const results = {};

    Object.keys(balances).forEach((symbol) => {
      const totalExchangeWallet =
        _get(balances, [symbol, AppTradeType.SPOT, "total"], 0) || 0;
      const totalMarginWallet =
        _get(balances, [symbol, AppTradeType.DERIVATIVE, "total"], 0) || 0;

      results[symbol] = +add(totalExchangeWallet, totalMarginWallet);
    });

    return results;
  }
);

export const isBalanceLoading = createSelector(
  _getBalances,
  (balances) => balances.initializing
);

// export function getFiatCurrencies(state) {
//   const currencies = getCurrencies(state);

//   return currencies.filter(currency => !currency.isDemo).map(currency => currency.code);
// }

// export const getAvailBalances = createSelector<any, BalancesObject> (getBalances, (balances) => {
//   const results = {};

//   Object.keys(balances).forEach(currency => {
//     const { available } = balances[currency];

//     results[currency] = available;
//   });

//   return results;
// });

export const getUSDFee = createSelector(getBalances, (balances) => {
  const usdtBalance = balances[EQUIV_CCY] || null;

  return usdtBalance ? usdtBalance.feeWithdraw || 0 : 0;
});

export function getAvailableByWallet(
  state,
  wallet = AppTradeType.SPOT,
  isDemo = false
) {
  const balances = getBalances(state);
  const results = {};

  Object.keys(balances)
    // .filter((symbol) => isDemo ? balances[symbol].isDemo : !balances[symbol].isDemo)
    .forEach((symbol) => {
      results[symbol] = _get(balances, [symbol, wallet, "available"], 0) || 0;
    });

  return results;
}
