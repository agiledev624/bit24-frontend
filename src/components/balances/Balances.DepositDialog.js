import React from "react";
import PropTypes from "prop-types";
import _get from "lodash/get";
import { Card, Row, Col, Input, Alert } from "antd";
import QRCode from "qrcode.react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { formatByDecimal } from "../../helpers";
import Touchable from "../../components/MtbitComponents/Touchable";
import Modal from "../ui/Modal/Modal";
import toast from "../Toast/index";
import { requester } from "../../utils/fetchAPI/index";
import Tooltip from "../Tooltip/index";
import { beautifier } from "../../vars/utils";
import {
  getExtraLabel,
  hasExtraData,
  getGenerateTootipExtraData,
  getQrData,
  isHiddenGenerateAddress,
  getAddressLabel,
  hasShowExtraWarningView,
  getDepositNoteContent,
} from "./Balances.helpers";
import BalancesExtraWarning from "./Balances.ExtraWarning";
import { getWalletIdFromName, wallets } from "./Balances.constants";
import Dropdown from "../ui/Select.Dropdown";

class BalancesDepositDialog extends React.PureComponent {
  state = {
    clipboardTooltip: "Copy to clipboard",
    depositAddress: "",
    extraData: "",
    clipboardTooltipExtraData: "Copy to clipboard",
    isUnderstandWarningExtra: !hasShowExtraWarningView(this.props.currency),
    wallet: this.props.wallet,
  };

  constructor(props) {
    super(props);

    this.generateNewAddress = this.generateNewAddress.bind(this);
    this.understandWarningExtra = this.understandWarningExtra.bind(this);
    this.onWalletChange = this.onWalletChange.bind(this);
  }

  onWalletChange({ value: wallet }) {
    if (wallet === this.state.wallet) {
      return;
    }

    this.setState({
      wallet,
    });

    this.getAddress(wallet);
  }

  generateNewAddress(e) {
    let { currency } = this.props;
    const { wallet } = this.state;

    const walletId = getWalletIdFromName(wallet);

    const rq = requester(
      "user.generateNewAdress",
      { symbol: currency },
      { type: walletId }
    );

    if (rq) {
      rq.then((response) => {
        const { data = [] } = response;

        const [address, extraUuid] = data;

        if (address) {
          this.setState({ depositAddress: address });
        }
        if (extraUuid) {
          this.setState({ extraData: extraUuid || "" });
        }
      }).catch((error) => {
        toast.error(error.message);
      });
    }
  }

  onCopyTooltipVisibleChange = (e) => {
    this.setState({
      clipboardTooltip: "Copy to clipboard",
    });
  };

  understandWarningExtra() {
    this.setState({
      isUnderstandWarningExtra: true,
    });
  }

  componentDidMount() {
    const { wallet } = this.state;

    this.getAddress(wallet);
  }

  getAddress(wallet) {
    const { currency } = this.props;

    const walletId = getWalletIdFromName(wallet);

    const rq = requester("user.getAddress", null, {
      status: 1,
      currencyCode: currency,
      type: walletId,
    });

    if (rq) {
      rq.then((response) => {
        const { data = [] } = response;
        const [address, extraUuid] = data;

        this.setState({
          depositAddress: address || "",
          extraData: extraUuid || "",
        });
      }).catch((err) => {});
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.depositAddress !== this.state.depositAddress) {
      this.setState({ clipboardTooltip: "Copy to clipboard" });
    }
    if (prevState.extraData !== this.state.extraData) {
      this.setState({ clipboardTooltipExtraData: "Copy to clipboard" });
    }
  }

