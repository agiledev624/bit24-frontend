import React, { PureComponent } from "react";

import _throttle from "lodash/throttle";
import _filter from "lodash/filter";
import _set from "lodash/set";
import _omit from "lodash/omit";

import {
  createChartWidget,
  convertCandleToTVFormat,
  generateEmptyCandle,
  getMsInInterval,
  extractCandlesFromSnapshot,
  getEarliestCandleTime,
  fetchCandlesAsync,
  executeAsync,
  getSymbolData,
} from "./Chart.utils";
import { getChartOverrides } from "./Chart.themes";
import {
  CHART_ROOT_ELEMENT,
  RESOLUTION_MAP,
  SERVER_SIDE_CUSTOMIZATION,
} from "./Chart.config";
import { updateMarks, sanitizeHtml, isMarksMessage } from "./Chart.mark";
import {
  createPriceAlertPrimitive,
  createOrderPrimitive,
  createPositionPrimitive,
  // createLiquidationPricePrimitive,
} from "./Chart.trade";
import {
  ADD_EMPTY_CANDLE_TO_END_DELAY,
  SNAPSHOT_CANDLES_NUMBER,
  DOUBLE_CLICK_THRESHOLD,
  INTERVAL,
  HISTORY_LOOKBACK_CANDLES,
  ANY_SYMBOL_MARK,
} from "./Chart.constants";
// import { EventRegister, ON_NEW_TRADE } from '../../../utils/events/index';
import ChartSaveLoadAdapter from "./ChartSaveLoadAdapter";
import { Card } from "@/ui-components";
import { chartSubscriber } from "./Chart.subject";

const NOOP = () => {};
const MAX_INTERVAL = 65 * 60 * 1000; // 65m
const MIN_INTERVAL = 15 * 60 * 1000; // 15m
const MULTIPLY_RESOLUTION = 3;

interface TVChartProps {
  pair: string;
  lastPrice: number;
  chartSettings: Object;
  timeDifference: number;
  interval: string;
  isSubscribed: boolean;
  candles?: any[];
  priceAlerts: any;
  orders?: any[];
  position?: any[];
  theme: string;
  height: number;
  currentChartTheme: string;
  updateChartTheme: (theme: string) => void;
  setOrderFormPrice: (price: number) => void;
  addPriceAlert: (pair, price) => void;
  changeOrderPrice: (id, price, orders) => void;
  modifyOrder: (id: number | string) => void;
  cancelOrder: (id: number | string, symbol: string) => void;
  removePriceAlert: (id) => void;
  closePosition: (amount, symbol, side) => void;
  updateChartSettings: (data, persist) => void;
  updateInterval: (nextInterval: number) => void;
  closeCard: (e: any) => void;
}

export default class TVChart extends PureComponent<Partial<TVChartProps>> {
  private widget = null;

  private chartReady = false;
  private waitingForSnapshot = false;
  private noMoreHistoricalCandles = false;
  private chartResetRequested = false;
  private resetCacheNeededCallbacks = {};

  private onRealtimeCallback = NOOP;
  private onDataCallback = NOOP;
  private onErrorCallback = NOOP;

  private candles = null;

  private addEmptyCandleToEndTimer;

  private getBarsRequest = {
    startTime: null,
    endTime: null,
  };

  private numberOfHistoricalCandlesRequests = 0;

  private chartCrosshairLastPrice = 0;
  private chartClickLastTime = 0;

  private priceAlertsPrimitives = null;
  private ordersPrimitives = null;
  private positionPrimitives = null;
  private liquidationPrimitives = null;
  private saveLoadAdapterRef;
  private scheduler;
  private _subscription$ = null;

  static defaultProps = {
    pair: "ETHBTC",
    interval: "1",
    setOrderFormPrice: NOOP,
  };

  state = {
    marks: {},
  };

