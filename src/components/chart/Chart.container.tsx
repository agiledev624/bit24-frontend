import React from "react";
import { connect } from "react-redux";
import _debounce from "lodash/debounce";
import Chart from "./TVChart";
// import { getActiveOrders } from '../../../selectors/order.selectors';
import { getChartSettingsKey } from "./Chart.themes";
import { getSetting } from "@/selectors/ui-setting.selectors";
import {
  toggleWorkspaceSetting,
  updateUISetting,
} from "@/actions/ui-setting.actions";
import { getLastPriceBySymbol } from "@/selectors/ticker.selectors";
import { EMPTY_ARRAY } from "@/exports";
import { WorkspaceSettingEnum } from "@/models/workspace-setting";
// import { cancelOrder } from '../../../actions/order.actions';
// import { getPositionBySymbol } from '../../../selectors/positions.selectors';
// import { closePosition } from '../../../actions/position.actions';

const mapStateToProps = (state, { pair, tradingType }) => {
  const ready = true;
  // const showPriceAlerts = getSetting(state)('show_chart_alerts');
  // const showOrders = getSetting(state)('show_chart_orders');
  // const showPositions = getSetting(state)('show_chart_positions');
  const interval = getSetting(state)("chart_interval");

  // const position = showPositions && (tradingType === "margin" ? getPositionBySymbol(state, pair) : undefined);

  return {
    pair,
    ready,
    interval,
    isVisible: ready,
    lastPrice: getLastPriceBySymbol(state)(pair),
    height: getSetting(state)("chart_height"),
    theme: getSetting(state)("theme"),
    currentChartTheme: getSetting(state)("current_chart_theme"),
    timeDifference: 1,
    candles: EMPTY_ARRAY,
    chartSettings: getSetting(state)(getChartSettingsKey()),
    priceAlerts: null,
    // orders: (showOrders && getActiveOrders(state)) || null,
    orders: null,
    position: undefined,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  addPriceAlert(pair, price) {
    console.warn("addPriceAlert", pair, price);
    //TODO@chart
    // callLegacyFunction('alert', 'setPriceAlerts', pair, price)
  },
  removePriceAlert(id) {
    //TODO@chart
    console.warn("removePriceAlert", id);
    // callLegacyFunction('alert', 'removePriceAlert', id)
  },
  cancelOrder(id, symbol) {
    // dispatch(cancelOrder(id, symbol));
  },
  setOrderFromPrice(value) {
    //TODO@chart
    console.warn("setOrderFromPrice", value);
  },
  setInitialTimeDiff: () => {
    // sets a default timeDiff to have a faster chart boot
    console.warn("setInitialTimeDiff");
  },
  updateInterval(nextInterval) {
    dispatch(
      updateUISetting({
        key: "chart_interval",
        value: nextInterval,
        persist: false,
      })
    );
  },
  updateChartTheme(theme) {
    dispatch(
      updateUISetting({
        key: "current_chart_theme",
        value: theme,
        persist: false,
      })
    );
  },
  closePosition(amount, symbol, side) {
    // dispatch(closePosition({side, symbol, amount}))
  },
  closeCard(e) {
    dispatch(
      toggleWorkspaceSetting({
        key: WorkspaceSettingEnum.CHART,
        persist: false,
      })
    );
  },
});

// function InternalWrapper(props) {
//   const { theme } = useThemeContext();
//   const { ready, isVisible, chartSettings, currentChartTheme, updateChartTheme, dispatch } = props;

//   const persistChartSettings = useCallback((currentChartSettings?) => {
//     const chartSettingsToPersist =
//       currentChartSettings !== undefined ? currentChartSettings : chartSettings;

//     dispatch(
//       updateUISetting({
//         key: getChartSettingsKey(),
//         value: chartSettingsToPersist,
//         persist: false,
//       })
//     );
//   }, [dispatch, chartSettings]);

//   const persistChartSettingsThrottled = _debounce(persistChartSettings, 3000, {
//     maxWait: 10000,
//   });

//   const updateChartSettings = useCallback((currentChartSettings, persistImmediately) => {
//     // const key = getChartSettingsKey();

//     if (persistImmediately) {
//       // sometimes it's important to persist settings immediately
//       persistChartSettings(currentChartSettings);
//     } else {
//       dispatch(updateUISetting({ key: getChartSettingsKey(), value: currentChartSettings, persist: false }));
//       persistChartSettingsThrottled(currentChartSettings);
//     }
//   }, [dispatch, persistChartSettings, persistChartSettingsThrottled]);

//   useEffect(() => {
//     persistChartSettings();
//     // prevent debounced "persistChartSettings" function calls
//     persistChartSettingsThrottled.cancel();
//   }, [persistChartSettings, persistChartSettingsThrottled])

//   useEffect(() => {
//     if(currentChartTheme === theme) return;
//     updateChartTheme(theme);
//   }, [theme, currentChartTheme, updateChartTheme])

//   if (!ready) return <p>Loading...</p>;

//   // WARNING when chart is collapsed we cannot render it, otherwise TV throws errors
//   if (!isVisible) {
//     return <p>collapsed...</p>
//   }
//   return <Chart {...props} updateChartSettings={updateChartSettings} />;
// }
class InternalWrapper extends React.PureComponent<any> {
  private persistChartSettingsThrottled;

  constructor(props) {
    super(props);

    this.updateChartSettings = this.updateChartSettings.bind(this);
    this.persistChartSettings = this.persistChartSettings.bind(this);

    // debounce settings persist for 3 seconds, but guarantee that max delay is no more than 10 seconds
    this.persistChartSettingsThrottled = _debounce(
      this.persistChartSettings,
      3000,
      { maxWait: 10000 }
    );
  }

  componentDidMount() {
    this.persistChartSettings();
    // prevent debounced "persistChartSettings" function calls
    this.persistChartSettingsThrottled.cancel();
  }

  persistChartSettings(chartSettings?) {
    const chartSettingsToPersist =
      chartSettings !== undefined ? chartSettings : this.props.chartSettings;

    this.props.dispatch(
      updateUISetting({
        key: getChartSettingsKey(),
        value: chartSettingsToPersist,
        persist: false,
      })
    );
  }

  updateChartSettings(chartSettings, persistImmediately) {
    // const key = getChartSettingsKey();

    if (persistImmediately) {
      // sometimes it's important to persist settings immediately
      this.persistChartSettings(chartSettings);
    } else {
      this.props.dispatch(
        updateUISetting({
          key: getChartSettingsKey(),
          value: chartSettings,
          persist: false,
        })
      );
      this.persistChartSettingsThrottled(chartSettings);
    }
  }

  render() {
    const { props, updateChartSettings } = this;
    const childProps = {
      ...props,
      updateChartSettings,
    };

    if (!props.ready) {
      return <p>Loading...</p>;
    }

    // WARNING when chart is collapsed we cannot render it, otherwise TV throws errors
    if (!props.isVisible) {
      return <p>collapsed...</p>;
    }

    return <Chart {...childProps} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InternalWrapper);