  render() {
    let { mId, currency, balances } = this.props;
    const { isUnderstandWarningExtra, wallet } = this.state;
    const { available, reserved, total } = _get(
      balances,
      [currency, wallet],
      {}
    );

    const title = `Deposit ${this.props.currency} to your account`;
    const hiddenGenerateAddress = isHiddenGenerateAddress(currency);
    const { deposit: depositAddressLabel } = getAddressLabel(currency);
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
              <span>{`${beautifier(formatByDecimal(total))} ${
                this.props.currency
              }`}</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={8}>
              <span>On order</span>
            </Col>
            <Col span={8} className="mtb-text">
              <span>{`${beautifier(formatByDecimal(reserved))} ${
                this.props.currency
              }`}</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={8}>
              <span>Available balance</span>
            </Col>
            <Col span={8} className="mtb-text">
              <span>{`${beautifier(formatByDecimal(available))} ${
                this.props.currency
              }`}</span>
            </Col>
          </Row>
          {isUnderstandWarningExtra ? (
            <React.Fragment>
              <Row style={{ marginBottom: 10, marginTop: 30 }}>
                {depositAddressLabel}
              </Row>
              <Row className="display-flex">
                <Col span={20}>
                  <Input
                    className="default-size-input"
                    size="default"
                    value={this.state.depositAddress}
                    readOnly={true}
                  />
                </Col>
                <Col span={2} style={{ paddingLeft: "15px" }}>
                  <Tooltip
                    tooltipContent={this.state.clipboardTooltip}
                    onVisibleChange={this.onCopyTooltipVisibleChange}
                  >
                    <CopyToClipboard
                      text={this.state.depositAddress}
                      onCopy={() =>
                        this.setState({
                          copied: true,
                          clipboardTooltip: "Copied",
                        })
                      }
                    >
                      <button
                        className="setting-page__button clickable"
                        margin="1"
                        // style={{ float: 'right' }}
                      >
                        <i className="fa fa-copy" aria-hidden="true"></i>
                      </button>
                    </CopyToClipboard>
                  </Tooltip>
                </Col>
                {!hiddenGenerateAddress && (
                  <Col
                    span={2}
                    style={{
                      paddingLeft: hiddenGenerateAddress ? "15px" : "12px",
                    }}
                  >
                    <Tooltip tooltipContent={"Generate new address"}>
                      <Touchable onClick={this.generateNewAddress}>
                        <button
                          className="setting-page__button clickable"
                          // style={{ float: 'right' }}
                        >
                          <i className="fa fa-refresh" aria-hidden="true"></i>
                        </button>
                      </Touchable>
                    </Tooltip>
                  </Col>
                )}
              </Row>
              {hasExtraData(currency) && (
                <React.Fragment>
                  <Row style={{ marginBottom: 10, marginTop: 30 }}>
                    {getExtraLabel(currency)}
                  </Row>
                  <Row className="display-flex">
                    <Col span={20}>
                      <Input
                        className="default-size-input"
                        size="default"
                        value={getQrData(currency, this.state)}
                        readOnly={true}
                      />
                    </Col>
                    <Col span={2} style={{ paddingLeft: "15px" }}>
                      <Tooltip
                        tooltipContent={this.state.clipboardTooltipExtraData}
                        // onVisibleChange={this.onCopyTooltipVisibleChange}
                      >
                        <CopyToClipboard
                          text={getQrData(currency, this.state)}
                          onCopy={() =>
                            this.setState({
                              clipboardTooltipExtraData: "Copied",
                            })
                          }
                        >
                          <button
                            className="setting-page__button clickable"
                            margin="1"
                            // style={{ float: 'right' }}
                          >
                            <i className="fa fa-copy" aria-hidden="true"></i>
                          </button>
                        </CopyToClipboard>
                      </Tooltip>
                    </Col>
                    <Col span={2} style={{ paddingLeft: "12px" }}>
                      <Tooltip
                        tooltipContent={getGenerateTootipExtraData(currency)}
                      >
                        <Touchable onClick={this.generateNewAddress}>
                          <button
                            className="setting-page__button clickable"
                            // style={{ float: 'right' }}
                          >
                            <i className="fa fa-refresh" aria-hidden="true"></i>
                          </button>
                        </Touchable>
                      </Tooltip>
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              <Row style={{ margin: 20, textAlign: "center" }}>
                {getQrData(currency, this.state) && (
                  <QRCode
                    value={getQrData(currency, this.state)}
                    style={{ border: "10px solid white" }}
                    size={256}
                  />
                )}
              </Row>
              <Row>
                <Alert
                  message="IMPORTANT NOTE"
                  description={getDepositNoteContent(currency)}
                  type="info"
                  showIcon
                />
              </Row>
            </React.Fragment>
          ) : (
            <BalancesExtraWarning
              currency={currency}
              confirmFn={this.understandWarningExtra}
            />
          )}
        </Card>
      </Modal>
    );
  }
}

BalancesDepositDialog.propTypes = {
  currency: PropTypes.string.isRequired,
  balances: PropTypes.object.isRequired,
  wallet: PropTypes.string.isRequired,
};

export default BalancesDepositDialog;