  constructor(props) {
    super(props);

    this.onResetButtonClick = _throttle(
      this.onResetButtonClick.bind(this),
      3000
    );
    this.onChartReady = this.onChartReady.bind(this);
    this.resolveSymbol = this.resolveSymbol.bind(this);
    this.addEmptyCandleToEnd = this.addEmptyCandleToEnd.bind(this);
    this.saveChartSettings = this.saveChartSettings.bind(this);
    this.onChartClicked = this.onChartClicked.bind(this);
    this.onFetchCandlesSuccess = this.onFetchCandlesSuccess.bind(this);
    this.changeInterval = this.changeInterval.bind(this);

    this.saveLoadAdapterRef = React.createRef();

    this.widget = null;
    this.chartReady = false;
    this.resetCacheNeededCallbacks = {};
    this.scheduler = undefined;
  }

  // initialization code placed inside "componentDidMount"
  // because we need <div id=CHART_ROOT_ELEMENT> to be on the page
  componentDidMount() {
    this.widget = null;

    this.chartReady = false;
    this.waitingForSnapshot = false;
    this.noMoreHistoricalCandles = false;
    this.chartResetRequested = false;
    this.resetCacheNeededCallbacks = {};

    this.onRealtimeCallback = NOOP;
    this.onDataCallback = NOOP;
    this.onErrorCallback = NOOP;

    this.candles = null;

    this.addEmptyCandleToEndTimer = setInterval(this.addEmptyCandleToEnd, 1000);

    this.getBarsRequest = {
      startTime: null,
      endTime: null,
    };
    this.numberOfHistoricalCandlesRequests = 0;

    this.chartCrosshairLastPrice = 0;
    this.chartClickLastTime = 0;

    this.priceAlertsPrimitives = null;
    this.ordersPrimitives = null;
    this.positionPrimitives = null;
    this.liquidationPrimitives = null;

    this.initializeChartIfNecessary();
    document.addEventListener("ucm-chart", this.handleUcm);
    this._subscription$ = chartSubscriber().subscribe((data: any) => {
      if (
        this.chartReady &&
        data.pair === this.props.pair &&
        data.interval === RESOLUTION_MAP[this.props.interval]
      ) {
        const candle = _omit(data, ["pair", "interval"]);
        this.updateLastChartCandle(candle);
      }
    });
    // this.props.setInitialTimeDiff()
  }

  setScheduler(timerInMs, infinteTimer?: boolean) {
    if (timerInMs < MIN_INTERVAL) {
      timerInMs = MIN_INTERVAL;
    }

    if (timerInMs > MAX_INTERVAL) {
      timerInMs = MAX_INTERVAL;
    }

    this.clearScheduler();

    this.scheduler = setTimeout(() => {
      this.resetChartData();

      if (infinteTimer) {
        this.setScheduler(timerInMs);
      }
    }, timerInMs);
  }

  clearScheduler() {
    if (this.scheduler) {
      clearTimeout(this.scheduler);
      this.scheduler = undefined;
    }
  }

  componentWillUnmount() {
    clearInterval(this.addEmptyCandleToEndTimer);
    clearTimeout(this.scheduler);

    document.removeEventListener("ucm-chart", this.handleUcm);
    // EventRegister.off(ON_NEW_TRADE, this.updateLastCandleFromTrading, this)
    if (this._subscription$) {
      this._subscription$.unsubscribe();
    }

    try {
      this.widget.remove();
    } catch (e) {
      // ignore
    } finally {
      this.widget = null;
    }
  }

  initializeChartIfNecessary() {
    // const propsProvided = (lastPrice !== null && timeDifference !== null);

    const { pair, lastPrice, chartSettings, timeDifference, interval } =
      this.props;

    const propsProvided = lastPrice !== null && timeDifference !== null;

    if (this.widget === null && propsProvided) {
      this.widget = createChartWidget({
        datafeed: this,
        pair,
        interval,
        saveLoadAdapter: this.saveLoadAdapterRef.current.getAdapter(),
        chartSettings,
      });

      this.widget.onChartReady(this.onChartReady);
    }
  }

