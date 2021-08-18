import React, { ReactNode } from "react";
import { connect } from "react-redux";
import _isFunction from "lodash/isFunction";

import Modal from "./Modal";
import { closeModal } from "@/actions/app.actions";
import { Button } from "../Button";

type FuncParams = {
  onCancelBtnClick?: (e) => void;
  onOKBtnClick?: (e) => void;
};

type ChildParams = {
  renderButtons: (data: FuncParams) => ReactNode;
  onAccept?: () => void;
  onCancel?: () => void;
};

export type IConfirmBodyRenderer = {
  renderBody: (data: ChildParams) => ReactNode;
};

interface ConfirmModalDialog {
  mId: string;
  title: string;
  footer: ReactNode;
  onAccept: (data?: any) => void;
  onCancel: (data?: any) => void;
  closePopup: (mid: string) => void;
  initWidth: number;
  okText: string;
  cancelText: string;
  useLegacyBtns: boolean;
  centerTop: boolean;
  popupData: any;
  children: (data: ChildParams) => ReactNode;
}
class ConfirmModal extends React.PureComponent<Partial<ConfirmModalDialog>> {
  static defaultProps = {
    title: "Confirmation",
    onAccept: function () {},
    onCancel: null,
    initWidth: 490,
    useLegacyBtns: true,
    //@TODO: i18n
    okText: "Accept",
    centerTop: true,
    cancelText: "Cancel",
  };

  constructor(props) {
    super(props);

    this.onCancelBtnClick = this.onCancelBtnClick.bind(this);
    this.onOKBtnClick = this.onOKBtnClick.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  onCancelBtnClick(e) {
    e.stopPropagation();

    const { onCancel, closePopup, mId } = this.props;
    if (onCancel && _isFunction(onCancel)) {
      onCancel();
    }

    closePopup(mId);
  }

  onOKBtnClick(e) {
    e.stopPropagation();

    const { onAccept, closePopup, mId } = this.props;
    if (onAccept && _isFunction(onAccept)) {
      onAccept();
    }

    closePopup(mId);
  }

  renderButtons({
    onCancelBtnClick = this.onCancelBtnClick,
    onOKBtnClick = this.onOKBtnClick,
  } = {}): ReactNode {
    const { cancelText, okText } = this.props;
    return (
      <div className="btn-groups mb-10">
        <Button classes="btn btn-lg btn-cancel gray" onClick={onCancelBtnClick}>
          <span className="uppercase">{cancelText}</span>
        </Button>
        <Button classes="btn btn-lg primary" onClick={onOKBtnClick}>
          <span className="uppercase">{okText}</span>
        </Button>
      </div>
    );
  }

  render() {
    const {
      mId,
      centerTop,
      title,
      initWidth,
      footer,
      useLegacyBtns,
      onAccept,
      onCancel,
    } = this.props;

    return (
      <Modal
        id={mId}
        initWidth={initWidth}
        className="confirm-dialog"
        headerContent={
          title ? <div className="text-align-center">{title}</div> : null
        }
        centerTop={centerTop}
        disableMove={true}
      >
        <div className="confirm-dialog-body">
          {this.props.children({
            renderButtons: this.renderButtons,
            onAccept,
            onCancel,
          })}
          {useLegacyBtns ? this.renderButtons() : null}
          {footer}
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  closePopup(id) {
    dispatch(closeModal(id));
  },
});

export default connect(null, mapDispatchToProps)(ConfirmModal);
