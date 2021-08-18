/* eslint-disable default-case */
import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import classNames from "classnames";
import {
  getResizer,
  initTopPos,
  initLeftPos,
  calculateModalWidth,
} from "./Modal.helpers";

import MultiPurposeModal from "./MultiPurposeModal";
import { throttle as _throttle } from "lodash";
import { Icon } from "../Icon";
import { closeModal, closeAllModals } from "@/actions/app.actions";

interface ModalProps {
  children: ReactNode;
  id: string;
  isOpen: boolean;
  className: string;
  top: number;
  left: number;
  minWidth: number;
  minHeight: number;
  initWidth: number;
  initHeight: number;
  disableKeystroke: boolean;
  onRequestClose: (e?) => void;
  onRequestMinimise: (e?) => void;
  disableClose: boolean;
  disableMove: boolean;
  disableResize: boolean;
  disableVerticalResize: boolean;
  disableHorizontalResize: boolean;
  disableVerticalMove: boolean;
  disableHorizontalMove: boolean;
  closeAllModals: () => void;
  closeModal: (id: string) => void;
  hideAllModalsWhenClose: boolean;
  centerTop: boolean;
  //elements
  headerContent: ReactNode;
  headerDescription: ReactNode;
  headerTools: ReactNode; // tools are displayed in header but in higher than draggable layer
}

interface ModalState {
  isDragging: boolean;
  isResizing: boolean;
  top: number;
  left: number;
  width: number;
  height: "auto" | number;
  rel: any;
}
class Modal extends React.PureComponent<
  Partial<ModalProps>,
  Partial<ModalState>
