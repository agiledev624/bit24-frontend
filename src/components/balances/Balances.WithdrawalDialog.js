import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  Row,
  Col,
  Select,
  Alert,
  Modal as AntModal,
  Checkbox,
} from "antd";
import { connect } from "react-redux";
import _get from "lodash/get";

import { formatByDecimal, subtract } from "../../helpers";
import Modal from "../ui/Modal/Modal";
import toast from "../Toast/index";
import { isLessThan } from "../../helpers/math";
import {
  EventRegister,
  FORCE_UPDATE_WITHDRAWAL_HISTORY,
} from "../../utils/events/index";
import { requester } from "../../utils/fetchAPI/index";
import { hideModal } from "../../actions/notification.actions";
import { validateWallet } from "../../vars/currency.utils";
import { beautifier } from "../../vars/utils";
import {
  hasExtraData,
  getPlaceholderWithdrawExtraData,
  getEnableExtraDataLabel,
  getLabelWithdrawExtraData,
  validateWithdrawExtraData,
  getAddressLabel,
  getNumDecimals,
} from "./Balances.helpers";
import Button from "../ui/Button";
import { getWalletIdFromName, wallets } from "./Balances.constants";
import Dropdown from "../ui/Select.Dropdown";
import VerifyModal from "../ui/VerifyModal";

class BalancesWithdrawalDialog extends React.PureComponent {
  state = {
    availableWhitelists: [],
    withdrawAmount: 0,
    withdrawAddress: "",
    withdrawLabel: "",
    isOpenVerifyCodeModal: false,
    enableInputExtraData: true,
    withdrawExtraData: "",
    loading: false,
    wallet: this.props.wallet,
  };

  constructor(props) {
    super(props);

    this.onSelectChange = this.onSelectChange.bind(this);
    this.onWithdrawAddressChange = this.onWithdrawAddressChange.bind(this);
    this.onWithdrawAmountChange = this.onWithdrawAmountChange.bind(this);
    this.onWithdrawBtnClick = this.onWithdrawBtnClick.bind(this);

    this._onWithdrawalProcess = this._onWithdrawalProcess.bind(this);
    this.onEnableInputExtraData = this.onEnableInputExtraData.bind(this);
    this.onWithdrawExtraDataChange = this.onWithdrawExtraDataChange.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);

