import { greenText } from "@/exports";
import React, { ReactNode } from "react";
import Tooltip from "./Tooltip";

type IconProps = {
  id: string;
  style?: Object;
  classes?: string[];
  dim?: boolean;
  active?: boolean;
  tooltip?: boolean | string | ReactNode;
  spinning?: boolean;
  cssmodule?: "fa" | "fas" | "far" | "fal" | "fab" | "fad";
};

export class Icon extends React.PureComponent<IconProps> {
  static defaultProps = {
    style: {},
    cssmodule: "fa",
    classes: [],
    dim: false,
    active: false,
    tooltip: false,
    spinning: false,
  };

  render() {
    const {
      id,
      style,
      classes = [],
      dim,
      active,
      tooltip,
      spinning,
      cssmodule,
    } = this.props;

    const c = `${cssmodule} fa-${id} ${classes.join(" ")} ${
      dim ? "show50" : ""
    } ${active ? greenText() : ""} ${spinning ? "fa-spin" : ""}`;

    const icon = <i className={c} style={style} />;

    return tooltip ? (
      <Tooltip tooltipContent={tooltip} cursorHelp={false} cursorPointer={true}>
        {icon}
      </Tooltip>
    ) : (
      icon
    );
  }
}
