import { formatNumber, generateAlertId } from "@/exports";
import { getCurrentStyle, TRADING_PRIMITIVE_FONT } from "./Chart.themes";

function orderTypeLetter(order) {
  const type = order.type.toLowerCase();

  if (type.match(/^limit/i)) {
    return "L";
  } else if (type.match(/^stop-limit/i)) {
    return "S";
  } else if (type.match(/^stop-market/i)) {
    return "S-M";
  } else if (type.match(/^oco-limit/i)) {
    return "OCO-L";
  } else if (type.match(/^oco-sm/i)) {
    return "OCO-SM";
  }

  return "";
}

const formatPosition = (number) => formatNumber({ number, decimals: 2 });
const formatAlertPrice = (number) =>
  formatNumber({ number, significantFigures: 5 });

export function createOrderPrimitive(
  chart,
  order,
  changeOrderPrice,
  modifyOrder,
  cancelOrder,
  orders
) {
  const style = getCurrentStyle();

  const orderType = order.side === "SELL" ? "ask" : "bid";
  const orderText = orderTypeLetter(order);

  return (
    chart
      .createOrderLine({ disableUndo: true })
      // .onMove(function() {
      //     const id = this.getTooltip();
      //     const price = this.getPrice();

      //     changeOrderPrice(id, price, orders);
      // })
      // .onModify(function() {
      //     const id = this.getTooltip();
      //     modifyOrder(id);
      // })
      .onCancel(function () {
        //@ts-ignore
        const id = this.getTooltip();
        cancelOrder(id, order.pair);
      })
      .setPrice(orderText.includes("S") ? order.stopPrice : order.price)
      .setText(orderText)
      .setLineLength(85)
      .setLineStyle(1)
      .setTooltip(order.id)
      .setLineColor(style.ordersVis[orderType].lineColor)
      .setBodyTextColor(style.ordersVis[orderType].bodyTextColor)
      .setBodyBorderColor(style.ordersVis[orderType].bodyBorderColor)
      .setBodyBackgroundColor(style.ordersVis[orderType].bodyBackgroundColor)
      .setQuantityFont(TRADING_PRIMITIVE_FONT)
      .setQuantityTextColor(style.ordersVis[orderType].quantityTextColor)
      .setQuantityBorderColor(style.ordersVis[orderType].quantityBorderColor)
      .setQuantityBackgroundColor(
        style.ordersVis[orderType].quantityBackgroundColor
      )
      .setCancelButtonIconColor(
        style.ordersVis[orderType].cancelButtonIconColor
      )
      .setCancelButtonBorderColor(
        style.ordersVis[orderType].cancelButtonBorderColor
      )
      .setCancelButtonBackgroundColor(
        style.ordersVis[orderType].cancelButtonBackgroundColor
      )
      .setBodyFont(TRADING_PRIMITIVE_FONT)
      .setQuantity(Math.abs(order.remainQuantity))
  );
}

export function createPositionPrimitive(chart, position, closePosition) {
  const style = getCurrentStyle();

  return chart
    .createPositionLine({ disableUndo: true })
    .onClose(function () {
      //@ts-ignore
      const pair = this.getTooltip();
      closePosition(position.amount, pair, position.side);
    })
    .setPrice(position.basePrice)
    .setText(
      `P/L: ${formatPosition(position.pnl)} (${formatPosition(
        position.pnlPerc
      )}%)`
    )
    .setLineLength(80)
    .setTooltip(position.symbol)
    .setLineColor(style.posVis.lineColor)
    .setBodyBorderColor(style.posVis.bodyBorderColor)
    .setBodyBackgroundColor(style.posVis.bodyBackgroundColor)
    .setBodyTextColor(style.posVis.bodyTextColor)
    .setQuantityBorderColor(style.posVis.quantityBorderColor)
    .setQuantityBackgroundColor(style.posVis.quantityBackgroundColor)
    .setQuantityTextColor(style.posVis.quantityTextColor)
    .setCloseButtonBorderColor(style.posVis.cancelButtonBorderColor)
    .setCloseButtonBackgroundColor(style.posVis.cancelButtonBackgroundColor)
    .setCloseButtonIconColor(style.posVis.cancelButtonIconColor)
    .setQuantityFont(TRADING_PRIMITIVE_FONT)
    .setBodyFont(TRADING_PRIMITIVE_FONT)
    .setQuantity(Math.abs(position.amount));
}

export function createLiquidationPricePrimitive(chart, position) {
  const style = getCurrentStyle();

  return chart
    .createPositionLine({ disableUndo: true })
    .setPrice(position.liqPrice)
    .setText("Liquidation")
    .setLineLength(85)
    .setTooltip(position.id)
    .setLineColor(style.posVis.lineColor)
    .setBodyBorderColor(style.posVis.bodyBorderColor)
    .setBodyBackgroundColor(style.posVis.bodyBackgroundColor)
    .setBodyTextColor(style.posVis.bodyTextColor)
    .setQuantityBorderColor(style.posVis.quantityBorderColor)
    .setQuantityBackgroundColor(style.posVis.quantityBackgroundColor)
    .setQuantityTextColor(style.posVis.quantityTextColor)
    .setCloseButtonBorderColor(style.posVis.cancelButtonBorderColor)
    .setCloseButtonBackgroundColor(style.posVis.cancelButtonBackgroundColor)
    .setCloseButtonIconColor(style.posVis.cancelButtonIconColor)
    .setQuantityFont(TRADING_PRIMITIVE_FONT)
    .setBodyFont(TRADING_PRIMITIVE_FONT)
    .setQuantity("");
}

export function createPriceAlertPrimitive(
  chart,
  alertPriceStr,
  alertPair,
  createAlert,
  removeAlert
) {
  const style = getCurrentStyle();

  const pair = alertPair;
  const id = generateAlertId(pair, alertPriceStr);

  const price = Number.parseFloat(alertPriceStr);

  return chart
    .createOrderLine({ disableUndo: true })
    .onMove(function () {
      //@ts-ignore
      const id = this.getTooltip();
      //@ts-ignore
      const newPrice = formatAlertPrice(this.getPrice());
      createAlert(alertPair, newPrice);
      removeAlert(id);
    })
    .onCancel(function () {
      //@ts-ignore
      removeAlert(this.getTooltip());
    })
    .setPrice(price)
    .setText("Alert")
    .setLineLength(85)
    .setTooltip(id)
    .setLineColor(style.alerts.lineColor)
    .setBodyBorderColor(style.alerts.bodyBorderColor)
    .setBodyBackgroundColor(style.alerts.bodyBackgroundColor)
    .setBodyTextColor(style.alerts.bodyTextColor)
    .setQuantityBorderColor(style.alerts.quantityBorderColor)
    .setQuantityBackgroundColor(style.alerts.quantityBackgroundColor)
    .setQuantityTextColor(style.alerts.quantityTextColor)
    .setCancelButtonBorderColor(style.alerts.cancelButtonBorderColor)
    .setCancelButtonBackgroundColor(style.alerts.cancelButtonBackgroundColor)
    .setCancelButtonIconColor(style.alerts.cancelButtonIconColor)
    .setQuantityFont(TRADING_PRIMITIVE_FONT)
    .setBodyFont(TRADING_PRIMITIVE_FONT)
    .setQuantity("");
}
