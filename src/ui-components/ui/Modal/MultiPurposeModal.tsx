import React, { ReactNode } from "react";
import classNames from "classnames";
import _set from "lodash/set";

interface MultiPurposeModal {
  isDragging: boolean;
  width: number;
  height: number | "auto";
  top: number;
  left: number;
  isOpen: boolean;
  // element
  headerContent: ReactNode;
  headerDescription: ReactNode;
  autoCenter: boolean;
}
class MultiPurposeModal extends React.PureComponent<
  Partial<MultiPurposeModal>
> {
  node = React.createRef<HTMLDivElement>();

  render() {
    const {
      isDragging,
      width,
      height,
      top,
      left,
      isOpen,
      headerContent,
      headerDescription,
      autoCenter,
    } = this.props;

    if (!isOpen) return null;

    const classes = classNames("ui-modal", {
      "modal-anim-enter": !autoCenter && isOpen,
      "modal-center": autoCenter,
    });

    const style = {
      width,
      height,
    };
    if (!autoCenter) {
      _set(style, "top", top);
      _set(style, "left", left);
    }

    return (
      <div
        ref={this.node}
        draggable={isDragging}
        className={classes}
        style={style}
      >
        <div className="ui-modal__header">
          {headerContent}
          {headerDescription ? headerDescription : null}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default MultiPurposeModal;
