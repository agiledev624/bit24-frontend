import { isBuy } from "@/components/order-form/OrderForm.helpers";
import { OrderSide, OrderType, StopTrigger, TIF } from "@/constants/order-enums";
import { titleCase } from ".";

export function getLabelOrderType(orderType: OrderType): string {
  switch(orderType) {
    case OrderType.TSL: {
      return 'Trailing Stop Lmt'
    }
    case OrderType.TSM: {
      return 'Trailing Stop Mkt'
    }
    case OrderType.STOP_LMT: {
      return 'Stop Limit';
    }
    case OrderType.STOP_MKT: {
      return 'Stop Market';
    }
    case OrderType.OCO: {
      return 'OCO';
    }
    case OrderType.OCO_ICE: {
      return 'OCO Iceberg'
    }
    case OrderType.ICE: {
      return 'Iceberg';
    }
    case OrderType.PEG: {
      return 'Pegged';
    }
    default: {
      return titleCase(OrderType[orderType] as string);
    }
  }
}

export function getLabelOrderSide(orderSide: OrderSide): string {
  switch(orderSide) {
    case OrderSide.SELL: {
      return 'Sell'
    }
    case OrderSide.BUY: {
      return 'Buy'
    }
    case OrderSide.SELLSHORT: {
      return 'Sell short'
    }
  }
}

export function getLabelTIF(tif: TIF): string {
  switch(tif) {
    case TIF.FOK: {
      return 'Fill or Kill'
    }
    case TIF.GTC: {
      return 'Good till Cancel'
    }
    case TIF.IOC: {
      return 'Immediate or Cancel'
    }
  }
}

export function getLabelStopTrigger(trigger: StopTrigger = StopTrigger.LAST_PRICE) {
  switch(trigger) {
    case StopTrigger.INDEX: {
      return 'Index Price'
    }
    case StopTrigger.LAST_PRICE: {
      return 'Last Price'
    }
    case StopTrigger.MARK: {
      return 'Mark Price'
    }
  }
}

export function calculateLP({leverage, mmr, side, marginType, price, amount}) {
  // executedLongCash, executedShortCash, executedLongPosition, executedShortPosition 
  if(marginType) {
    // switch(marginType) {
    //   case MarginType.ISOLATE: {
    //     const t = (price * leverage);

    //     return isBuy(side) ? t/(leverage + 1 - (mmr * leverage)) : t/(leverage - 1 + (mmr * leverage));
    //   }

    //   case MarginType.CROSS: {

    //   }
    // }
    const weightedPrice = price * amount;

    const t = (weightedPrice * leverage);

    return isBuy(side) ? t/(leverage + 1 - (mmr * leverage)) : t/(leverage - 1 + (mmr * leverage));
  }
  
  return 0;
}