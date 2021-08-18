import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import ReactToolTip, { Offset, Place } from "react-tooltip";
import _uniqueId2 from "lodash/uniqueId";
import "./styles.scss";

var PERSISTENT_HIDE_DELAY = 100;

type TooltipProps = {
  children: ReactNode;
  tooltipContent: ReactNode;
  underline?: boolean;
  cursorHelp?: boolean;
  persistent?: boolean;
  cursorPointer?: boolean;
  preFormatted?: boolean;
  offset?: Offset;
  // move tooltip to highest layer
  global: boolean;
  place: Place;
};

class Tooltip extends React.PureComponent<Partial<TooltipProps>> {
  static defaultProps = {
    tooltipContent: null,
    underline: true,
    cursorHelp: true,
    persistent: false,
    cursorPointer: false,
    preFormatted: false,
    place: "top",
  };

  tooltipId = _uniqueId2("tooltip-");

  render() {
    const {
      tooltipContent,
      underline,
      cursorHelp,
      persistent,
      cursorPointer,
      preFormatted,
      offset,
      global,
      place,
    } = this.props;

    if (!tooltipContent) return this.props.children;

    const tooltipClasses = classNames("__react-tooltip", {
      "__react-tooltip--persistent": persistent,
      "__react-tooltip--pre-formatted": preFormatted,
    });

    const tooltip = (
      <span className="ui-tooltip__container">
        <ReactToolTip
          className={tooltipClasses}
          id={this.tooltipId}
          effect={"solid"}
          delayHide={persistent ? PERSISTENT_HIDE_DELAY : undefined}
          offset={offset}
          place={place}
        >
          {tooltipContent}
        </ReactToolTip>
      </span>
    );

    var tooltipPortal = ReactDOM.createPortal(tooltip, document.body);
    var classes = classNames("ui-tooltip", {
      "ui-tooltip--underline": underline,
      "ui-tooltip--cursor-help": cursorHelp,
      "ui-tooltip--cursor-pointer": cursorPointer,
    });

    return (
      <span data-tip="true" data-for={this.tooltipId} className={classes}>
        {tooltipPortal}
        {this.props.children}
      </span>
    );
  }
}

export default Tooltip;
