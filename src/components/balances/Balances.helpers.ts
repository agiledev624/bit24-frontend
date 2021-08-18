import _get from "lodash/get";
import _set from "lodash/set";
import _isEmpty from "lodash/isEmpty";
import _cloneDeep from "lodash/cloneDeep";

import {
  wallets,
  DEFAULT_TICKER_WIDTH,
  DEFAULT_AMOUNT_WIDTH,
  MIN_AMOUNT_CHARACTERS,
  MIN_TICKER_WIDTH,
  TOTAL_WIDTH,
} from "./Balances.constants";
import {
  balanceZeroFilter,
  equivalents,
  EQUIV_CCY,
  hasBalance,
  hasZeroBalance,
  noBalanceSmallFilter,
} from "@/exports/balances.utils";

/**
 *
 * @param {Object} params
 * @return {Object}
 * {
 *  maxSizes: {[wallet]: number} => used to calculate column widths by wallet's amount (if you'd like to display wallet columns only) @see calculateWidths
 *  data: {Array} => table data
 * }
 */
export function tableData({
  balances,
  inOverlay,
  startBalOverlay,
  equivCache,
  queryString = "",
  ticker,
  needFreshData,
  cache,
  isSmall,
}) {
  const maxSizes = {};
  const emptyAccount = hasZeroBalance(balances);
  const foundKeys = {};
  let keys = [];
  let keepZero = false;

  if (needFreshData !== cache.needFreshData || !cache.data) {
    cache.needFreshData = needFreshData;
    keys = Object.keys(balances);
    cache.needSort = true;
  } else {
    keepZero = true;
    keys = cache.data.map(function (row) {
      foundKeys[row.ccy] = true;

      return row.ccy;
    });
    Object.keys(balances).forEach(function (symbol) {
      if (
        symbol === EQUIV_CCY ||
        (!foundKeys[symbol] && hasBalance(balances[symbol]))
      ) {
        if (keys.indexOf(symbol) < 0) {
          keys.push(symbol);
        }
      }
    });
  }

  let data = keys
    .filter(function (symbol) {
      return symbol.includes(queryString.toUpperCase());
    })
    .filter(function (symbol) {
      return balanceZeroFilter({ symbol, balances, keepZero });
    })
    .map(function (symbol) {
      wallets.forEach(function (wallet) {
        let total = _get(balances, [symbol, wallet, "total"], 0) || 0;

        equivalents({
          equivCache,
          symbol,
          ticker,
          total,
          wallet,
        });

        if (total < 0) {
          total = Math.abs(total) * 10; //extra space for minus sign
        }

        if (maxSizes[wallet]) {
          if (total > _get(maxSizes, [wallet, "total"], 0)) {
            maxSizes[wallet] = {
              total,
              key: symbol,
            };
          }
        } else {
          maxSizes[wallet] = {
            total,
            key: symbol,
          };
        }
      });

      const balance = _cloneDeep(balances[symbol] || {});

      wallets.forEach(function (wallet) {
        if (balance[wallet]) {
          const equiv = _get(equivCache, [symbol, wallet], 0);
          _set(balance, [wallet, "equiv"], equiv);
        }
      });

      return {
        ...balance,
        ccy: symbol,
        startBalOverlay,
        inOverlay,
      };
    });

  if (isSmall) {
    data = data.filter(noBalanceSmallFilter);
  }

  return {
    maxSizes: maxSizes,
    data: data,
  };
}

export function calculateWidths(maxWidths?: object) {
  if (_isEmpty(maxWidths)) {
    return [
      DEFAULT_TICKER_WIDTH,
      DEFAULT_AMOUNT_WIDTH,
      DEFAULT_AMOUNT_WIDTH,
      DEFAULT_AMOUNT_WIDTH,
    ];
  }

  let totalLength = 0;

  Object.keys(maxWidths).forEach(function (wallet) {
    const walletTotal = _get(maxWidths, [wallet, "total"], 0);
    const total = Math.trunc(walletTotal);

    _set(maxWidths, [wallet, "length"], total.toString().length);
    totalLength += _get(maxWidths, [wallet, "length"], 0);
  });

  Object.keys(maxWidths).forEach(function (wallet) {
    const length = _get(maxWidths, [wallet, "length"], 0);

    if (length < MIN_AMOUNT_CHARACTERS) {
      totalLength += MIN_AMOUNT_CHARACTERS - length;
      _set(maxWidths, [wallet, "length"], MIN_AMOUNT_CHARACTERS);
    }
  });

  // Ticker can wrap
  const tickerWidth =
    totalLength > 20 ? MIN_TICKER_WIDTH : DEFAULT_TICKER_WIDTH;
  const availableWidth = TOTAL_WIDTH - tickerWidth;

  //@ts-ignore
  return [tickerWidth, ...maxWidths].map(function (wallet) {
    const length = _get(maxWidths, [wallet, "length"], 0);
    const percent = length / totalLength;

    return availableWidth * percent;
  });
}

