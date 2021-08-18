import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Dim,
  Icon,
  InputCheckboxInline,
  InputTextInline,
  Modal,
  NumberFormat,
  Tabs,
} from "@/ui-components";
import { closeModal } from "@/actions/app.actions";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { Link } from "react-router-dom";
import { toggleBooleanSetting } from "@/actions/ui-setting.actions";

interface Confirm1ClickProps {
  mId: string;
  confirm?: () => void;
  closePopup?: (mId: string) => void;
  enable1ClickConfirmPopup: boolean;
  sendDisableConfirm: () => void;
}

interface Confirm1ClickState {
  disableShowing: boolean;
}

class Confirm1ClickPopup extends React.PureComponent<
  Confirm1ClickProps,
  Partial<Confirm1ClickState>
> {
  constructor(props) {
    super(props);

    this.state = {
      disableShowing: false,
    };

    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onConfirmBtnClick = this.onConfirmBtnClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
  }

  onCancelClick() {
    const { mId, closePopup } = this.props;
    closePopup(mId);
  }

  onConfirmBtnClick() {
    const { confirm, sendDisableConfirm } = this.props;
    const { disableShowing } = this.state;
    confirm();
    this.onCancelClick();

    if (disableShowing) {
      sendDisableConfirm();
    }
  }

  onCheckboxChange(v, e) {
    this.setState({
      disableShowing: !this.state.disableShowing,
    });
  }

  render() {
    const { mId } = this.props;
    const { disableShowing } = this.state;

    return (
      <Modal
        id={mId}
        initWidth={377}
        className="confirm-dialog"
        headerContent="Enable 1-Click"
        centerTop={true}
        disableMove={true}
      >
        <div className="confirm-dialog__body">
          <p>
            Place and execute orders directly from the Order Book by clicking
            the 'Buy' or 'Sell' buttons.
          </p>
          <p>
            Use the 'New Order" window to update order quantity as existing
            value is used for every 1-click order you place.
          </p>
          <p className="info">
            For more information on using 1-Click, please refer to our{" "}
            <Link to="/">knowledge base.</Link>
          </p>

          <div className="btn-groups mb-10">
            <Button
              classes="btn btn-lg btn-cancel gray"
              onClick={this.onCancelClick}
            >
              Cancel
            </Button>
            <Button
              classes="btn btn-lg primary"
              onClick={this.onConfirmBtnClick}
            >
              Confirm
            </Button>
          </div>
          <div className="d-flex d-justify-content-flex-end">
            <InputCheckboxInline
              value="1"
              checked={disableShowing}
              onChange={this.onCheckboxChange}
              label="Don't show again"
            />
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  enable1ClickConfirmPopup: getSetting(state)(
    "show_orderbook_1_click_confirm_popup"
  ),
});

const mapDispatchToProps = (dispatch) => ({
  closePopup(id) {
    dispatch(closeModal(id));
  },
  confirm() {
    dispatch(toggleBooleanSetting({ key: "orderbook_1_click", persist: true }));
  },
  sendDisableConfirm() {
    dispatch(
      toggleBooleanSetting({
        key: "show_orderbook_1_click_confirm_popup",
        persist: true,
      })
    );
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Confirm1ClickPopup);
