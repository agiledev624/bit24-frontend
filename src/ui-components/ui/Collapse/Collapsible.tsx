import React, { Component, ReactNode } from "react";
import classNames from "classnames";
import { Icon } from "../Icon";

interface CollapsibleProps {
  className?: string;
  subTitle?: string | ReactNode;
  title: string | ReactNode;
  toolbar?: string | ReactNode;
  footer?: string | ReactNode;
  titleTagName?: string; // default span
  titleStyle?: object;
  titleClassName?: string;
  subTitleClassName?: string;
  transitionTime?: number;
  transitionCloseTime?: number;
  easing?: string;
  open?: boolean;
  classParentString?: string;
  openedClassName?: string;
  triggerOpenedClassName?: string;
  contentOuterClassName?: string;
  contentInnerClassName?: string;
  accordionPosition?: string | number;
  handleTriggerClick?: (accordionPosition: string | number) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onOpening?: () => void;
  onClosing?: () => void;
  triggerWhenOpen?: string | ReactNode;
  triggerDisabled?: boolean;
  lazyRender?: boolean;
  overflowWhenOpen?:
    | "hidden"
    | "visible"
    | "auto"
    | "scroll"
    | "inherit"
    | "initial"
    | "unset";
  triggerSibling?: string | ReactNode;
  tabIndex?: number;
  overlay?: ReactNode;
  closeOverlay?: () => void;
}

interface CollapsibleState {
  isClosed: boolean;
  shouldSwitchAutoOnNextCycle: boolean;
  height: number | "auto";
  transition: string;
  hasBeenOpened: boolean;
  shouldOpenOnNextCycle?: boolean;
  overflow:
    | "hidden"
    | "visible"
    | "auto"
    | "scroll"
    | "inherit"
    | "initial"
    | "unset";
  inTransition: boolean;
}

class Collapsible extends Component<
  Partial<CollapsibleProps>,
  CollapsibleState
