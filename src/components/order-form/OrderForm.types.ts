import { WalletType } from "@/constants/balance-enums";
import {
  ICELayers,
  LastTradePriceType,
  MarginType,
  OrderSide,
  OrderType,
  StopTrigger,
  TIF,
  TradeOption,
} from "@/constants/order-enums";
import { OrderBookModel } from "@/models/book.model";
import { TabProps } from "@/ui-components/Tabs";

export interface OrderEntryInfo {
  clientOrderId: number;
  type: OrderType;
  side: OrderSide;
  stopPrice: number;
  price: number;
  amount: number;
  tif: TIF;
  tradeOptions: TradeOption[];
}

export type SubmitOrderEntryData = OrderEntryInfo & {
  dispatch: (action: any) => void;
};

export type OrderValidationData = OrderEntryInfo & {
  lowestSellPrice: number;
  highestBuyPrice: number;
  onError: () => void;
  executedLongCash: number;
  executedLongPosition: number;
  leverage: number;
};

export interface OrderFormContainerProps {
  dispatch: (action: any) => void;
  isLoggedIn: boolean;
  pair: string;
  wallet: WalletType;
  balances?: object;
  tradingFee: number;
  bids: OrderBookModel[];
  asks: OrderBookModel[];
  tickerPrice: number;
  isAuthenticated: boolean;
  isTradeLoaded: boolean;
  tradeType: string;
  submitOrderFn: (
    data: SubmitOrderEntryData,
    props: OrderFormContainerProps,
    state?: OrderFormControlsState,
    extraData?: AdditionPopupData
  ) => void;
  orderValidationFn: (data: OrderValidationData, props) => boolean;
  orderTypes: TabProps[]; // enabled types
  selectedType: OrderType;
  immediateSubmit: boolean;
  showCalculator: boolean;
  maxLeverage: number;
  executedLongCash: number;
  executedLongPosition: number;
  leverage: number;
  mmr: number;
  hidden: boolean;
}

export interface OrderFormControlsState {
  price: number;
  stopPrice: number;
  amount: number;
  typeId: OrderType;
  total: number;
  fund?: number;
  pair?: string;
  isTradeLoaded?: boolean;
  tif: TIF;
  tradeOptions: TradeOption[];
  leverage: number;
  takeProfit: number;
  stopLoss: number;
  takeProfitTradePriceType: LastTradePriceType;
  stopLossTradePriceType: LastTradePriceType;
  displaySize: number | undefined;
  refreshSize: number | undefined;
  enabledStopTrigger: boolean;
  selectedCloseTrigger: StopTrigger;
  trailValue: number;
  offset: number;
  priceIncrement: number;
  selectedLayer?: ICELayers;
  qtyIncrement: number;
}

export interface OrderFormControlsProps {
  onClickHandler: (
    data: OrderEntryInfo,
    onError: () => void,
    state: OrderFormControlsState,
    extraData: AdditionPopupData
  ) => void;
  side?: OrderSide;
  initialPrice: number;
  balances: object;
  isAuthenticated: boolean;
  pair: string;
  isTradeLoaded: boolean;
  wallet: WalletType;
  orderTypes: TabProps[]; // enabled types
  selectedType: OrderType;
  immediateSubmit: boolean;
  tradingFee: number;
  maxLeverage: number;
  mmr: number;
  hidden: boolean;
}

export type AdditionPopupData = {
  side: OrderSide;
  marginType?: MarginType;
  selectedLeverage?: number;
};

export type OrderFormInputDataFlows = OrderFormControlsState & {
  pair: string;
  side?: OrderSide;
  balance?: number;
  orderTypes: TabProps[];
  isAuthenticated: boolean;
  immediateSubmit: boolean;
  tradeType: string;
  onPriceChange: (price: number) => void;
  onStopPriceChange: (price: number) => void;
  onAmountChange: (amount: number) => void;
  onOrderBtnClick: (
    clientId: number,
    data: AdditionPopupData,
    cb?: () => void
  ) => void;
  onTotalChange: (total: number) => void;
  onUpdateAmountByBalancePercent: (
    balance: number,
    percent: number,
    side: any
  ) => void;
  onOrderTypeChange: (orderType: string) => void;
  onTIFChange: (tif: TIF) => void;
  onTradeOptionChange: (tradeOptions: TradeOption[]) => void;
  onLeverageChange: (leverage: number) => void;
  onTakeProfitChange: (price: number) => void;
  onStopLossChange: (price: number) => void;
  onTakeProfitLastTradePriceTypeChange: (
    lastTradePriceType: LastTradePriceType
  ) => void;
  onStopLossLastTradePriceTypeChange: (
    lastTradePriceType: LastTradePriceType
  ) => void;
  onDisplaySizeChange: (n: number) => void;
  onRefreshSizeChange: (n: number) => void;
  onToggleStopTrigger: (_, e) => void;
  onCloseTriggerOptionChange: (opiton: string) => void;
  onTrailValueChange: (n: string) => void;
  onOffsetChange: (n: number) => void;
  onPriceIncrementChange: (n: number) => void;
  onLayerChange: (layer: ICELayers) => void;
  onQtyIncrementChange: (n: number) => void;
};

export type OrderFormProps = OrderFormControlsState &
  OrderFormInputDataFlows & {
    mmr: number;
    balances: object;
    maxLeverage: number;
    wallet: WalletType;
    hidden: boolean;
  };
