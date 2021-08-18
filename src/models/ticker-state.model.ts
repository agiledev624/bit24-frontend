import { Instrument } from "./instrument.model";
import { TickerModel } from "./ticker.model";

export interface TickerState {
  items: TickerModel[];
  instruments: {
    [x: number]: Instrument;
  };
  instrumentLoaded: boolean;
}
