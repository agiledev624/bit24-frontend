import { AppTradeType } from "./trade-type";

export enum WalletType {
  EXCHANGE = 1,
  FUT,
  DERIVATIVE,
}

export function walletNameFromId(id) {
  switch (id) {
    case WalletType.EXCHANGE:
      return AppTradeType.SPOT;
    case WalletType.DERIVATIVE:
      return AppTradeType.DERIVATIVE;
    default:
      return "";
  }
}

export function getWalletIdFromName(name: AppTradeType) {
  switch (name) {
    case AppTradeType.SPOT:
      return WalletType.EXCHANGE;
    case AppTradeType.DERIVATIVE:
      return WalletType.DERIVATIVE;
    default:
      return null;
  }
}
