import { WalletType } from "@/constants/balance-enums";
import { EQUIV_CCY } from "@/exports/balances.utils";
import { add } from "lodash";

function generateEmptyBalance(id, symbol, name, wallet: WalletType) {
  return {
    code: symbol,
    id,
    symbol,
    name,
    wallet,
  };
}

const DEFAULT_ITEMS = [
  generateEmptyBalance(1, "BTC", "Bitcoin", WalletType.DERIVATIVE),
  generateEmptyBalance(1, "BTC", "Bitcoin", WalletType.EXCHANGE),
  generateEmptyBalance(2, EQUIV_CCY, "Tether", WalletType.DERIVATIVE),
  generateEmptyBalance(2, EQUIV_CCY, "Tether", WalletType.EXCHANGE),
].map((balance) => {
  const id = balance.id;
  const wallet = balance.wallet;
  const code = balance.code || "";
  const available = code === "BTC" ? 2 : 20000;
  const reserved = 0;
  const total = add(available, reserved);

  return {
    id,
    wallet,
    code,
    available,
    reserved,
    total,
  };
});

const DEFAULT_CURRENCY = [
  {
    id: 1,
    code: "BTC",
    name: "bitcoin",
    targetConfirms: 3,
    enableDeposit: true,
    enableWithdraw: true,
    feeWithdraw: 0.01,
    minWithdraw: 0.01,
    minDeposit: 0.01,
    decimalAmount: 8,
    withdrawalAmount: 8,
  },
  {
    id: 2,
    code: "USDT",
    name: "tether",
    targetConfirms: 3,
    enableDeposit: true,
    enableWithdraw: true,
    feeWithdraw: 0.01,
    minWithdraw: 0.01,
    minDeposit: 0.01,
    decimalAmount: 8,
    withdrawalAmount: 8,
  },
];

const initialState = {
  initialized: false,
  initializing: false,
  items: DEFAULT_ITEMS,
  currencies: DEFAULT_CURRENCY,
  channelId: -1,
};

/**
 * {
 *  "currency":"BTC",
    "name":"BTC",
    "amount":999987.991,
    "reserveAmount":12,
    "updated":1538438400000,
    "activeFlg": true
  }
 * @param {} state 
 * @param {*} action 
 */
export function balanceReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
