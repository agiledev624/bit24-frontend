import { SymbolValue } from "@/constants/symbol-enums";

export interface Instrument {
  minSize: number;
  maxSize: number;
  bidPrice: number;
  askPrice: number;
  symbol: string;
  symbolEnum: SymbolValue;
  priceIncrement: number;
}
