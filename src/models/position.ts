import {
  FundingType,
  PositionSide,
  PositionType,
} from "@/constants/position-enums";

export interface DerivativePositionModel {
  id: string;
  niceSymbol: string;
  symbol: string;
  side: PositionSide;
  pnl: number;
  realisedPnl: number;
  pnlEquiv: number;
  // fundingCost: number,
  // fundingCostEquiv: number,
  stopPrice: number;
  limitPrice: number;
  pnlPerc: number;
  baseCC: string;
  counterCC: string;
  type: PositionType;
  niceType: string;
  // maintenanceMargin: number,
  fundingType: FundingType;
  niceFundingType: string;
  liqPrice: number;
  usedMargin: number;
  // basePrice: number,
  entryPrice: number;
  markPrice: number;
  amount: number;
  active: boolean;
  borrowedValue: number; //side, cost, amount, lastPrice
  netValue: number; // side, fundingCost: position.fundingFee, usedMargin: position.usedMargin, tickerPrice: lastPrice, pnl
}
