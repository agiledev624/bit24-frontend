import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import ToastStore, { ToastItem } from "./Toast.store";
import { Icon } from "../Icon";

enum ToastPosition {
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
  TOP_CENTER = "top-center",
  BOTTOM_CENTER = "bottom-center",
}

// number of toast will be shown after container expanded
const NUMBER_OF_SHOWING_TOAST = 4;
const MAXIMUM_TOASTS = 100;

type ToastElm = ToastItem & {
  onRemove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

interface ToastContainerState {
  toasts: ToastElm[];
  isExpanded: boolean;
}

interface ToastContainerProps {
  position: ToastPosition;
  store: object;
}
class ToastContainer extends Component<any, ToastContainerState> {
  static defaultProps = {
    position: ToastPosition.BOTTOM_RIGHT,
    store: ToastStore,
  };

  storeSubscription = null;

  constructor(props) {
    super(props);
    this.state = {
      toasts: [],
      isExpanded: false,
    };

    this._storeHandler = this._storeHandler.bind(this);
    this.onClickExpanded = this.onClickExpanded.bind(this);
    this.onRemoveAllBtnClick = this.onRemoveAllBtnClick.bind(this);
  }

  render() {
    return ReactDOM.createPortal(this._renderContainer(), document.body);
  }

  onRemoveToast(id: any) {
    this.setState({
      toasts: this.state.toasts.filter((toast) => toast.id !== id),
    });
  }

  _renderContainer() {
    const showMoreBtn = this.state.toasts.length > NUMBER_OF_SHOWING_TOAST;
    const remainToast = this.state.toasts.length - NUMBER_OF_SHOWING_TOAST;

    // const isExpanded = this.state.isExpanded && showMoreBtn;

    if (!this.state.toasts.length) return null;

    return (
      <div
        className={`fixed-container toasts-container ${this.props.position} ${
          this.props.className || ""
        }`}
      >
        <div className="toasts-wrapper">
          <div className="toasts">
            {(this.state.isExpanded
              ? this.state.toasts
              : this.state.toasts.slice(0, NUMBER_OF_SHOWING_TOAST)
            ).map((toast) => {
              let icon = "";
              switch (toast.status) {
                case "success":
                  icon = "check-circle";
                  break;
                case "error": {
                  icon = "times-circle";
                  break;
                }
                default: {
                  icon = "";
                  break;
                }
              }

              const toastClasses = classNames(
                "toast",
                `toast-${toast.status}`,
                toast.classNames,
                {
                  "toast-animing": toast.runAnim,
                }
              );

              return (
                <div
                  key={toast.id}
                  className={toastClasses}
                  onClick={toast.onRemove}
                >
                  <div className="toast__header">
                    <div className="toast__icon">
                      <Icon id={icon} />
                    </div>
                    <div className="toast__header__content">{toast.header}</div>
                  </div>
                  <div className="toast__content">{toast.message}</div>
                </div>
              );
            })}
          </div>
          {showMoreBtn ? (
            this.state.isExpanded ? (
              <button className="toast__btn" onClick={this.onRemoveAllBtnClick}>
                {" "}
                Clear All{" "}
              </button>
            ) : (
              <button className="toast__btn" onClick={this.onClickExpanded}>
                {" "}
                Show {remainToast} more
              </button>
            )
          ) : null}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.storeSubscription = this.props.store.watch(this._storeHandler);
  }

  componentWillUnmount() {
    this.props.store.unwatch(this.storeSubscription);
  }

  _storeHandler(data: ToastItem) {
    if (!data.message) return;

    if (this.state.toasts.find((toast) => toast.message === data.message)) {
      return;
    }

    let toast = Object.assign({}, data, {
      onRemove: (e) => {
        e.stopPropagation();
        this.onRemoveToast(data.id);
      },
    });

    console.log("toast", toast);
    // if there is toast showing in group mode -> replaced by new one (without showing anim);
    if (this.state.toasts.length && !this.state.isExpanded) {
      toast.runAnim = false;
    }

    let toasts = [toast, ...this.state.toasts];
    if (toasts.length > MAXIMUM_TOASTS) {
      toasts = toasts.slice(0, MAXIMUM_TOASTS);
    }

    this.setState({ toasts });

    setTimeout(() => {
      const toasts = this.state.toasts.filter((t) => t.id !== toast.id);

      const newState = { toasts };

      if (this.state.isExpanded && toasts.length === 0) {
        (newState as ToastContainerState).isExpanded = false;
      }

      this.setState(newState);
    }, data.timer || 10000);
  }

  onClickExpanded(e) {
    e.preventDefault();

    this.setState({
      isExpanded: true,
    });
  }

  onRemoveAllBtnClick(e) {
    e.preventDefault();

    this.setState({
      toasts: [],
      isExpanded: false,
    });
  }
}

export default ToastContainer;