  componentDidUpdate(prevProps) {
    this.initializeChartIfNecessary();

    const {
      pair,
      interval,
      isSubscribed,
      candles,
      priceAlerts,
      orders,
      position,
    } = this.props;

    // pair/interval change, pair changes externally,
    // interval changes internally via getBars() ->  changeInterval()

    if (prevProps.pair !== null && prevProps.pair !== pair) {
      this.changePair();
    } else if (prevProps.interval !== null && prevProps.interval !== interval) {
      this.waitForSnapshot();
    }

    // reset chart
    if (isSubscribed && !prevProps.isSubscribed && this.chartResetRequested) {
      this.resetChart();
    } else if (prevProps.theme !== this.props.theme) {
      // we have to ensure that chart already loaded (sometimes app broken by user spams update theme button before chart ready)
      if (this.isChartReady()) {
        // since props.theme and props.currentChartTheme are always the same. The condition inside onChartReady will never be triggered
        this.widget.applyOverrides(getChartOverrides());
      }
      this.saveChartSettings({ data: null, persistImmediately: true });
      // still have to reset chart in order to load css
      this.resetChart();
    }

    // handle candles snapshot/update
    if (candles !== null) {
      if (this.waitingForSnapshot) {
        this.handleSnapshot();
      } else {
        //@ts-ignore
        const lastCandle = candles[Math.max(...Object.keys(candles))];

        if (lastCandle !== undefined) {
          const lastCandleConverted = convertCandleToTVFormat(lastCandle);
          this.updateLastChartCandle(lastCandleConverted);
        }
      }
    }

    // handle alerts/orders/positions changes
    // fixed bug occurs when place an order and there is no chart history
    if (this.candles && this.candles.length) {
      if (prevProps.priceAlerts !== priceAlerts) {
        this.updatePriceAlerts();
      }

      if (prevProps.orders !== orders || prevProps.pair !== pair) {
        this.updateOrders();
      }

      if (prevProps.position !== position) {
        this.updatePosition();
      }
    }
  }

  renderBarTypeActions() {
    if (this.widget && this.getChart()) {
      const intervals = [0, 1, 2];
      return intervals.map((i) => {
        return (
          <button
            onClick={() => {
              this.getChart().setChartType(i);
            }}
          >
            {i}
          </button>
        );
      });
    }
  }

