import React from "react";
import ReactDOM from "react-dom";

export function getResizer({ updateStateResizing = (e) => {}, style = {} }) {
  function onMouseDown(e) {
    updateStateResizing(e);
  }

  const DEFAULT_WIDTH = 16;

  if (!style) {
    style = {
      width: DEFAULT_WIDTH,
      height: DEFAULT_WIDTH,
    };
  }
  return (
    <div className="ui-modal-resizer" style={style} onMouseDown={onMouseDown} />
  );
}

export function initTopPos({ top, initHeight = 240 }) {
  return top !== undefined ? top : (window.innerHeight - initHeight) / 2;
}

export function initLeftPos({ left, initWidth = 800 }) {
  initWidth = calculateModalWidth(initWidth);

  return left !== undefined ? left : (window.innerWidth - initWidth) / 2;
}

export function calculateModalWidth(width) {
  return window.innerWidth <= width ? 0.9 * window.innerWidth : width;
}

export function createModalPortal(component) {
  const node = document.querySelector(".ui-modal__container");

  if (node) {
    return ReactDOM.createPortal(component, node);
  } else {
    return ReactDOM.createPortal(
      <div className="ui-modal__container">{component}</div>,
      document.body
    );
  }
}
