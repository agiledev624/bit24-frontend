import React from "react";
import { connect } from "react-redux";

// we saved something like "6bd0d57a58", while TV works only with numbers
function convertToNumber(idString) {
  const converted = Number.parseInt(idString, 16);
  if (!Number.isNaN(converted)) {
    return converted;
  }
  return 0;
}

function convertToString(numberAsId) {
  return numberAsId.toString(16).padStart(10, 0);
}

//random 40-bit number in hex as string with exact 10 digits
function generateChartId() {
  return convertToString(Math.trunc(Math.random() * (2 ** 40 - 1)));
}

function callCallbacksIgnoreExceptions(callbacks, argument) {
  for (const callback of callbacks) {
    try {
      callback(argument);
    } catch (e) {
      // ignore
    }
  }
}

function requestChartContent(dispatch, key) {
  console.log("requestChartContent", "dispatch", "key");

  // dispatch(settingsActions.getSettings({ key, prefix: API_PREFIX }))
}

function setChartContent(dispatch, key, content, persist = true) {
  console.log("setChartContent", dispatch, key, content, persist);
  // dispatch(settingsActions.setSettings({
  //   key,
  //   value: content,
  //   persist,
  //   prefix: API_PREFIX,
  // }))
}

function requestChartsList(dispatch) {
  console.log("requestChartsList", dispatch);
  // dispatch(settingsActions.getSettings({ key: CHARTS_LIST_KEY }))
}

function setChartsList(dispatch, charts) {
  console.log("setChartsList", dispatch, charts);
  // dispatch(settingsActions.setSettings({
  //   key: CHARTS_LIST_KEY,
  //   value: charts,
  // }))
}

function deleteChartContent(dispatch, key) {
  console.log("deleteChartContent", dispatch, key);

  // dispatch(settingsActions.deleteSettings({ key, prefix: API_PREFIX }))
}

const CHART_KEY_PREFIX = "chart__snapshot__";

class ChartSaveLoadAdapter extends React.PureComponent<any> {
  listChartsPromisesMap = [];
  getChartPromisesMap = new Map();

  static defaultProps = {
    chartsList: [],
    chartsMap: {},
  };

  constructor(props) {
    super(props);

    this.getAllCharts = this.getAllCharts.bind(this);
    this.getChartContent = this.getChartContent.bind(this);
    this.saveChart = this.saveChart.bind(this);
    this.removeChart = this.removeChart.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { chartsList, chartsMap } = this.props;

    if (chartsList !== prevProps.chartsList) {
      const convertedCharts = chartsList.map((chart) => ({
        ...chart,
        id: convertToNumber(chart.id),
      }));

      callCallbacksIgnoreExceptions(
        this.listChartsPromisesMap,
        convertedCharts
      );
      this.listChartsPromisesMap = [];
    }

    for (const key of Object.keys(chartsMap)) {
      const content = chartsMap[key];
      console.log("[chart adapter] -> chart content", content);

      if (prevProps.chartsMap[key] !== content) {
        const promises = this.getChartPromisesMap.get(key);
        if (promises) {
          callCallbacksIgnoreExceptions(promises, content);
          this.getChartPromisesMap.delete(key);
        }
      }
    }
  }

  // names are conventional for TradingView adapter, do not rename
  // https://github.com/tradingview/charting_library/wiki/Widget-Constructor#save_load_adapter
  getAdapter() {
    return {
      getAllCharts: this.getAllCharts,
      getChartContent: this.getChartContent,
      saveChart: this.saveChart,
      removeChart: this.removeChart,
    };
  }

  getAllCharts() {
    console.log("[chart adapter] -> getAllCharts");

    return new Promise((resolve) => {
      this.listChartsPromisesMap.push(resolve);
    });
  }

  getChartContent(chartId) {
    console.log("[chart adapter] -> getChartContent -> id:", chartId);
    const convertedChartId = convertToString(chartId);
    const key = `${CHART_KEY_PREFIX}${convertedChartId}`;

    setChartContent("dispatch", key, undefined, false);
    requestChartContent("dispatch", key);

    return new Promise((resolve) => {
      const promises = this.getChartPromisesMap.get(key);
      if (!promises) {
        this.getChartPromisesMap.set(key, [resolve]);
      } else {
        promises.push(resolve);
      }
    });
  }

  saveChart({ id, name, symbol, resolution, content }) {
    const isNew = id === undefined;
    const chartId = isNew ? generateChartId() : convertToString(id);

    const { chartsList, dispatch } = this.props;
    const newChartItem = {
      id: chartId,
      name,
      symbol,
      resolution,
      timestamp: Math.trunc(new Date().getTime() / 1000),
    };

    const updatedChartsList = isNew
      ? [...chartsList, newChartItem]
      : [...chartsList.filter((chart) => chart.id !== chartId), newChartItem];

    setChartsList("dispatch", updatedChartsList);
    setChartContent("dispatch", `${CHART_KEY_PREFIX}${chartId}`, content);

    return Promise.resolve(convertToNumber(chartId));
  }

  removeChart(chartId) {
    //@ts-ignore
    const { dispatch, chartsList } = this.props;
    const chartIdString = convertToString(chartId);
    deleteChartContent(dispatch, `${CHART_KEY_PREFIX}${chartIdString}`);

    const updatedChartsList = chartsList.filter(
      (chart) => chart.id !== chartIdString
    );
    setChartsList(dispatch, updatedChartsList);

    return Promise.resolve(null);
  }

  render() {
    return null;
  }
}

export default connect(null, null, null, { forwardRef: true })(
  ChartSaveLoadAdapter
);
