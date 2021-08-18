export enum PositionSide {
  SHORT = 1,
  LONG = 2,
}

export enum PositionType {
  MARGIN = 1,
  DERIVATIVE = 2,
}

export enum FundingType {
  DAILY = 1,
  TERM = 2,
}

export function getPositionSide(amount: number): PositionSide {
  return amount < 0 ? PositionSide.SHORT : PositionSide.LONG;
}