> {
  static defaultProps = {
    transitionTime: 100,
    transitionCloseTime: null,
    titleTagName: "span",
    easing: "linear",
    subTitle: "",
    open: true,
    classParentString: "collapsible",
    triggerDisabled: false,
    lazyRender: false,
    overflowWhenOpen: "hidden",
    openedClassName: "",
    titleStyle: null,
    titleClassName: "",
    subTitleClassName: "",
    contentOuterClassName: "",
    contentInnerClassName: "",
    className: "",
    triggerSibling: null,
    onOpen: () => {},
    onClose: () => {},
    onOpening: () => {},
    onClosing: () => {},
    tabIndex: null,
  };

  innerRef = null;

  constructor(props) {
    super(props);

    // Bind class methods
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.continueOpenCollapsible = this.continueOpenCollapsible.bind(this);
    this.setInnerRef = this.setInnerRef.bind(this);

    // Defaults the dropdown to be opened
    if (props.open) {
      this.state = {
        isClosed: false,
        shouldSwitchAutoOnNextCycle: false,
        height: "auto",
        transition: "none",
        hasBeenOpened: true,
        overflow: props.overflowWhenOpen,
        inTransition: false,
      };
    } else {
      this.state = {
        isClosed: true,
        shouldSwitchAutoOnNextCycle: false,
        height: 0,
        transition: `height ${props.transitionTime}ms ${props.easing}`,
        hasBeenOpened: false,
        overflow: "hidden",
        inTransition: false,
      };
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.shouldOpenOnNextCycle) {
      this.continueOpenCollapsible();
    }

    if (
      prevState.height === "auto" &&
      this.state.shouldSwitchAutoOnNextCycle === true
    ) {
      // Set small timeout to ensure a true re-render
      window.setTimeout(() => {
        this.setState({
          height: 0,
          overflow: "hidden",
          isClosed: true,
          shouldSwitchAutoOnNextCycle: false,
        });
      }, 50);
    }

    // If there has been a change in the open prop (controlled by accordion)
    if (prevProps.open !== this.props.open) {
      if (this.props.open === true) {
        this.openCollapsible();
        this.props.onOpening();
      } else {
        this.closeCollapsible();
        this.props.onClosing();
      }
    }
  }

  closeCollapsible() {
    this.setState({
      shouldSwitchAutoOnNextCycle: true,
      height: this.innerRef ? this.innerRef.offsetHeight : 0,
      transition: `height ${
        this.props.transitionCloseTime
          ? this.props.transitionCloseTime
          : this.props.transitionTime
      }ms ${this.props.easing}`,
      inTransition: true,
    });
  }

  openCollapsible() {
    this.setState({
      inTransition: true,
      shouldOpenOnNextCycle: true,
    });
  }

  continueOpenCollapsible = () => {
    this.setState({
      height: this.innerRef ? this.innerRef.offsetHeight : 0,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      isClosed: false,
      hasBeenOpened: true,
      inTransition: true,
      shouldOpenOnNextCycle: false,
    });
  };

  handleTriggerClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.props.triggerDisabled) {
      return;
    }

    if (this.props.handleTriggerClick) {
      this.props.handleTriggerClick(this.props.accordionPosition);
    } else {
      if (this.state.isClosed === true) {
        this.openCollapsible();
        this.props.onOpening();
      } else {
        this.closeCollapsible();
        this.props.onClosing();
      }
    }
  };

  renderNonClickableTriggerElement() {
    if (
      this.props.triggerSibling &&
      typeof this.props.triggerSibling === "string"
    ) {
      return (
        <span className={`${this.props.classParentString}__trigger--sibling`}>
          {this.props.triggerSibling}
        </span>
      );
    } else if (this.props.triggerSibling) {
      const TriggerSibling = this.props.triggerSibling;

      //@ts-ignore
      return <TriggerSibling />;
    }

    return null;
  }

  handleTransitionEnd = () => {
    // Switch to height auto to make the container responsive
    if (!this.state.isClosed) {
      this.setState({
        height: "auto",
        overflow: this.props.overflowWhenOpen,
        inTransition: false,
      });
      this.props.onOpen();
    } else {
      this.setState({ inTransition: false });
      this.props.onClose();
    }
  };

  setInnerRef = (ref) => {
    this.innerRef = ref;
  };

  onCloseOverlay = (e) => {
    e.preventDefault();

    const { closeOverlay } = this.props;
    closeOverlay();
  };

  render() {
    var dropdownStyle = {
      height: this.state.height,
      WebkitTransition: this.state.transition,
      msTransition: this.state.transition,
      transition: this.state.transition,
      // overflow: this.state.overflow,
    };

    var openClass = this.state.isClosed ? "is-closed" : "is-open";
    var disabledClass = this.props.triggerDisabled ? "is-disabled" : "";

    //If user wants different text when tray is open
    var trigger =
      this.state.isClosed === false && this.props.triggerWhenOpen !== undefined
        ? this.props.triggerWhenOpen
        : this.props.title;

    // If user wants a trigger wrapping element different than 'span'
    const TriggerElement = this.props.titleTagName;

    // Don't render children until the first opening of the Collapsible if lazy rendering is enabled
    var children =
      this.props.lazyRender &&
      !this.state.hasBeenOpened &&
      this.state.isClosed &&
      !this.state.inTransition
        ? null
        : this.props.children;
    const headerClasses = classNames(
      `${this.props.classParentString}__header__container`,
      {
        "collapsible__header__container--closed": this.state.isClosed,
      }
    );
    const triggerClasses = classNames(
      `${this.props.classParentString}__trigger`,
      openClass,
      disabledClass,
      this.state.isClosed
        ? this.props.titleClassName
        : this.props.triggerOpenedClassName
    );
    const parentClasses = classNames(
      this.props.classParentString,
      this.state.isClosed ? this.props.className : this.props.openedClassName
    );
    const outerClasses = classNames(
      `${this.props.classParentString}__contentOuter`,
      this.props.contentOuterClassName
    );
    const innerClasses = classNames(
      `${this.props.classParentString}__contentInner`,
      this.props.contentInnerClassName
    );

    const arrow = !this.props.triggerDisabled && (
      <div className="arrow__container" onClick={this.handleTriggerClick}>
        <Icon id={this.state.isClosed ? "chevron-right" : "chevron-down"} />
      </div>
    );

    const cornerHandler =
      this.props.overlay && this.props.closeOverlay ? (
        <div className="arrow__container" onClick={this.onCloseOverlay}>
          <Icon id="times" />
        </div>
      ) : (
        arrow
      );

    return (
      <div className={parentClasses}>
        <div className={headerClasses}>
          <div
            className={`${this.props.classParentString}__title`}
            onClick={this.handleTriggerClick}
          >
            {
              //@ts-ignore
              <TriggerElement
                className={triggerClasses}
                onClick={this.handleTriggerClick}
                style={this.props.titleStyle && this.props.titleStyle}
                onKeyPress={(event) => {
                  const { key } = event;
                  if (key === " " || key === "Enter") {
                    this.handleTriggerClick(event);
                  }
                }}
                tabIndex={this.props.tabIndex && this.props.tabIndex}
              >
                <div
                  className={`${this.props.classParentString}__sub__title__container ${this.props.subTitleClassName}`}
                >
                  {trigger}
                  <span
                    className={`${this.props.classParentString}__sub__title`}
                  >
                    {this.props.subTitle}
                  </span>
                </div>
              </TriggerElement>
            }
          </div>

          <div className="collapsible__toolbar">
            {!this.state.isClosed &&
              !this.props.overlay &&
              this.props.toolbar && (
                <div className="d-flex d-align-items-center">
                  {this.props.toolbar}
                </div>
              )}
            {cornerHandler}
          </div>
        </div>

        {this.renderNonClickableTriggerElement()}

        <div
          className={outerClasses}
          style={{ ...dropdownStyle }}
          // style={{...dropdownStyle, paddingTop: 10}}
          onTransitionEnd={this.handleTransitionEnd}
        >
          <div
            className={innerClasses}
            ref={this.setInnerRef}
            style={{
              position: "relative",
            }}
          >
            {children}
            {this.props.overlay && (
              <CollapsibleOverlay
                classParentString={this.props.classParentString}
              >
                {this.props.overlay}
              </CollapsibleOverlay>
            )}
          </div>

          {this.props.footer && (
            <div
              className={`${this.props.classParentString}__footer__container`}
            >
              {this.props.footer}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const CollapsibleOverlay = ({
  classParentString = "collapsible",
  children,
}: Partial<{ classParentString: string; children?: ReactNode }>) => (
  <div className={`${classParentString}__overlay`}>{children}</div>
);

export default Collapsible;
