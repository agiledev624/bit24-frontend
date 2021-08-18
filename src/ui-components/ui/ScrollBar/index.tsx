import React, { PureComponent } from "react";
import PerfectScrollbar from "perfect-scrollbar";

import "./styles.scss";

const handlerNameByEvent = {
  "ps-scroll-y": "onScrollY",
  "ps-scroll-x": "onScrollX",
  "ps-scroll-up": "onScrollUp",
  "ps-scroll-down": "onScrollDown",
  "ps-scroll-left": "onScrollLeft",
  "ps-scroll-right": "onScrollRight",
  "ps-y-reach-start": "onYReachStart",
  "ps-y-reach-end": "onYReachEnd",
  "ps-x-reach-start": "onXReachStart",
  "ps-x-reach-end": "onXReachEnd",
};

Object.freeze(handlerNameByEvent);

interface ScrollBarProps {
  className?: string;
  style?: Object;
  options?: Object;
  containerRef: (ref: any) => void;
  onScrollY?: (e: any) => void;
  onScrollX?: (e: any) => void;
  onScrollUp?: (e: any) => void;
  onScrollDown?: (e: any) => void;
  onScrollLeft?: (e: any) => void;
  onScrollRight?: (e: any) => void;
  onYReachStart?: (e: any) => void;
  onYReachEnd?: (e: any) => void;
  onXReachStart?: (e: any) => void;
  onXReachEnd?: (e: any) => void;
  onSync?: (ps: any) => void;
  component: string;
}

export class ScrollBar extends PureComponent<ScrollBarProps> {
  static defaultProps = {
    component: "div",
    className: "",
    containerRef: (ref) => null,
    onSync: (ps) => ps.update(),
  };

  private _handlerByEvent = {};
  private _ps: PerfectScrollbar;
  private _container;

  constructor(props) {
    super(props);

    this.handleRef = this.handleRef.bind(this);
  }

  componentDidMount() {
    this._ps = new PerfectScrollbar(this._container, this.props.options);
    // hook up events
    this._updateEventHook();
    this._updateClassName();
  }

  componentDidUpdate(prevProps) {
    this._updateEventHook(prevProps);
    this.updateScroll();

    if (prevProps.className !== this.props.className) {
      this._updateClassName();
    }
  }

  componentWillUnmount() {
    // unhook up evens
    Object.keys(this._handlerByEvent).forEach((key) => {
      const value = this._handlerByEvent[key];

      if (value) {
        this._container.removeEventListener(key, value, { capture: false });
      }
    });
    this._handlerByEvent = {};
    this._ps.destroy();
    this._ps = null;
  }

  _updateEventHook(prevProps = {}) {
    // hook up events
    Object.keys(handlerNameByEvent).forEach((key) => {
      const callback = this.props[handlerNameByEvent[key]];
      const prevCallback = prevProps[handlerNameByEvent[key]];
      if (callback !== prevCallback) {
        if (prevCallback) {
          const prevHandler = this._handlerByEvent[key];
          this._container.removeEventListener(key, prevHandler, {
            capture: false,
          });
          this._handlerByEvent[key] = null;
        }
        if (callback) {
          const handler = () => callback(this._container);
          this._container.addEventListener(key, handler, { capture: false });
          this._handlerByEvent[key] = handler;
        }
      }
    });
  }

  _updateClassName() {
    const { className } = this.props;

    const psClassNames = this._container.className
      .split(" ")
      .filter((name) => name.match(/^ps([-_].+|)$/))
      .join(" ");

    if (this._container) {
      this._container.className = `cpn-scrollbar-container${
        className ? ` ${className}` : ""
      }${psClassNames ? ` ${psClassNames}` : ""}`;
    }
  }

  updateScroll() {
    this.props.onSync(this._ps);
  }

  handleRef(ref) {
    this._container = ref;
    this.props.containerRef(ref);
  }

  render() {
    const {
      className,
      style,
      options,
      containerRef,
      onScrollY,
      onScrollX,
      onScrollUp,
      onScrollDown,
      onScrollLeft,
      onScrollRight,
      onYReachStart,
      onYReachEnd,
      onXReachStart,
      onXReachEnd,
      component,
      onSync,
      children,
      ...remainProps
    } = this.props;

    return React.createElement(
      component,
      {
        style,
        // className: `cpn-scrollbar-container ${className}`,
        ref: this.handleRef,
        ...remainProps,
      },
      children
    );
  }
}

export default ScrollBar;
