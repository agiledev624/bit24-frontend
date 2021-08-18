import _get from "lodash/get";
import _set from "lodash/set";
import _isEmpty from "lodash/isEmpty";
import _each from "lodash/each";
import { wallets } from "@/components/balances/Balances.constants";
import { add, multiply } from "lodash";
import { sliceTo } from "./format-number";
import { findRelevantsByCurrency } from "./ticker.utils";

// export const EQUIV_CCY = 'USDT';
export const EQUIV_CCY = "USDT";

const fiatCcys = [EQUIV_CCY];

const stableCcys = [EQUIV_CCY];

const mainCounterCcys = [...stableCcys, "BTC", "ETH"];

export function isFiat(symbol) {
  return fiatCcys.includes(symbol);
}

export function hasZeroBalance(balances) {
  let result = false;

  if (_isEmpty(balances)) {
    return false;
  }

  _each(balances, function (balance) {
    if (result) {
      return;
    }

    result = hasBalance(balance);
  });

  return !result;
}

export function hasBalance(balance) {
  let result = false;
  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];

    result =
      !!_get(balance, [wallet, "total"], 0) ||
      !!_get(balance, [wallet, "total"], 0);
    if (result) break;
  }

  return result;
}

/**
 * symbol: string,
 * balances: Object{symbol: {}}
 * keep: boolean
 *
 * @returns {boolean}
 */
export function balanceZeroFilter({ symbol, balances, keepZero }) {
  if (keepZero || symbol === EQUIV_CCY) {
    return true;
  }

  if (balances[symbol]) {
    if (hasBalance(balances[symbol])) {
      return true;
    }
  }

  return false;
}

/**
 * symbol: string,
 * balances: Object{symbol: {}}
 * keep: boolean
 *
 * @returns {boolean}
 */
const SMALL_THRESHOLD = 0.01;

export function noBalanceSmallFilter(balance) {
  let total = 0;

  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    const t = _get(balance, [wallet, "total"], 0) || 0;
    total += t;
  }

  return total > SMALL_THRESHOLD;
}

export function equivalents({ symbol, ticker, total, wallet, equivCache }) {
  let equiv = total;
  const oldTotal = _get(equivCache, [symbol, wallet, "total"], 0) || 0;

  if (symbol === EQUIV_CCY) {
    _set(equivCache, [symbol, wallet, "equiv"], total);
    _set(equivCache, [symbol, wallet, "total"], total);
  } else if (oldTotal !== total) {
    _set(equivCache, [symbol, wallet, "total"], total);
    _set(
      equivCache,
      [symbol, wallet, "equiv"],
      convertCcy({
        amount: equiv,
        from: symbol,
        to: EQUIV_CCY,
        ticker,
      })
    );
  }
}

/**
 * Assume we have the amount of ETH = 100 (ETH)
 * and we would like to convert to the "to" counter (USDT),
 * but there is no ETH/USDT pair available in tickerlist
 * -> we have to check either existing ETH/BTC pair or not
 * -> if this pair (ETH/BTC) was in ticker list, calculate its amount (ETH -> BTC)
 * -> and then, the real value converted by (BTC/USDT)
 */

export function temporaryCalc({ amount, from, to, ticker }) {
  const counterCcys = mainCounterCcys.filter((ccy) => ccy !== to);

  for (let i = 0; i < counterCcys.length; i++) {
    const subCounter = counterCcys[i];
    const tmpPair = `${from}${subCounter}`;
    if (ticker.hasOwnProperty(tmpPair)) {
      const convertedValueBySubCounter = convertCcy({
        from,
        to: subCounter,
        amount,
        ticker,
      });
      const realValue = convertCcy({
        from: subCounter,
        to,
        amount: convertedValueBySubCounter,
        ticker,
      });

      return realValue;
    }
  }

  return 0;
}

// converts amount value from the source currency to the destination currency
// using provided ticker values
export function convertCcy({
  from = "BTC",
  to = EQUIV_CCY,
  amount,
  ticker,
  pair = "",
}) {
  if (amount === 0) return amount;
  if (!pair) pair = `${from}${to}`;

  const rate = getCurrentRate({
    from,
    to,
    ticker,
    pair,
  });

  if (rate === undefined) {
    // pair does not exist -> try another (BTC <-> USDT)
    if (from !== to && !ticker.hasOwnProperty(pair)) {
      // PAX/USDT
      if (~stableCcys.indexOf(from)) {
        // USDT
        // convert to BTC value (BTC/USDT)
        const btcValue = convertCcy({
          from,
          to: "BTC",
          amount,
          ticker,
          pair,
        });

        return convertCcy({
          from: "BTC",
          to,
          amount: btcValue,
          ticker,
          pair,
        });
      }

      return temporaryCalc({ amount, from, to, ticker });
    }

    return 0;
  } else {
    const convertedValue = multiply(amount, rate);
    // const decimals = getAmountDecimals(to);
    const decimals = 2;

    const rounded = Number(sliceTo(convertedValue, decimals));

    return isNaN(rounded) ? 0 : rounded;
  }
}

export function toUSD({ amount, from, ticker }) {
  return convertCcy({
    amount,
    from,
    to: EQUIV_CCY,
    ticker,
  });
}

export function toBTC({ amount, from, ticker }) {
  return convertCcy({
    amount,
    from,
    to: "BTC",
    ticker,
  });
}

export function getCurrentRate({ from = "BTC", to = EQUIV_CCY, ticker, pair }) {
  if (!pair) pair = `${from}${to}`;

  if (from === to) return 1;

  const symbol = pair;
  const rsymbol = `${to}${from}`;
  const reverse = !!ticker[rsymbol];
  const tickerPrice = ticker[symbol] || ticker[rsymbol] || {};
  const rate = Number(tickerPrice.lastPrice);

  if (isNaN(rate)) return undefined;

  const result = rate && reverse ? 1 / rate : rate;

  return result;
}

export function getRowClasses(row, index) {
  // var evenRow = index % 2 === 0;
  return {
    "balances-row": true,
    // 'even-stripe': evenRow,
    // 'odd-stripe': !evenRow
  };
}

export function isEnabledWithdraw(currency, balances) {
  return (balances[currency] && balances[currency].enableWithdraw) || false;
}

export function isEnabledDeposit(currency, balances) {
  return (balances[currency] && balances[currency].enableDeposit) || false;
}

export function getTotalEquivalent({ balancesTotal = {}, ticker, to }) {
  return Object.keys(balancesTotal).reduce((total, symbol) => {
    const equiv = convertCcy({
      from: symbol,
      ticker,
      amount: balancesTotal[symbol],
      to,
    });

    return add(total, equiv);
  }, 0);
}

export function isEnabledMargin(ccy) {
  const symbols = findRelevantsByCurrency(ccy);

  //@ts-ignore
  return symbols.some(({ marginable }) => marginable === 1);
}
