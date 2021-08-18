import React from "react";
import _now from "lodash/now";

const UPDATES_PER_SECOND = 2;
const MS_BETWEEN_UPDATES = 1000 / UPDATES_PER_SECOND;

class Throttle extends React.Component {
  isLocked = false;
  timer = null;
  state = {
    lastUpdate: _now(), // eslint-disable-line react/no-unused-state
  };

  shouldComponentUpdate(nextProps) {
    const { interval = MS_BETWEEN_UPDATES } = nextProps;

    // no throttling
    if (interval === 0) {
      return true;
    }

    // allow updates if enough time has passed
    if (!this.isLocked) {
      this.isLocked = true;
      this.timer = setTimeout(() => {
        // when timer ends force an update
        this.isLocked = false;
        this.setState({
          lastUpdate: _now(), // eslint-disable-line react/no-unused-state
        });
      }, interval);

      return true;
    }

    return false;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return this.props.children;
  }
}

export default Throttle;
