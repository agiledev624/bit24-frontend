import { AppTradeType } from "@/constants/trade-type";
import {
  getHeaderQuestions,
  getHeaderMarketDropdown,
  getHeaderMultilanguage,
  getHeaderSetting,
} from "./Header.helpers";

interface HeaderConfigData {
  marketLbl: string;
  tradeType?: AppTradeType;
  theme?: string;
  lang: string;
  setLang: any;
  coin: string;
  setCoin: any;
  switchTheme?: any;
}

const CONTRACT_POSITION = 1;

export const getHeaderConfig = (data?: HeaderConfigData) => {
  const configs = [getHeaderQuestions(), getHeaderSetting(data)];

  // if(data?.tradeType === AppTradeType.DERIVATIVE) {
  //   configs.splice(CONTRACT_POSITION, 0, getHeaderContralDetail(data))
  // }

  return configs;
};