    this.onWalletChange = this.onWalletChange.bind(this);
  }

  onWalletChange({ value: wallet }) {
    if (wallet === this.state.wallet) {
      return;
    }

    this.setState({
      wallet,
    });
  }

  componentDidMount() {
    const { currency } = this.props;

    const rq = requester("user.getWhitelistSettingByCurrency", null, {
      currency,
    });

    if (rq) {
      rq.then((response) => {
        const whitelists = response.data || [];
        this.setState({
          availableWhitelists: whitelists,
        });
      }).catch((err) => {});
    }
  }

  onSelectChange(value) {
    const [label, address] = value.split("-");
    const { availableWhitelists } = this.state;
    const { memo } =
      availableWhitelists.find(
        (it) => it.addressLabel === label && it.address === address
      ) || {};

    this.setState({
      withdrawAddress: address,
      withdrawLabel: label,
      enableInputExtraData: memo,
      withdrawExtraData: memo || "",
    });
  }

  onWithdrawAddressChange(e) {
    this.setState({
      withdrawAddress: e.target.value,
    });
  }

  closeVerifyCodeModal = () => {
    this.setState({
      isOpenVerifyCodeModal: false,
      verifyCode: undefined,
    });
  };

  onWithdrawAmountChange(e) {
    const withdrawAmount = e.target.validity.valid
      ? e.target.value
      : this.state.withdrawAmount;

    this.setState({
      withdrawAmount,
    });
  }

  onWithdrawBtnClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const {
      withdrawAmount,
      withdrawAddress,
      withdrawExtraData,
      enableInputExtraData,
    } = this.state;
    const { currency } = this.props;
    try {
      this._checkValidationForWithdrawalInput({
        currency,
        withdrawAmount,
        withdrawAddress,
        enableInputExtraData,
        withdrawExtraData,
      });

      if (this.props.isEnabled2FA) {
        this.openVerifyCodeModal();
      } else {
        this._onWithdrawalProcess();
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

  openVerifyCodeModal() {
    this.setState({
      isOpenVerifyCodeModal: true,
    });
  }

  _checkValidationForWithdrawalInput({
    currency,
    withdrawAmount,
    withdrawAddress,
    enableInputExtraData,
    withdrawExtraData,
  }) {
    const { wallet } = this.state;
    const { balances } = this.props;

    const { available } = _get(balances, [currency, wallet], {});

    const { minWithdraw, feeWithdraw: transactionFee } = _get(
      balances,
      [currency],
      {}
    );

    if (!this._checkValid()) {
      throw new Error("Invalid address format");
    }

    if (!withdrawAmount || withdrawAmount <= transactionFee) {
      throw new Error("Invalid withdrawal amount");
    }

    if (isLessThan(withdrawAmount, minWithdraw || 0)) {
      throw new Error("Lower than minimum amount allowed");
    }

    if (withdrawAmount > available) {
      throw new Error("Not enough balance");
    }

    const checkExtraData = validateWithdrawExtraData(
      currency,
      withdrawExtraData
    );
    if (hasExtraData(currency) && enableInputExtraData && checkExtraData) {
      throw new Error(checkExtraData);
    }
  }

  _reset() {
    this.setState({
      withdrawAddress: "",
      withdrawAmount: 0,
      isOpenVerifyCodeModal: false,
      enableInputExtraData: true,
      withdrawExtraData: "",
    });
  }

  _onWithdrawalProcess(verifyCode) {
    const {
      withdrawAmount,
      withdrawAddress,
      enableInputExtraData,
      withdrawExtraData,
      wallet,
    } = this.state;

    const walletId = getWalletIdFromName(wallet);

    const { currency } = this.props;
    this.toggleLoading();
    try {
      if (this.props.isEnabled2FA) {
        if (!verifyCode || `${verifyCode}`.length !== 6) {
          throw new Error("Invalid 2FA Code");
        }
      }

      const params = {
        verifyCode: +verifyCode,
        currency,
        amount: +withdrawAmount,
        address: withdrawAddress,
        extraUuid: enableInputExtraData ? withdrawExtraData : "",
        type: walletId,
      };

      // if(hasExtraData(currency)){
      //   params.extraUuid = enableInputExtraData ? withdrawExtraData : ''
      // }

      const rq = requester("withdraw.submit", null, params);

      if (rq) {
        rq.then((response) => {
          this._reset();
          const { mId } = this.props;

          EventRegister.emit(FORCE_UPDATE_WITHDRAWAL_HISTORY);

          AntModal.success({
            className: "dark-theme-modal information-modal",
            title: "Almost done",
            content: (
              <p>
                We have sent you a confirmation email. Please check your inbox
                and follow the instructions to complete this withdrawal request.
              </p>
            ),
            onCancel: () => {
              this.props.closePopup(mId);
            },
            maskClosable: true,
          });
          this.toggleLoading();
        }).catch((error) => {
          this.toggleLoading();
          toast.error(error.message);
        });
      }
    } catch (e) {
      this.toggleLoading();
      toast.error(e.message);
    }
  }

  _checkValid() {
    return validateWallet(this.state.withdrawAddress, this.props.currency);
  }

  onEnableInputExtraData(e) {
    const { checked } = e.target;
    this.setState({ enableInputExtraData: !checked });
  }

  onWithdrawExtraDataChange(e) {
    const { value } = e.target;
    this.setState({ withdrawExtraData: value });
  }

  toggleLoading() {
    this.setState((state) => {
      return { loading: !state.loading };
    });
  }

  render() {
    const { mId, currency, balances } = this.props;
    const {
      enableInputExtraData,
      availableWhitelists,
      withdrawAddress,
      withdrawLabel,
      wallet,
      loading,
    } = this.state;
    const { total, reserved, available } = _get(
      balances,
      [currency, wallet],
      {}
    );
    const { decimalAmount, feeWithdraw: transactionFee } = _get(
      balances,
      [currency],
      {}
    );

    // USDC allows 6 decimals only
    const decimals = decimalAmount || getNumDecimals(currency);
    const pickedDecimals = decimals > 8 ? 8 : decimals;
    const floatingPointRegex = `^[+-]?([0-9]+([.][0-9]{0,${pickedDecimals}})?|[.][0-9]{1,${pickedDecimals}})`;

    const title = `Withdraw ${currency} from your account`;
    const extraData = hasExtraData(currency);
    const { withdraw: withdrawAddressLabel, withdrawPlaceholder } =
      getAddressLabel(currency);
    const hasWhitelist = availableWhitelists.length > 0;
    return (
      <Modal
        id={mId}
        initWidth={650}
        className="dark-theme-modal"
        headerContent={title}
      >
        <Card>
          <Row
            style={{ marginBottom: 10 }}
            className="d-flex align-items--center"
          >
            <Col span={8}>
              <span>Choose Wallet</span>
            </Col>
            <Col span={16}>
              <Dropdown
                options={wallets}
                value={wallet}
                onChange={this.onWalletChange}
              />
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={8}>
              <span>Total balance</span>
            </Col>
            <Col span={8} className="mtb-text">
              <span>{`${beautifier(formatByDecimal(total))} ${currency}`}</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={8}>
              <span>On order</span>
            </Col>
            <Col span={8} className="mtb-text">
              <span>{`${beautifier(
                formatByDecimal(reserved)
              )} ${currency}`}</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={8}>
              <span>Available balance</span>
            </Col>
            <Col span={8} className="mtb-text">
              <span>{`${beautifier(
                formatByDecimal(available)
              )} ${currency}`}</span>
            </Col>
          </Row>
          <form>
            <Row
              style={{ marginBottom: 10, marginTop: 30 }}
              className="display-flex"
            >
              <Col span={8}>{withdrawAddressLabel}</Col>
              <Col span={16}>
                {hasWhitelist && (
                  <Select
                    value={
                      withdrawAddress === ""
                        ? undefined
                        : `${withdrawLabel}-${withdrawAddress}`
                    }
                    placeholder="Select an address"
                    style={{ width: "100%" }}
                    onChange={this.onSelectChange}
                    dropdownClassName="dark-theme-modal"
                    autoFocus
                  >
                    {this.state.availableWhitelists.map((whitelist) => (
                      <Select.Option
                        key={`${whitelist.addressLabel}-${whitelist.address}`}
                        value={`${whitelist.addressLabel}-${whitelist.address}`}
                      >
                        {whitelist.addressLabel} - {whitelist.address}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                {!hasWhitelist && (
                  <input
                    className="modal__input"
                    value={withdrawAddress}
                    onChange={this.onWithdrawAddressChange}
                    placeholder={withdrawPlaceholder}
                    autoFocus
                  />
                )}
              </Col>
            </Row>
            {extraData && (
              <React.Fragment>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={8}></Col>
                  <Col span={16}>
                    <Checkbox
                      checked={!enableInputExtraData}
                      onChange={this.onEnableInputExtraData}
                      disabled={hasWhitelist}
                    >
                      <span className="mtb-text">
                        {getEnableExtraDataLabel(currency)}
                      </span>
                    </Checkbox>
                  </Col>
                </Row>
                {this.state.enableInputExtraData && (
                  <Row style={{ marginBottom: 10 }} className="display-flex">
                    <Col span={8}>{getLabelWithdrawExtraData(currency)}</Col>
                    <Col span={16}>
                      <input
                        readOnly={hasWhitelist}
                        className="modal__input"
                        value={this.state.withdrawExtraData}
                        onChange={this.onWithdrawExtraDataChange}
                        placeholder={getPlaceholderWithdrawExtraData(currency)}
                      />
                    </Col>
                  </Row>
                )}
              </React.Fragment>
            )}

            <Row style={{ marginBottom: 10 }} className="display-flex">
              <Col span={8}>Withdrawal Amount</Col>
              <Col span={16}>
                <input
                  className="modal__input"
                  pattern={floatingPointRegex}
                  value={this.state.withdrawAmount}
                  onChange={this.onWithdrawAmountChange}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }} className="display-flex">
              <Col span={8} offset={8}>
                <span className="mtb-text">
                  Transaction fee: {beautifier(formatByDecimal(transactionFee))}
                </span>
              </Col>
              <Col span={8}>
                <span className="mtb-text" style={{ float: "right" }}>
                  Receive amount:{" "}
                  {this.state.withdrawAmount
                    ? beautifier(
                        formatByDecimal(
                          subtract(this.state.withdrawAmount, transactionFee)
                        )
                      )
                    : beautifier(formatByDecimal(0))}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={16} offset={8}>
                <Button
                  loading={loading}
                  onClick={this.onWithdrawBtnClick}
                  color="success"
                  classes="radius"
                  style={{ width: 100 }}
                  type="submit"
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </form>
          <Row style={{ marginTop: 20 }}>
            <Alert
              message="IMPORTANT NOTE"
              description="Please make sure your withdrawal address is a valid one and it is in the same blockchain as the currency you are withdrawing."
              type="info"
              showIcon
            />
          </Row>
        </Card>
        <div>
          <VerifyModal
            visible={this.state.isOpenVerifyCodeModal}
            onClick={this._onWithdrawalProcess}
            onCancel={this.closeVerifyCodeModal}
            loadingProcess={loading}
          />
        </div>
      </Modal>
    );
  }
}

BalancesWithdrawalDialog.propTypes = {
  mId: PropTypes.string,
  isEnabled2FA: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  currency: PropTypes.string.isRequired,
  balances: PropTypes.object.isRequired,
  wallet: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  isEnabled2FA: state.user.settings.sfa,
});

const mapDispatchToProps = (dispatch) => ({
  closePopup(id) {
    dispatch(hideModal(id));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BalancesWithdrawalDialog);
