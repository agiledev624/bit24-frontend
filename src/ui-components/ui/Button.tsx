import React from "react";
import classNames from "classnames";
import _omit from "lodash/omit";
import { Icon } from "./Icon";

var COLORS = {
  base: "grey",
  success: "green",
  danger: "red",
  warning: "yellow",
  info: "azure",
  dim: "light-grey",
  dimmed: "light-grey",
  muted: "grey",
  green: "green",
  red: "red",
  yellow: "yellow",
  azure: "azure",
  grey: "grey",
  "green-o": "green-o",
  "blue-o": "blue-o",
  "light-grey": "light-grey",
  "azure-o": "azure-o",
};

var BUTTON_COOLDOWN_TIME = 700;

function getColorClass(id) {
  return id ? `ui-button--${COLORS[id] || id}` : "";
}

interface ButtonProps {
  id: string;
  dim?: boolean;
  size?: string;
  clear?: boolean;
  color?: string;
  style: object;
  delayed?: boolean;
  classes?: string[] | string;
  disabled?: boolean;
  fullWidth?: boolean;
  link?: boolean;
  loading?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
/**
 * Sets up a button element in the page
 *
 * @param color: {string} sets the color of the button [red, green, yellow, azure, grey, ...]
 * @param size {string} changes the padding/font-size of the button [large, small, tiny]
 * @param clear {Bool} makes a button without a background color
 * @param disabled {Bool} disables the button, changing color and blocking click events
 * @param delayed {Bool} disables the button for a short period, after invoking his action
 * @param dimm {Bool} slighlty reduces color intensity
 */
export class Button extends React.PureComponent<ButtonProps> {
  static defaultProps = {
    children: null,
    id: undefined,
    style: {},
    classes: [],
    // color: COLORS.base,
    size: "",
    dim: false,
    clear: false,
    delayed: true,
    disabled: false,
    fullWidth: false,
    link: false,
    loading: false,
  };

  state = {
    cooldown: false,
  };

  _timeoutId;

  onClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void | undefined => {
    e.preventDefault();
    const { onClick, delayed, loading } = this.props;
    if (loading) return;
    if (delayed) {
      if (this.state.cooldown) {
        return;
      }
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
        this._timeoutId = null;
      }

      this.setState(function () {
        return {
          cooldown: true,
        };
      });

      this._timeoutId = setTimeout(() => {
        this.setState(function () {
          return {
            cooldown: false,
          };
        });
      }, BUTTON_COOLDOWN_TIME);
    }

    return onClick(e);
  };

  componentWillUnmount() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  render() {
    const {
      id,
      dim,
      size,
      style,
      color,
      clear,
      classes,
      disabled,
      fullWidth,
      link,
      loading,
      delayed,
      ...rest
    } = _omit(this.props, ["onClick"]);

    const colorClass = color ? getColorClass(color) : "";

    var c = classNames("ui-button", classes, {
      [colorClass]: !clear && !link,
      "ui-button--size-XS": size === "tiny",
      "ui-button--size-S": size === "small",
      "ui-button--size-L": size === "large",
      "ui-button--dim": dim || loading,
      "ui-button--clear": clear,
      "ui-button--disabled": disabled,
      "ui-button--fullwidth": fullWidth,
      "ui-button--link": link,
    });

    return (
      <button
        id={id}
        style={style}
        onClick={this.onClick}
        disabled={disabled || loading}
        className={c}
        {...rest}
      >
        {loading && <Icon spinning id="spinner" />} {this.props.children}
      </button>
    );
  }
}
