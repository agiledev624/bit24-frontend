import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { OrderSide, OrderType } from "@/constants/order-enums";
import {
  getMaxAmount,
  getMaxPrice,
  getMinAmount,
  getMinPrice,
  getSymbols,
} from "@/exports/ticker.utils";
import {
  divide,
  isGreaterThan,
  isGreaterThanOrEquals,
  isLessThan,
  isLessThanOrEquals,
  multiply,
} from "@/exports/math";
import { formatNumber, sliceTo } from "@/exports/format-number";
import { WalletType } from "@/constants/balance-enums";
import { toast } from "@/ui-components";

export function isValidPrice(price) {
  if (!Number(price)) {
    toast.open({
      type: "error",
      message: `Price required.`,
      header: "Order Rejected",
    });
    return false;
  }

  return true;
}

export function isLimitOrder(typeId: OrderType) {
  return (
    typeId === OrderType.LIMIT ||
    typeId === OrderType.HIDDEN ||
    typeId === OrderType.STOP_LMT
  );
}

export function isMarketOrder(typeId) {
  return typeId === OrderType.MARKET || typeId === OrderType.STOP_MKT;
}

export function isStopLimitOrder(typeId) {
  return (
    typeId === OrderType.STOP_LMT ||
    typeId === OrderType.OCO ||
    typeId === OrderType.STOP_MKT
  );
}

export function isStopMarketOrder(typeId) {
  return typeId === OrderType.STOP_MKT;
}

// picked price: either is `stopPrice` if typeId = STOP_MARKET or `tickerPrice` if typeId = MARKET otherwise using `price`
export function getPickedPrice({ typeId, price, tickerPrice, stopPrice }) {
  if (!tickerPrice) tickerPrice = price;

  return (tickerPrice = isStopMarketOrder(typeId)
    ? +stopPrice
    : isMarketOrder(typeId)
    ? +tickerPrice
    : +price);
}

export function calculatedTotal({
  typeId,
  price,
  stopPrice,
  tickerPrice,
  amount,
}): number {
  const p = getPickedPrice({ typeId, price, stopPrice, tickerPrice });

  return +multiply(p, +amount);
}