export function isHiddenGenerateAddress(ccy) {
  const DISABLE_LIST = { XRP: true, EOS: true };
  return !!DISABLE_LIST[ccy];
}

export function hasExtraData(ccy) {
  const HAS_EXTRA = { XRP: true, EOS: true };
  return !!HAS_EXTRA[ccy];
}

export function getExtraLabel(ccy) {
  switch (ccy) {
    case "XRP":
      return "Tag";
    case "EOS":
      return "Memo";
    default:
      return "";
  }
}

export function getExtraData(ccy, data) {
  if (!data) return "";
  switch (ccy) {
    case "XRP":
    case "EOS":
      return data.extraUuid || "";
    default:
      return "";
  }
}

export function getGenerateTootipExtraData(ccy) {
  switch (ccy) {
    case "XRP":
    case "EOS":
      return `Generate new ${getExtraLabel(ccy)}`;

    default:
      return "";
  }
}

export function getQrData(ccy, state) {
  const { depositAddress, extraData } = state;
  switch (ccy) {
    case "XRP":
    case "EOS":
      return extraData || "";
    default:
      return depositAddress || "";
  }
}

export function getEnableExtraDataLabel(ccy) {
  switch (ccy) {
    case "XRP":
    case "EOS":
      return `No ${getExtraLabel(ccy)}`;
    default:
      return "";
  }
}

export function getPlaceholderWithdrawExtraData(ccy) {
  switch (ccy) {
    case "XRP":
    case "EOS":
      return `Enter a valid ${getExtraLabel(ccy)}`;
    default:
      return "";
  }
}

export function getLabelWithdrawExtraData(ccy) {
  switch (ccy) {
    case "XRP":
    case "EOS":
      return `Withdrawal ${getExtraLabel(ccy)}`;
    default:
      return "";
  }
}

function validateMemo(memo) {
  if (memo.length < 1 || memo.length > 256) return false;
  return true;
}

function validateTag(tag) {
  if (!tag || tag.length !== tag.trim().length) return false;
  if (!/^\d{1,10}$/.test(tag)) return false;
  const num = Number(tag);
  if (num < 0 || num > 4294967295) return false;
  return true;
}

export function validateWithdrawExtraData(ccy, extraData) {
  if (!hasExtraData(ccy)) return "";
  switch (ccy) {
    case "XRP":
      return validateTag(extraData)
        ? ""
        : `Invalid ${getExtraLabel(ccy)} format`;
    case "EOS":
      return validateMemo(extraData)
        ? ""
        : `Invalid ${getExtraLabel(ccy)} format`;
    default:
      return "";
  }
}

export function getAddressLabel(ccy) {
  let rs = {
    deposit: "Deposit Address:",
    withdraw: "Withdrawal Address",
    withdrawPlaceholder: "Enter a valid address",
    whitelistAddressRequiredMsg: "Please input your address",
    whitelistAddressValidateMsg: "Invalid address format",
    whitelistExtraDataRequiredMsg: "",
    whitelistExtraDataIsRequired: "",
  };

  // eslint-disable-next-line default-case
  switch (ccy) {
    case "XRP":
    case "EOS": {
      rs = {
        ...rs,
        whitelistExtraDataRequiredMsg: `Please input your ${getExtraLabel(
          ccy
        )}`,
        whitelistExtraDataIsRequired: `${getExtraLabel(ccy)} is required`,
      };
      break;
    }
  }

  return rs;
}

export function hasShowExtraWarningView(ccy) {
  switch (ccy) {
    case "EOS":
    case "XRP":
      return true;
    default:
      return false;
  }
}

export function getExtraWarning(ccy) {
  let tagName = getExtraLabel(ccy).toLowerCase();

  return `
    WARNING: Depositing ${ccy} to MTBIT requires both a deposit address and a ${tagName}.
    Do NOT deposit ${ccy} to your account unless you know what an ${ccy} ${tagName} is. If you fail to include the ${tagName} with your deposit the funds will be lost forever.
    If you are not familiar with the procedure, please contact our support.
    I Understand. Show me the deposit address and ${tagName}
  `
    .trim()
    .split("\n")
    .map((str) => str.trim());
}

export function getDepositNoteContent(ccy) {
  if (hasShowExtraWarningView(ccy)) {
    const tagName = getExtraLabel(ccy).toLowerCase();
    return `Please re-check the deposit address and ${tagName} before depositing. Make sure your transaction output address and ${tagName} is the same as the one on our site.`;
  } else {
    return `Please re-check the deposit address before depositing. Make sure your transaction output address is the same as the one on our site.`;
  }
}

export function getNumDecimals(ccy) {
  switch (ccy) {
    case "XTZ":
    case "XRP":
    case "USDC":
      return 6;
    case "EOS":
      return 4;
    default:
      return 8;
  }
}

// prevent transfer between the same wallet type
export function getFilteredWallets(wallet) {
  if (!wallet) return wallets;

  return wallets.filter((walletName) => walletName !== wallet);
}
