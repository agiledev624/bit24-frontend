import { closeModal, showModal } from "@/actions/app.actions";
import { submitNewOrder } from "@/actions/order.actions";
import { subtract } from "@/exports/math";
import { getAmountDecimals } from "@/exports/ticker.utils";
import OrderMarginConfirmationPopup from "./OrderForm.confirm-popup";
import {
  commonOrderValidator,
  isSameSide,
  isValidAmount,
} from "./OrderForm.helpers";
import {
  AdditionPopupData,
  OrderFormContainerProps,
  OrderFormControlsState,
} from "./OrderForm.types";

// export const selectedType = OrderType.LIMIT;

// export const ENABLE_ORDER_TYPES = [
//   {
//     title: getOrderTypeNameById(OrderType.LIMIT), //TODO: i18n
//     to: OrderType.LIMIT
//   },
//   {
//     title: getOrderTypeNameById(OrderType.MARKET),
//     to: OrderType.MARKET
//   },
//   {
//     title: 'Stop',
//     to: 'Stop',
//     dropdown: {
//       options: [{
//         label: getOrderTypeNameById(OrderType.STOP_LMT),
//         value: OrderType.STOP_LMT
//       }, {
//         label: getOrderTypeNameById(OrderType.STOP_MKT),
//         value: OrderType.STOP_MKT
//       }]
//     }
//   }
// ];

export function orderValidationFn(
  {
    tradeOptions,
    lowestSellPrice,
    highestBuyPrice,
    side,
    stopPrice,
    price,
    amount,
    type,
    onError,
    executedLongCash,
    executedLongPosition,
    leverage,
  },
  props
) {
  const { pair } = props;

  if (!isValidAmount(pair, amount)) {
    if (onError) {
      onError();
    }

    return false;
  }

  const { position, tickerPrice, balances, wallet, asks, bids } = props;

  let remainAmount = amount;

  if (!isSameSide(position, { sideId: side })) {
    const { amount: positionAmount } = position;
    const decimalAmount = getAmountDecimals(pair);
    const diff = +subtract(amount, positionAmount);
    const fixedDiff = +diff.toFixed(decimalAmount);
    // amount <= positionAmount -> system does not hold balance
    // so if amount > position amount. We will validate order based on different amount
    // (but still keeping original amount when submit order, that's trick)
    if (diff > 0) {
      remainAmount = fixedDiff;
    } else {
      remainAmount = 0;
    }
  }

  return commonOrderValidator({
    tradeOptions,
    type,
    tickerPrice,
    lowestSellPrice,
    highestBuyPrice,
    pair,
    side,
    price,
    amount: remainAmount,
    balances,
    wallet,
    stopPrice,
    asks,
    bids,
    onError,
    executedLongCash,
    executedLongPosition,
    leverage,
    ignoreAmountValidate: true,
    onSucces: ({ side, pair }) => {
      // if (side === 1) {
      //   trackBuyOrder(pair);
      // } else {
      //   trackSellOrder(pair);
      // }
    },
  });
}

/**
 * @param {number} clientOrderId: clientOrderId
 * @param {number} type: typeId
 * @param {number} side: side Id
 * @param {number} price: price
 * ...
 */
export function submitOrderFn(
  {
    tradeOptions,
    clientOrderId,
    tif,
    type,
    side,
    price,
    amount,
    stopPrice,
    dispatch,
  },
  props: OrderFormContainerProps,
  state: OrderFormControlsState,
  extraData: AdditionPopupData
) {
  if (!props.immediateSubmit) {
    // const priceDecimals = getPriceDecimals(props.pair);
    // const amountDecimals = getAmountDecimals(props.pair);
    // // const orderType = getOrderTypeNameById(type);
    // const orderType = 'order-type-name';

    const mId = "order_confirm_popup";

    dispatch(
      showModal(mId, OrderMarginConfirmationPopup, {
        leverage: extraData.selectedLeverage,
        wallet: props.wallet,
        mmr: props.mmr,
        tif: state.tif,
        mId: mId,
        total: state.total,
        closePopup: () => dispatch(closeModal(mId)),
        orderType: type,
        marginType: extraData.marginType,
        amount,
        price,
        stopPrice,
        symbol: props.pair,
        side,
        submit: (clientId) => {
          dispatch(
            submitNewOrder({
              tradeOptions,
              tif,
              clientOrderId,
              type,
              pair: props.pair,
              side,
              price,
              amount,
              stopPrice,
            })
          );

          // hide modal
          dispatch(closeModal(mId));
        },
      })
    );
  } else {
    dispatch(
      submitNewOrder({
        tradeOptions,
        tif,
        clientOrderId,
        type,
        pair: props.pair,
        side,
        price,
        amount,
        stopPrice,
      })
    );
  }
}