export function validateLimitOrder({
  lowestSellPrice,
  highestBuyPrice,
  pair,
  tickerPrice,
  side,
  price,
  amount,
  available,
}) {
  const maxPrice = getMaxPrice(pair);

  // console.warn('maxPrice', maxPrice, price);

  if (isGreaterThan(price, maxPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `Invalid order (maximum order price for ${pair} is ${maxPrice})`
    // });

    return false;
  }

  let minPrice = getMinPrice(pair);

  if (side === OrderSide.BUY) {
    const total = multiply(price, amount);
    if (!_validateBuyingAmount(pair, amount, total, available)) {
      return false;
    }

    let basedPrice = lowestSellPrice ? lowestSellPrice : tickerPrice;

    const maxPrice = multiply(basedPrice, 1.1);

    console.log("[buy] maxPrice", maxPrice, basedPrice, lowestSellPrice);

    if (isGreaterThan(price, maxPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Order Price is more than 10% of ticker price, abort.`
      // });

      return false;
    }
  } else {
    // amount > available balance
    if (!_validateSellingAmount(pair, amount, available)) {
      return false;
    }

    let basedPrice = highestBuyPrice ? highestBuyPrice : tickerPrice;

    minPrice = +multiply(basedPrice, 0.9);
  }

  // console.warn('price, minPrice', price, minPrice);

  if (isLessThan(price, minPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `Order Price is more than 10% of ticker price, abort`
    // });
    return false;
  }

  return true;
}

export function validateOCOOrder({
  pair,
  tickerPrice = 0,
  side,
  price,
  amount,
  available,
  stopPrice,
}) {
  // stopPrice ...
  if (!Number(stopPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `OCO Stop Price required`
    // });

    return false;
  }

  let minPrice = getMinPrice(pair);
  let maxPrice = getMaxPrice(pair);

  if (isGreaterThan(price, maxPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `Higher than max price`
    // });

    return false;
  }

  /**
  - Buy OCO: 
  + Limit price < ticker price < Stop-limit price
  + min trade <= amount <= max trade
  + stop Price <= maxPrice
  + amount*Limitprice <= available balance
      */
  if (side === OrderSide.BUY) {
    const total = multiply(price, amount);

    if (!_validateBuyingAmount(pair, amount, total, available)) {
      return false;
    }

    if (isGreaterThan(stopPrice, maxPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (maximum stop price for ${pair} is ${maxPrice})`
      // });

      return false;
    }

    if (isGreaterThanOrEquals(tickerPrice, stopPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (Stop price must be bigger than ticker price)`
      // });
      return false;
    }

    if (isGreaterThanOrEquals(price, tickerPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (Ticker price must be bigger than price)`
      // });

      return false;
    }
  } else if (side === OrderSide.SELL) {
  /*
  - Sell OCO: 
  + Stop-limit price < ticker Price <  Limit price
  + min trade <= amount <= max trade
  + stop price >= minPrice
  + amount <= available balance
  */
    // amount > available balance
    if (!_validateSellingAmount(pair, amount, available)) {
      return false;
    }

    if (isGreaterThanOrEquals(stopPrice, tickerPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (Ticker price must be bigger than stop price)`
      // });
      return false;
    }
    // ticker Price <  Limit price
    if (isGreaterThanOrEquals(tickerPrice, price)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (Price must be bigger than ticker price)`
      // });

      return false;
    }

    // stopPrice >= minPrice
    if (isLessThan(stopPrice, minPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (minimum stop price for ${pair} is ${minPrice})`
      // });

      return false;
    }
  }

  if (isLessThan(price, minPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: ` Order Price is more than 10% of ticker price, abort.`
    // });
    return false;
  }

  return true;
}

export function validateMarketOrder({
  pair,
  amount,
  tickerPrice,
  side,
  available,
}) {
  if (side === OrderSide.BUY) {
    const maxAmount = divide(available, tickerPrice);
    if (!_validateBuyingAmount(pair, amount, amount, maxAmount)) {
      return false;
    }
  } else if (side === OrderSide.SELL) {
    // amount > available balance
    if (!_validateSellingAmount(pair, amount, available)) {
      return false;
    }
  }

  return true;
}

export function validateStopLimitOrder({
  pair,
  tickerPrice,
  side,
  price,
  amount,
  available,
  stopPrice,
}) {
  const maxPrice = getMaxPrice(pair);

  if (isGreaterThan(price, maxPrice) || isGreaterThan(stopPrice, maxPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `Invalid order (maximum order price for ${pair} is ${maxPrice})`
    // });

    return;
  }

  // stopPrice ...
  if (!Number(stopPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `Stop Price required`
    // });

    return false;
  }
  let minPrice = getMinPrice(pair);

  //Với lệnh stop-limit buy: Chỉ được phép đặt stop price > lastprice (hoặc lowest sell)
  if (side === OrderSide.BUY) {
    if (isLessThanOrEquals(stopPrice, tickerPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (stop price must be bigger than ticker price)`
      // });
      return false;
    }

    // Validate Price tức là Limit price: min price <=  Price <= stop-price+10%stop price, min price theo decimal
    const maxPrice = multiply(stopPrice, 1.1);
    if (isGreaterThan(price, maxPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Order Price is more than 10% of stop price, abort.`
      // });

      return false;
    }

    const total = multiply(price, amount);
    if (!_validateBuyingAmount(pair, amount, total, available)) {
      return false;
    }
    //Với lệnh stop-limit sell: Chỉ được phép đặt stop price < lastprice(hoặc highest buy)
  } else if (side === OrderSide.SELL) {
    // amount > available balance
    if (!_validateSellingAmount(pair, amount, available)) {
      return false;
    }

    if (isGreaterThanOrEquals(stopPrice, tickerPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (stop price must be smaller than ticker price)`
      // });
      return false;
    }

    if (isLessThan(stopPrice, minPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (minimum stop price for ${pair} is ${minPrice})`
      // });

      return false;
    }

    // Validate Price tức là Limit price: Price >= stop-price-10%stop price, min price theo decimal
    minPrice = +multiply(stopPrice, 0.9);
  }

  if (isLessThan(price, minPrice)) {
    // toast.open({
    //   type: 'error',
    //   // message: ` Order Price is less than 10% of ticker price, abort.`
    //   message: ` Order Price is more than 10% of ticker price, abort.`
    // });
    return false;
  }

  return true;
}

export function validateStopMarketOrder({
  pair,
  tickerPrice,
  side,
  amount,
  available,
  stopPrice,
}) {
  const maxPrice = getMaxPrice(pair);

  if (isGreaterThan(stopPrice, maxPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `Invalid order (maximum order price for ${pair} is ${maxPrice})`
    // });

    return;
  }

  // stopPrice ...
  if (!Number(stopPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `Stop Price required`
    // });

    return false;
  }
  let minPrice = getMinPrice(pair);

  //Với lệnh stop-limit buy: Chỉ được phép đặt stop price > lastprice (hoặc lowest sell)
  if (side === OrderSide.BUY) {
    const total = multiply(stopPrice, amount);
    if (!_validateBuyingAmount(pair, amount, total, available)) {
      return false;
    }

    if (isLessThanOrEquals(stopPrice, tickerPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (stop price must be bigger than ticker price)`
      // });
      return false;
    }
    //Với lệnh stop-limit sell: Chỉ được phép đặt stop price < lastprice(hoặc highest buy)
  } else if (side === OrderSide.SELL) {
    // amount > available balance
    if (!_validateSellingAmount(pair, amount, available)) {
      return false;
    }

    if (isGreaterThanOrEquals(stopPrice, tickerPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (stop price must be smaller than ticker price)`
      // });
      return false;
    }

    if (isLessThan(stopPrice, minPrice)) {
      // toast.open({
      //   type: 'error',
      //   message: `Invalid order (minimum stop price for ${pair} is ${minPrice})`
      // });

      return false;
    }
  }

  return true;
}

export function isValidAmount(pair, amount) {
  if (!amount) {
    toast.open({
      type: "error",
      message: `Amount required.`,
      header: "Order Rejected",
    });

    return false;
  }

  const minAmount = getMinAmount(pair);
  const maxAmount = getMaxAmount(pair);

  if (isLessThan(amount, minAmount)) {
    // toast.open({
    //   type: 'error',
    //   message: `Invalid order (minimum order size for ${pair} is ${minAmount})`
    // });

    return false;
  }

  if (isGreaterThan(amount, maxAmount)) {
    // toast.open({
    //   type: 'error',
    //   message: `Invalid order (maximum order size for ${pair} is ${maxAmount})`
    // });

    return false;
  }

  return true;
}

function _validateBuyingAmount(pair, amount, total, available) {
  if (isGreaterThan(total, available)) {
    // const baseCc = firstInPair(pair);

    // toast.open({
    //   type: 'error',
    //   message: `Invalid order (not enough balance for buying ${amount} ${baseCc})`
    // });

    return false;
  }

  return true;
}

function _validateSellingAmount(pair, amount, available) {
  if (isGreaterThan(amount, available)) {
    // const baseCc = firstInPair(pair);

    // toast.open({
    //   type: 'error',
    //   message: `Invalid order (not enough balance for selling ${amount} ${baseCc})`
    // });

    return false;
  }

  return true;
}

/**
 *
 * @param {string} pair
 * @param {string} side BUY | SELL
 * @param {string} wallet WalletType
 */
export function getBalanceBySide(
  { pair, side, balances, wallet },
  beautify = false
) {
  if (_isEmpty(balances)) return 0;

  if (!wallet) {
    throw new Error("[getBalanceBySide] wallet is required");
  }

  const [base, counter] = getSymbols(pair);
  const currency = isBuy(side) ? counter : base;
  // const leverage = getLeverage(pair);

  let available = _get(balances, [currency, wallet, "available"], 0) || 0;

  // if (wallet === "margin") {
  //   available = multiply(leverage, available);
  // }
  const number = sliceTo(available, 8);

  return beautify ? formatNumber({ number }) : number;
}

export function validateIOCOrder({ pair, side, price, amount, available }) {
  const maxPrice = getMaxPrice(pair);
  let minPrice = getMinPrice(pair);

  if (isGreaterThan(price, maxPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `Invalid order (maximum order price for ${pair} is ${maxPrice})`
    // });

    return false;
  }

  if (side === OrderSide.BUY) {
    const total = multiply(price, amount);
    if (!_validateBuyingAmount(pair, amount, total, available)) {
      return false;
    }
  } else {
    // amount > available balance
    if (!_validateSellingAmount(pair, amount, available)) {
      return false;
    }
  }

  // console.warn('price, minPrice', price, minPrice);

  if (isLessThan(price, minPrice)) {
    // toast.open({
    //   type: 'error',
    //   message: `Order Price is more than 10% of ticker price, abort`
    // });
    return false;
  }

  return true;
}

export function getSideTitleByWallet({ side, wallet }) {
  // eslint-disable-next-line default-case
  switch (wallet) {
    case WalletType.EXCHANGE: {
      return side;
    }
    case WalletType.DERIVATIVE: {
      if (isBuy(side)) {
        return "long";
      } else if (isSell(side)) {
        return "short";
      }
    }
  }

  return "N/A";
}

/**
 * @param {OrderSide} side
 * @returns {boolean}
 */
export function isBuy(side: OrderSide) {
  return side === OrderSide.BUY;
}

export function isSell(side: OrderSide) {
  return side === OrderSide.SELL;
}

export function validateBookBeforePlaceMarket(side, asks, bids) {
  return (
    (side === OrderSide.BUY && !!asks.length) ||
    (side === OrderSide.SELL && !!bids.length)
  );
}

/**
 * comparation between a position and a coming order
 * to determine this order is wether margin or close
 * @param {object} position
 * @param {object} order
 *
 * @returns {boolean}
 */
export function isSameSide(position, { sideId }) {
  if (!position) return true; // if there is no position, we are submitting a new margin order

  const { side } = position; // Long | Short

  return (
    (sideId === OrderSide.BUY && side === "Long") ||
    (sideId === OrderSide.SELL && side === "Short")
  );
}

export function commonOrderValidator({
  tradeOptions,
  type,
  tickerPrice,
  lowestSellPrice,
  highestBuyPrice,
  pair,
  side,
  price,
  amount,
  balances,
  wallet,
  stopPrice,
  asks,
  bids,
  onSucces,
  onError,
  ignoreAmountValidate = false,
  executedLongCash,
  executedLongPosition,
  leverage,
}) {
  const weightedPrice = price * amount;

  const LP =
    (((weightedPrice + executedLongCash) / (amount + executedLongPosition)) *
      leverage) /
    (leverage + 1 - 0.003 * leverage);

  console.log(
    "LP",
    LP,
    "place price",
    price,
    "highest buy",
    highestBuyPrice,
    "lowest sell",
    lowestSellPrice
  );
  // if the LP is lower than the price of the order being sent it will be rejected.
  // You are checking to ensure the price of the order being sent is lower than the liquidation price.  Why send an order that will be immediately liquidated??
  // if (
  //   (side === OrderSide.BUY && isGreaterThan(price, LP))
  //   // (side === OrderSide.SELL && isLessThan(LP, lowestSellPrice))
  // ) {
  //   toast.error(`sending invalid LP for an order has orderType=${side}`, 'order rejected', 100000);
  //   return false;
  // }

  if (
    (!ignoreAmountValidate && !isValidAmount(pair, amount)) ||
    !isValidPrice(price)
  ) {
    if (onError) {
      onError();
    }

    return false;
  }
  return true;

  const available = getBalanceBySide({
    pair,
    side: side === OrderSide.BUY ? "Buy" : "Sell",
    balances,
    wallet,
  });

  let validateFunc;

  // eslint-disable-next-line default-case
  switch (type) {
    case OrderType.LIMIT: {
      validateFunc = validateLimitOrder;
      break;
    }
    // case OrderType.FoK:
    // case IMMEDIATE_OR_CANCEL: {
    //   validateFunc = validateIOCOrder;
    //   break;
    // }
    case OrderType.STOP_LMT: {
      validateFunc = validateStopLimitOrder;
      break;
    }
    case OrderType.MARKET: {
      if (validateBookBeforePlaceMarket(side, asks, bids)) {
        validateFunc = validateMarketOrder;
      } else {
        // toast.open({
        //   type: 'error',
        //   message: `Invalid order (Empty orderbook)`
        // });
        // EventRegister.emit(ON_ORDER_ERROR);
      }
      break;
    }
    case OrderType.STOP_MKT: {
      validateFunc = validateStopMarketOrder;

      break;
    }
    case OrderType.OCO: {
      validateFunc = validateOCOOrder;
      break;
    }
  }

  const valid =
    validateFunc &&
    validateFunc({
      lowestSellPrice,
      highestBuyPrice,
      pair,
      tickerPrice,
      side,
      price,
      amount,
      available,
      stopPrice,
    });

  if (valid && onSucces) {
    onSucces({ side, pair });
  } else if (!valid && onError) {
    onError();
  }
  return valid;
}

export function isStopOrder(orderType: OrderType): boolean {
  return (
    shouldDisplayStopPriceField(orderType) ||
    shouldDisplayStandaloneStopPrice(orderType)
  );
}
export function shouldDisplayStopPriceField(orderType: OrderType): boolean {
  return orderType === OrderType.STOP_LMT;
}

export function shouldDisplayTrailValueField(orderType: OrderType): boolean {
  return orderType === OrderType.TSL || orderType === OrderType.TSM;
}

export function shouldHidePriceField(orderType: OrderType): boolean {
  return (
    orderType === OrderType.MARKET ||
    orderType === OrderType.STOP_LMT ||
    orderType === OrderType.SNIPER_MKT ||
    orderType === OrderType.STOP_MKT ||
    orderType === OrderType.TSM
  );
}

export function shouldDisplayTPnSLGroups(orderType: OrderType): boolean {
  return (
    orderType === OrderType.LIMIT ||
    orderType === OrderType.HIDDEN ||
    orderType === OrderType.MARKET
  );
}

export function shouldDisplayAdvancedGroups(orderType: OrderType): boolean {
  return (
    orderType === OrderType.LIMIT ||
    orderType === OrderType.HIDDEN ||
    orderType === OrderType.OCO ||
    orderType === OrderType.OCO_ICE ||
    orderType === OrderType.ICE ||
    orderType === OrderType.BRACKET ||
    orderType === OrderType.PEG ||
    orderType === OrderType.MARKET
  );
}

export function shouldDisplayStopTriggerGroup(orderType: OrderType): boolean {
  return (
    orderType === OrderType.STOP_LMT ||
    orderType === OrderType.STOP_MKT ||
    orderType === OrderType.TSL ||
    orderType === OrderType.OCO ||
    orderType === OrderType.OCO_ICE ||
    orderType === OrderType.PEG ||
    orderType === OrderType.BRACKET ||
    orderType === OrderType.TSM
  );
}

export function shouldDisplayStandaloneStopPrice(
  orderType: OrderType
): boolean {
  return (
    orderType === OrderType.OCO ||
    orderType === OrderType.PEG ||
    orderType === OrderType.OCO_ICE
  );
}

export function shouldDisplayStandaloneOffset(orderType: OrderType): boolean {
  return orderType === OrderType.BRACKET;
}

export function shouldDisplayTIFOptions(orderType: OrderType): boolean {
  return (
    orderType === OrderType.LIMIT ||
    orderType === OrderType.STOP_LMT ||
    orderType === OrderType.ICE ||
    orderType === OrderType.OCO_ICE ||
    orderType === OrderType.PEG ||
    orderType === OrderType.BRACKET ||
    orderType === OrderType.SNIPER_LIMIT ||
    orderType === OrderType.SNIPER_MKT ||
    orderType === OrderType.OCO
  );
}

export function shouldDisplayPriceIncreAndOffset(
  orderType: OrderType
): boolean {
  return orderType === OrderType.ICE || orderType === OrderType.OCO_ICE;
}

export function shouldDisplayLayers(orderType: OrderType): boolean {
  return orderType === OrderType.ICE || orderType === OrderType.OCO_ICE;
}
