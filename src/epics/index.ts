import {
  dataFeed,
  adminRisk,
  wsOnAdminRiskMessageEpic,
  onWebWorkerEpic,
  wsOnMessageEpic,
  wsOnMarketMessageEpic,
} from "./ws.epics";
import {
  loginSuccessEpic,
  loginEpic,
  login2FAEpic,
  logoutEpic,
  logoutSuccessEpic,
} from "./auth.epics";
import { storageSaveEpic, storageDeleteEpic } from "./storage.epics";
import { uiSettingEpic } from "./ui-setting.epics";
import {
  initTickerEpic,
  getFutureTickerEpic,
  instrumentRequestEpic,
} from "./ticker.epics";
import { initBookEpic } from "./book.epics";
import { initTradeEpic } from "./trade.epics";

export const rootEpic = {
  adminRisk,
  onWebWorkerEpic,
  // dataFeed,
  wsOnAdminRiskMessageEpic,
  wsOnMarketMessageEpic,
  // setupWsConnectionEpic,
  // testAdminRiskEpic,
  wsOnMessageEpic,
  loginSuccessEpic,
  loginEpic,
  login2FAEpic,
  logoutEpic,
  logoutSuccessEpic,
  storageSaveEpic,
  storageDeleteEpic,
  uiSettingEpic,
  initTickerEpic,
  getFutureTickerEpic,
  instrumentRequestEpic,
  initBookEpic,
  initTradeEpic,
};
