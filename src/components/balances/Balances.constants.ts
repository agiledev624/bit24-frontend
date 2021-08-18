import { AppTradeType } from "@/constants/trade-type";

export const wallets = Object.values(AppTradeType);

const MARGIN_LEFT = 5;
export const TOTAL_WIDTH = 235; // width - room for react-virtualized scrollbar
export const NUMBER_OF_SHOWING_ROWS = 2;
export const DEFAULT_TICKER_WIDTH = 60;
export const MIN_TICKER_WIDTH = 56;
export const MIN_AMOUNT_CHARACTERS = 10;
export const DEFAULT_AMOUNT_WIDTH =
  (TOTAL_WIDTH - DEFAULT_TICKER_WIDTH) / 3 + MARGIN_LEFT;
export const BALANCES_TABLE_HEADER_HEIGHT = 20;
export const BALANCES_TABLE_TOTAL_ROW_HEIGHT = 20;
export const BALANCES_TABLE_COMBINED_ROW_HEIGHT = 40;
export const BALANCES_TABLE_HEIGHT =
  BALANCES_TABLE_COMBINED_ROW_HEIGHT * NUMBER_OF_SHOWING_ROWS;
export const BALANCES_TABLE_FONT_SIZE = 11;
export const MAX_AMOUNT_WITH_DECIMALS = 1000000;

export function createEmptyWallet(obj) {
  const balance = { ...obj };
  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    balance[wallet] = {
      available: 0,
      reserved: 0,
      total: 0,
    };
  }

  return balance;
}
