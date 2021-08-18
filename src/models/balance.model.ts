import { WalletType } from "@/constants/balance-enums";

export type BalanceFundInfo = {
  available: number;
  reserved: number;
  total: number;
};

export type BalanceInfo = {
  id: string | number;
  wallet: WalletType;
  code: string;
} & BalanceFundInfo;

export type BalancesObject = {
  [ccy: string]: {
    [w in WalletType]: BalanceInfo;
  } &
    CurrencyInfo & {
      code: string;
    };
};

export interface CurrencyInfo {
  id: number;
  code: string;
  name: string;
  targetConfirms: number;
  enableDeposit: boolean;
  enableWithdraw: boolean;
  feeWithdraw: number;
  minWithdraw: number;
  minDeposit: number;
  decimalAmount: number;
  withdrawalAmount: number;
}