> {
  static defaultProps = {
    isOpen: true,
    initWidth: 200,
    initHeight: 240,
    centerTop: false,
    isMinimised: false,
    disableClose: false,
    disableMove: false,
    disableResize: true,
    hideAllModalsWhenClose: false,
    disableVerticalResize: false,
    disableHorizontalResize: false,
    disableVerticalMove: false,
    disableHorizontalMove: false,
    onRequestClose: function () {},
    onRequestRecover: function () {},
    closeAllModals: function () {},
    closeModal: function (id) {},
  };

  state = {
    isDragging: false,
    isResizing: false,
    top: this.props.centerTop
      ? initTopPos({ top: this.props.top, initHeight: this.props.initHeight })
      : 50,
    left: initLeftPos({
      left: this.props.left,
      initWidth: this.props.initWidth,
    }),
    width: calculateModalWidth(this.props.initWidth),
    height: "auto" as "auto",
    rel: null,
  };

  private modalRef = React.createRef<MultiPurposeModal>();
  private dragArea = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);

    this.updateStateResizing = this.updateStateResizing.bind(this);
    this.funcResizing = this.funcResizing.bind(this);
    this.resize = this.resize.bind(this);
    this.onMouseMove = _throttle(this.onMouseMove.bind(this));
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.pressKey = this.pressKey.bind(this);
    this.updateStateDragging = this.updateStateDragging.bind(this);

    this.onCloseModal = this.onCloseModal.bind(this);
  }

  componentDidMount() {
    const { disableKeystroke } = this.props;

    // if(!disableMove) {
    // 	document.addEventListener('mousemove', this.onMouseMove);
    // 	document.addEventListener('mouseup', this.onMouseUp);

    // }

    if (!disableKeystroke) document.addEventListener("keydown", this.pressKey);

    // scroll to Top
    window.scrollTo(0, 0);
  }

  // componentDidUpdate(_, prevState) {
  // 	if (!this.state.isDragging && prevState.isDragging) {
  // 		document.removeEventListener('mousemove', this.onMouseMove);
  // 		document.removeEventListener('mouseup', this.onMouseUp);
  // 	}
  // }

  onCloseModal(e) {
    const {
      isOpen,
      onRequestClose,
      closeModal,
      closeAllModals,
      id,
      hideAllModalsWhenClose = false,
    } = this.props;

    if (isOpen) {
      if (hideAllModalsWhenClose && closeAllModals) {
        closeAllModals();
      } else {
        closeModal(id);
      }

      onRequestClose(e);
    }
  }

  componentWillUnmount() {
    const { disableKeystroke } = this.props;

    // if(!disableMove) {
    // 	document.removeEventListener('mousemove', this.onMouseMove);
    // 	document.removeEventListener('mouseup', this.onMouseUp);
    // }

    if (!disableKeystroke)
      document.removeEventListener("keydown", this.pressKey);
  }

  onMouseDown(e) {
    // only left mouse button
    if (e.button !== 0) return;
    var pos = ReactDOM.findDOMNode(this.modalRef.current);

    this.setState({
      isDragging: true,
      rel: {
        //@ts-ignore
        x: e.pageX - pos.offsetLeft,
        //@ts-ignore
        y: e.pageY - pos.offsetTop,
      },
    });
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseUp(e) {
    e.stopPropagation();

    // document.removeEventListener('mousemove', this.onMouseMove);
    this.setState({ isDragging: false });
    this.setState({ isResizing: false });
  }

  onMouseMove(e) {
    e.stopPropagation();
    e.preventDefault();

    const { disableMove, disableVerticalMove, disableHorizontalMove } =
      this.props;
    if (this.state.isDragging) {
      if (disableMove) {
      } else if (disableVerticalMove && disableHorizontalMove) {
      } else if (!disableVerticalMove && disableHorizontalMove) {
        this.setState({
          top: e.pageY - this.state.rel.y,
        });
      } else if (disableVerticalMove && !disableHorizontalMove) {
        this.setState({
          left: e.pageX - this.state.rel.x,
        });
      } else if (!disableVerticalMove && !disableHorizontalMove) {
        this.setState({
          left: e.pageX - this.state.rel.x,
          top: e.pageY - this.state.rel.y,
        });
      }
    } else if (this.state.isResizing) {
      this.funcResizing(e.clientX, e.clientY);
    } else {
      return;
    }
  }

  updateStateResizing(isResizing) {
    this.setState({ isResizing });
  }

  funcResizing(clientX, clientY) {
    const {
      minWidth: mWidth,
      minHeight: mHeight,
      disableVerticalResize,
      disableHorizontalResize,
    } = this.props;
    let node = ReactDOM.findDOMNode(this.modalRef.current);
    let minWidth = mWidth ? mWidth : 200;
    let minHeight = mHeight ? mHeight : 100;
    //@ts-ignore
    if (!disableHorizontalResize && clientX > node.offsetLeft + minWidth) {
      this.setState({
        //@ts-ignore
        width: clientX - node.offsetLeft + 16 / 2,
      });
    }
    //@ts-ignore
    if (!disableVerticalResize && clientY > node.offsetTop + minHeight) {
      this.setState({
        //@ts-ignore
        height: clientY - node.offsetTop + 16 / 2,
      });
    }
  }

  updateStateDragging(isDragging) {
    this.setState({ isDragging });
  }

  pressKey(e) {
    const { disableClose } = this.props;
    if (disableClose) return;

    switch (e.keyCode) {
      case 27:
        this.onCloseModal(e);
        break;
    }
  }

  resize(width, height) {
    this.setState((prevState) => ({
      width: width || prevState.width,
      height: height || prevState.height,
    }));
  }

  render() {
    const {
      isOpen,
      onRequestMinimise,
      disableResize,
      disableMove,
      headerContent,
      headerDescription,
      disableClose,
      headerTools,
      centerTop,
    } = this.props;

    if (!isOpen) return null;

    const autoCenter = centerTop && disableMove;

    return (
      <div className={classNames("ui-modal__ctn", this.props.className)}>
        <div
          onClick={onRequestMinimise ? onRequestMinimise : this.onCloseModal}
          className="ui-modal-mask"
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
        />
        <MultiPurposeModal
          width={this.state.width}
          height={this.state.height}
          top={this.state.top}
          left={this.state.left}
          isDragging={this.state.isDragging}
          isOpen={isOpen}
          headerContent={headerContent}
          headerDescription={headerDescription}
          ref={this.modalRef}
          autoCenter={autoCenter}
        >
          {!disableMove && (
            <div
              className="ui-modal-draggable__container"
              onMouseDown={this.onMouseDown}
              onMouseMove={this.onMouseMove}
              onMouseUp={this.onMouseUp}
              ref={this.dragArea}
            >
              <div className="ui-modal-draggable-area">
                <div className="ui-modal-drag-icon">
                  <Icon cssmodule="fas" id="arrows-alt" />
                </div>
              </div>
            </div>
          )}
          {headerTools && (
            <div className="ui-modal-header-tools">{headerTools}</div>
          )}
          {!disableClose && (
            <span className="close-btn" onClick={this.onCloseModal}>
              ×
            </span>
          )}
          <div className="ui-modal-body">
            {this.props.children}
            {!disableResize &&
              getResizer({ updateStateResizing: this.updateStateResizing })}
          </div>
        </MultiPurposeModal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  closeModal: function (id) {
    dispatch(closeModal(id));
  },
  closeAllModals: function () {
    dispatch(closeAllModals());
  },
});

export default connect(null, mapDispatchToProps)(Modal);
