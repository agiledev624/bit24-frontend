import React, { CSSProperties, MouseEvent } from "react";

import { Icon } from "./Icon";
import { Button } from "./Button";
import Tooltip from "./Tooltip";

interface IconButtonProps {
  id: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  dim?: boolean;
  clear?: boolean;
  active?: boolean;
  tooltip?: boolean | string;
  delayed?: boolean;
  disabled?: boolean;
  size: "large" | "small" | "tiny";
  style?: CSSProperties;
  classes?: string;
  cssmodule?: "fa" | "fas" | "far" | "fal" | "fab";
}

class IconButton extends React.PureComponent<IconButtonProps> {
  static defaultProps = {
    id: "",
    onClick: function onClick() {},
    dim: false,
    cssmodule: "fa",
    clear: false,
    active: false,
    rounded: false,
    tooltip: false,
    delayed: true,
    disabled: false,
    size: "tiny",
  };

  render() {
    const {
      id,
      onClick,
      dim,
      clear,
      active,
      tooltip,
      delayed,
      disabled,
      size,
      classes,
      style = {},
      cssmodule,
    } = this.props;

    const s = clear
      ? {
          ...style,
          padding: "0 2px",
        }
      : {};

    const icon = <Icon cssmodule={cssmodule} id={id} active={active} />;

    const button = onClick ? (
      <Button
        classes={classes}
        dim={dim}
        size={size}
        style={s}
        clear={clear}
        //@ts-ignore
        onClick={onClick}
        delayed={delayed}
        disabled={disabled}
      >
        {icon}
      </Button>
    ) : (
      icon
    );

    return tooltip ? (
      <Tooltip
        global={true}
        tooltipContent={tooltip}
        cursorHelp={false}
        cursorPointer={true}
      >
        {button}
      </Tooltip>
    ) : (
      button
    );
  }
}

export default IconButton;