  renderTimeframeActions() {
    if (this.widget && this.getChart()) {
      const intervals = this.widget.getIntervals();
      return intervals.map((i) => {
        return (
          <button
            onClick={() => {
              this.getChart().setResolution(i, () => {});
            }}
          >
            {i}
          </button>
        );
      });
    }
  }
  render() {
    // const { height, closeCard } = this.props;

    // const style = { height };

    return (
      <div className="h-100">
        <div className="m-10">
          <span>
            Intervals
            {this.renderTimeframeActions()}
          </span>
          <span>
            Bar Types
            {this.renderBarTypeActions()}
          </span>
          <span>
            <button
              onClick={() => {
                if (this.widget && this.getChart()) {
                  this.getChart().executeActionById("insertIndicator");
                }
              }}
            >
              Indicators
            </button>
          </span>
        </div>
        <ChartSaveLoadAdapter ref={this.saveLoadAdapterRef} />
        <div
          id={CHART_ROOT_ELEMENT}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  // ================================================ (private) methods ================================================
  onChartReady() {
    const { theme, currentChartTheme, updateChartTheme } = this.props;

    this.chartReady = true;
    // if(theme !== currentChartTheme) {
    // theme has been changed
    this.widget.applyOverrides(getChartOverrides());
    this.saveChartSettings({ persistImmediately: true });
    updateChartTheme(theme);
    // }

    this.widget.subscribe("onAutoSavedNeeded", this.saveChartSettings);
    this.widget.subscribe("mouse_up", this.onChartClicked);

    this.getChart().crossHairMoved(({ price }) => {
      this.chartCrosshairLastPrice = price;
    });
    this.updatePriceAlerts();
    this.updateOrders();
    this.updatePosition();
  }

  onChartClicked() {
    const now = this.getServerTimeInternal();

    if (now - this.chartClickLastTime < DOUBLE_CLICK_THRESHOLD) {
      this.props.setOrderFormPrice(this.chartCrosshairLastPrice);
    }

    this.chartClickLastTime = now;
  }

  updatePriceAlerts() {
    const { pair, addPriceAlert = NOOP, removePriceAlert = NOOP } = this.props;
    this.updateTradingPrimitives(
      "priceAlerts",
      "priceAlertsPrimitives",
      (items) => items,
      createPriceAlertPrimitive,
      pair,
      addPriceAlert,
      removePriceAlert
    );
  }

  updateOrders() {
    const {
      pair,
      changeOrderPrice = NOOP,
      modifyOrder = NOOP,
      cancelOrder = NOOP,
      orders,
    } = this.props;
    // console.warn('[chart] updateOrders >>> orders', orders);

    const mapper = (orders) =>
      _filter(Object.values(orders), (order: any) => order.pair === pair);

    this.updateTradingPrimitives(
      "orders",
      "ordersPrimitives",
      mapper,
      createOrderPrimitive,
      changeOrderPrice,
      modifyOrder,
      cancelOrder,
      orders
    );
  }

  shouldResetChart() {
    return this.numberOfHistoricalCandlesRequests > 1;
  }

  updatePosition() {
    const { closePosition = NOOP } = this.props;
    this.updateTradingPrimitives(
      "position",
      "positionPrimitives",
      (position) => [position],
      createPositionPrimitive,
      closePosition
    );
    // this.updateTradingPrimitives('position', 'liquidationPrimitives', position => [position], createLiquidationPricePrimitive)
  }

  updateTradingPrimitives(
    propName,
    primitivesName,
    mapToArrayFunction,
    createFunction,
    ...createFuncArgs
  ) {
    const chart = this.getChart();
    if (chart === null) {
      return;
    }

    const propsItem = this.props[propName];
    const items = this[primitivesName];

    if (items) {
      items.forEach((item) => item.remove());
      this[primitivesName] = null;
    }

    if (propsItem) {
      this[primitivesName] = mapToArrayFunction(propsItem).map((item) =>
        createFunction(chart, item, ...createFuncArgs)
      );
    }
  }

  updateLastChartCandle(candle) {
    // console.warn('>> updateLastChartCandle', candle);

    const { time } = candle;
    const { candles = [] } = this;

    if (!candles || candles.length === 0) {
      candles.push(candle);
      return;
    }

    const lastCandle = candles[candles.length - 1];
    const lastCandleTime = lastCandle.time;

    if (time < lastCandleTime) {
      // TradingView requires that candle updates are monotonic in time
      return;
    } else if (time > lastCandle.time) {
      const { interval } = this.props;
      const coeff = getMsInInterval(interval);
      // rounded in ms
      const rounded = Math.floor(time / coeff) * coeff;

      candle.time = rounded;

      candles.push(candle);
    } else {
      candles[candles.length - 1] = candle;
    }

    //@ts-ignore
    this.onRealtimeCallback(candle);
  }

  updateLastCandleFromTrading(newCandle) {
    newCandle = _omit(newCandle, ["pair"]);
    const { time } = newCandle;

    const { candles } = this;
    if (!candles || !candles.length) return;

    const lastCandle = candles[candles.length - 1];
    const lastCandleTime = lastCandle.time;

    if (time < lastCandleTime) return;

    const { interval } = this.props;
    const coeff = getMsInInterval(interval);
    // rounded in ms
    const rounded = Math.floor(time / coeff) * coeff;

    let candle;
    if (rounded > lastCandleTime) {
      //new bar
      candle = { ...newCandle };

      candle.open = candle.price;
      candle.close = candle.price;
      candle.high = candle.price;
      candle.low = candle.price;
      candle.volume = candle.volume;
    } else {
      candle = { ...lastCandle, ...newCandle };

      // if (!lastCandle.volume) { // empty candle
      // 	candle.open = Number(newCandle.price);
      // 	candle.low = Number(newCandle.price);
      // 	candle.high = Number(newCandle.price);
      // } else {
      // 	if (isLessThan(newCandle.price, Number(candle.low))) {
      // 		candle.low = Number(candle.price);
      // 	} else if (isGreaterThan(Number(newCandle.price), Number(candle.high))) {
      // 		candle.high = Number(candle.price);
      // 	}
      // }
      // candle.volume = Number(add(Number(lastCandle.volume), Number(newCandle.volume)));
      // candle.close = Number(newCandle.price);
      // candle.time = rounded;

      // console.warn(`[next] price ${candle.price} and volume ${candle.volume} at ${candle.time} and last candle is`, lastCandle)
    }

    this.updateLastChartCandle(candle);
  }

  addEmptyCandleToEnd() {
    const { candles } = this;

    if (candles && candles.length > 0) {
      const lastCandle = candles[candles.length - 1];
      const lastCandleTime = lastCandle.time;
      const timeNow = this.getServerTimeInternal();
      const { interval } = this.props;

      const nextCandleTime = lastCandleTime + getMsInInterval(interval);
      if (timeNow > nextCandleTime + ADD_EMPTY_CANDLE_TO_END_DELAY) {
        // console.log('[chart] adding empty candle:', nextCandleTime);
        const emptyCandle = generateEmptyCandle(
          nextCandleTime,
          lastCandle.close
        );
        // console.log('[chart] emptyCandle', emptyCandle);

        this.updateLastChartCandle(emptyCandle);
      }
    }
  }

  onResetButtonClick() {
    // resetting chart setting to defaults
    this.saveChartSettings({ data: null, persistImmediately: true });
    this.resubscribe();
    this.resetChart();
  }

  changePair() {
    this.saveChartSettings();
    this.resubscribe();
    this.resetChart();
  }

  getChart() {
    return this.isChartReady() ? this.widget.chart() : null;
  }

  waitForSnapshot() {
    this.candles = null;
    this.waitingForSnapshot = true;
    this.noMoreHistoricalCandles = false;
    this.numberOfHistoricalCandlesRequests = 0;
    this.forceUpdate();
  }

  saveChartSettings({ data = undefined, persistImmediately = false } = {}) {
    const { updateChartSettings } = this.props;

    if (data !== undefined) {
      updateChartSettings(data, persistImmediately);
    } else if (this.isChartReady()) {
      this.widget.save((updatedStyle) => {
        updateChartSettings(updatedStyle, persistImmediately);
      });
    }
  }

  resubscribe() {
    this.chartReady = false;
    this.chartResetRequested = true;
  }

  isChartReady() {
    return this.widget !== null && this.chartReady;
  }

  getServerTimeInternal() {
    const { timeDifference } = this.props;
    return new Date().getTime() - timeDifference;
  }

  resetChart() {
    this.chartResetRequested = false;
    this.chartReady = false;
    // exception may happen if chart was not initialized completely, it's okay, we are resetting it anyway
    try {
      this.widget.remove();
    } catch (e) {}
    this.widget = null;
    this.priceAlertsPrimitives = null;
    this.ordersPrimitives = null;
    this.positionPrimitives = null;
    this.liquidationPrimitives = null;
    this.resetCacheNeededCallbacks = {};

    // "componentDidUpdate" will initialize the widget because it's set to "null"
    this.forceUpdate();
  }

  resetCache() {
    for (let listenerGuid in this.resetCacheNeededCallbacks) {
      if (this.resetCacheNeededCallbacks.hasOwnProperty(listenerGuid)) {
        this.resetCacheNeededCallbacks[listenerGuid]();
      }
    }
  }

  // used for cleaning data chart
  // or sometimes client be missed update chart
  resetChartData() {
    if (!this.chartReady || !this.widget || !this.widget.activeChart()) return;

    this.resetCache();
    this.widget.activeChart().resetData();
  }

  handleSnapshot() {
    const { startTime, endTime } = this.getBarsRequest;
    const { candles, interval } = this.props;

    this.candles = extractCandlesFromSnapshot(candles, interval, endTime);
    this.waitingForSnapshot = false;
    if (this.candles.length < SNAPSHOT_CANDLES_NUMBER) {
      this.noMoreHistoricalCandles = true;
    }

    const earliestTime = getEarliestCandleTime(this.candles);

    if (earliestTime <= startTime) {
      this.fulfillGetBarsRequest();
    } else {
      this.requestCandlesFetch();
    }
  }

  fulfillGetBarsRequest() {
    const { startTime, endTime } = this.getBarsRequest;

    const requiredCandles = _filter(
      this.candles,
      (candle) => candle.time >= startTime && candle.time <= endTime
    );

    const earliestCandleTime = getEarliestCandleTime(this.candles);
    let options;

    if (endTime < earliestCandleTime && this.noMoreHistoricalCandles) {
      options = { noData: true };
    }

    //@ts-ignore
    this.onDataCallback(requiredCandles, options);
  }

  requestCandlesFetch() {
    const { startTime, endTime } = this.getBarsRequest;
    const earliestTime = getEarliestCandleTime(this.candles);

    // avoiding fetching candles that are already known
    const end = earliestTime < endTime ? earliestTime : endTime;
    let { interval, pair } = this.props;

    fetchCandlesAsync(
      startTime,
      end,
      interval,
      pair,
      this.onFetchCandlesSuccess,
      this.onErrorCallback
    );
  }

  onFetchCandlesSuccess(historicalCandles, hasMoreData) {
    this.noMoreHistoricalCandles = !hasMoreData;

    const { candles } = this;
    const candlesToAdd = [...historicalCandles];

    if (
      candles.length > 0 &&
      candlesToAdd.length > 0 &&
      candlesToAdd[candlesToAdd.length - 1].time === candles[0].time
    ) {
      candlesToAdd.pop();
    }

    this.candles = [...candlesToAdd, ...candles];

    this.numberOfHistoricalCandlesRequests += 1;
    this.fulfillGetBarsRequest();
  }

  handleUcm = (event) => {
    console.warn("[TVChart] handle UCM");
    const { detail: message } = event;
    if (isMarksMessage(message)) {
      this.handleMarksMessage(message);
    } else {
      console.warn(`Unknown chart message type: '${message.type}'`);
    }
  };

  handleMarksMessage(message) {
    const currentMarks = this.state.marks;
    const nextMarks = updateMarks(currentMarks, message);

    if (currentMarks !== nextMarks) {
      this.setState({ marks: nextMarks }, () => {
        if (this.isChartReady()) {
          this.getChart().clearMarks();
          this.getChart().refreshMarks();
        } else {
          console.warn("Cannot refresh marks - chart is not ready");
        }
      });
    }
  }

  changeInterval(nextInterval) {
    const { updateInterval } = this.props;
    updateInterval(nextInterval);

    const shouldReset = this.shouldResetChart();
    // interval will fail to change without saving the settings here
    // since interval is taken from settings initially
    this.saveChartSettings();

    shouldReset && this.resubscribe();
  }

  // ======================= Datafeed Methods that implement TradingView JSApi (DO NOT CHANGE THESE NAMES) ==============================================
  subscribeBars(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    listenerGuid,
    onResetCacheNeededCallback
  ) {
    this.onRealtimeCallback = onRealtimeCallback;
    this.resetCacheNeededCallbacks[listenerGuid] = onResetCacheNeededCallback;

    // reload data after x3 resolution
    const timer = resolution.includes("D")
      ? MAX_INTERVAL
      : +resolution * MULTIPLY_RESOLUTION * 60 * 1000;

    this.setScheduler(timer);
  }

  unsubscribeBars(listenerGuid) {
    this.onRealtimeCallback = NOOP;
    delete this.resetCacheNeededCallbacks[listenerGuid];
    this.clearScheduler();
  }

  onReady(callback) {
    executeAsync(callback, SERVER_SIDE_CUSTOMIZATION);
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback) {
    executeAsync(() => {
      // intentionally ignore "symbolName", just using this.props.pair instead of because otherwise chart may show wrong pair
      const { pair } = this.props;

      // exception may happen if pair gets changed before chart initialized completely, ignoring it
      try {
        onSymbolResolvedCallback(getSymbolData(pair));
      } catch (e) {}
    });
  }

  getBars(
    symbolInfo,
    resolution,
    rangeStartDate,
    rangeEndDate,
    onDataCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    // console.warn(`getBars: -1- ${getMsInInterval(resolution)} ${resolution}`);
    // const totalBars = Math.round(((rangeEndDate - rangeStartDate) * 1000) / getMsInInterval(resolution));
    // console.warn(`getBars: -2- ${resolution} [${rangeStartDate};${rangeEndDate}], total: ${totalBars}`)

    this.onDataCallback = onDataCallback;
    this.onErrorCallback = onErrorCallback;

    // const adjustedEndTime = (firstDataRequest) ? this.getServerTimeInternal() : rangeEndDate * 1000;
    const adjustedEndTime = rangeEndDate * 1000;
    _set(this.getBarsRequest, "startTime", rangeStartDate * 1000);
    _set(this.getBarsRequest, "endTime", adjustedEndTime);

    if (firstDataRequest) {
      const { interval } = this.props;

      if (interval !== resolution) {
        this.changeInterval(resolution);
      } else {
        this.waitForSnapshot();
      }
    } else if (
      rangeStartDate * 1000 < getEarliestCandleTime(this.candles) &&
      !this.noMoreHistoricalCandles
    ) {
      this.requestCandlesFetch();
    } else {
      this.fulfillGetBarsRequest();
    }
  }

  calculateHistoryDepth(resolution) {
    const intervalMs = getMsInInterval(resolution);

    if (!intervalMs) return undefined;

    const millisecondsInDay = getMsInInterval(INTERVAL.DAY);
    const desiredPeriodMilliseconds = intervalMs * HISTORY_LOOKBACK_CANDLES;
    const intervalBackInDays = desiredPeriodMilliseconds / millisecondsInDay;

    return {
      resolutionBack: INTERVAL.DAY,
      intervalBack: intervalBackInDays,
    };
  }

  getServerTime(callback) {
    const serverTimeSeconds = Math.round(this.getServerTimeInternal() / 1000);
    executeAsync(() => callback(serverTimeSeconds));
  }

  //https://github.com/tradingview/charting_library/wiki/JS-Api#getmarkssymbolinfo-from-to-ondatacallback-resolution
  getMarks(symbolInfo, from, to, onDataCallback) {
    const symbol = symbolInfo.ticker;

    const { marks: rawChartMarks } = this.state;

    const marks = [];

    Object.keys(rawChartMarks).forEach((id) => {
      const mark = rawChartMarks[id];

      const { ts, color_bg, color_border, color_text, label, size_min } = mark;

      const mSymbol = mark.symbol;
      const symbolMatch =
        !mSymbol || mSymbol === ANY_SYMBOL_MARK || mSymbol === symbol;
      const insideTimeFrame = ts >= from * 1000 && ts <= to * 1000;

      if (!symbolMatch || !insideTimeFrame) {
        return;
      }

      let color;

      if (color_bg !== undefined || color_border !== undefined) {
        color = {
          border: color_border,
          background: color_bg,
        };
      }

      marks.push({
        id,
        time: mark.ts / 1000,
        text: sanitizeHtml(mark.content),
        color,
        label,
        labelFontColor: color_text,
        minSize: size_min,
      });
    });

    onDataCallback(marks);
  }

  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    // console.warn('searchSymbols ===>', userInput, exchange, symbolType)
  }

  getTimeScaleMarks(
    symbolInfo,
    startDate,
    endDate,
    onDataCallback,
    resolution
  ) {
    //optional
  }
}
