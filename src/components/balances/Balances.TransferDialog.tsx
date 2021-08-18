import React from "react";
import { connect } from "react-redux";
import _get from "lodash/get";
import { getFilteredWallets } from "./Balances.helpers";
import {
  Button,
  Dim,
  Icon,
  InputTextInline,
  Modal,
  NumberFormat,
  Tabs,
} from "@/ui-components";
import { closeModal } from "@/actions/app.actions";
import Select from "react-select";
import { AppTradeType } from "@/constants/trade-type";
import { TabTypes } from "@/ui-components/Tabs";

// import { requestTransfer } from '../../actions/balance.actions';
// import { isEnabledMargin } from '../utils/balance.utils';

// const BalancesTransferSection = ({onWalletChange, available, total, reserved, ccy, value, wallets, title}) => (
//   <div className="transfer-dialog__section">
//     <div className="text-align-center"><Dim>{title}</Dim></div>
//     {/* <div><Dropdown options={wallets} value={value} onChange={onWalletChange}/></div> */}
//     <div>dropdown</div>
//     <div className="transfer-dialog__card">
//       <div className="d-flex d-justify-content-space-between align-items--center vertical-pd-5">
//         <Dim>Total:</Dim>
//         <span>{total} {ccy}</span>
//       </div>
//       <div className="d-flex d-justify-content-space-between align-items--center vertical-pd-5">
//         <Dim>Available:</Dim>
//         <span>{available} {ccy}</span>
//       </div>
//       <div className="d-flex d-justify-content-space-between align-items--center vertical-pd-5">
//         <Dim>On Order:</Dim>
//         <span>{reserved} {ccy}</span>
//       </div>
//     </div>
//   </div>
// );

function isMarginWallets(wallet1, wallet2) {
  return wallet1 === "derivative" || wallet2 === "derivative";
}
const warningText = (ccy, wallet1, wallet2) => {
  // if(isMarginWallets(wallet1, wallet2) && !isEnabledMargin(ccy))
  //   return 'Margin is disabled for ' + ccy + ' wallet'

  return undefined;
};

enum BalancesTransferSteps {
  INIT = 1,
  PREVIEW = 2,
}

interface BalancesTransferDialogProps {
  mId: string;
  currency: string;
  // balances: PropTypes.object.isRequired,
  // defaultWallet: PropTypes.string,
  requestTransfer: (from, to, amount, ccy, clientId) => void;
  closeBalOverlay: () => void;
}

interface BalancesTransferDialogState {
  fromWallet: string;
  toWallet: string;
  loading: boolean;
  transferAmount: number;
  alert: any;
  step: BalancesTransferSteps;
  success: boolean;
}

const getWalletOptions = (wallet) => ({ label: wallet, value: wallet });

const formatOptionLabel = ({ value, label }) => (
  <div className="d-flex d-align-items-center">
    <Icon cssmodule="fas" id="wallet" />
    <div>{label}</div>
  </div>
);

class BalancesTransferDialog extends React.PureComponent<
  Partial<BalancesTransferDialogProps>,
  Partial<BalancesTransferDialogState>
> {
  static defaultProps = {
    defaultWallet: AppTradeType.SPOT,
    requestTransfer: function (from, to, amount, ccy, clientId) {},
    closeBalOverlay: function () {},
  };
  _requestId = undefined;

  constructor(props) {
    super(props);

    const toWallet = getFilteredWallets(props.defaultWallet)[0];

    this.state = {
      fromWallet: props.defaultWallet,
      toWallet,
      loading: false,
      transferAmount: this._getMaxTransferAmount(
        props.balances,
        props.defaultWallet,
        props.currency
      ),
      alert: undefined,
      step: BalancesTransferSteps.INIT,
    };

    this.onFromWalletChange = this.onFromWalletChange.bind(this);
    this.onToWalletChange = this.onToWalletChange.bind(this);
    this.onSwitchBtnClick = this.onSwitchBtnClick.bind(this);
    this.onTransferAmountChange = this.onTransferAmountChange.bind(this);
    this.finish = this.finish.bind(this);
    // this.onTransferBtnClick = this.onTransferBtnClick.bind(this);
  }

  _getMaxTransferAmount(balances, wallet, currency) {
    return _get(balances, [currency, wallet, "available"], 0);
  }

  onFromWalletChange({ value: wallet }) {
    this._setWalletOnChange("fromWallet", wallet);
  }

  onToWalletChange({ value: wallet }) {
    this._setWalletOnChange("toWallet", wallet);
  }

  _setWalletOnChange(key: string, wallet: string[]) {
    if (this.state[key] === wallet) return;

    this.setState({
      [key]: wallet,
    });
  }

  onSwitchBtnClick() {
    const { toWallet, fromWallet } = this.state;

    this.setState({
      toWallet: fromWallet,
      fromWallet: toWallet,
    });
  }

  onTransferAmountChange(e) {
    const transferAmount = e.target.validity.valid
      ? e.target.value
      : this.state.transferAmount;

    this.setState({
      transferAmount,
    });
  }

  nextStep(step: BalancesTransferSteps) {
    this.setState({
      step,
    });
  }

  // componentDidMount() {
  //   EventRegister.on(ON_TRANSFER_SUCCESS, this.onTransferResponse, this);
  // }

  // componentWillUnmount() {
  //   EventRegister.off(ON_TRANSFER_SUCCESS, this.onTransferResponse, this);
  // }

  // onTransferResponse({status, requestId}) {
  //   if(requestId !== this._requestId)
  //     return;

  //   if(status === 0) { // success
  //     const {mId, closePopup, closeBalOverlay} = this.props;
  //     closePopup(mId);
  //     closeBalOverlay();
  //   } else {
  //     this.setState({
  //       loading: false,
  //       alert: 'Error occurred' //@Todo: error code mapping
  //     });
  //   }
  // }

  // onTransferBtnClick(e) {
  //   e.preventDefault();
  //   const {requestTransfer, currency, balances} = this.props;
  //   const {fromWallet, toWallet, transferAmount} = this.state;

  //   if(!+transferAmount || isNaN(transferAmount) || +transferAmount > this._getMaxTransferAmount(balances, fromWallet, currency)) {
  //     this.setState({loading: false, alert: 'Invalid request'});
  //     return;
  //   }

  //   if(isMarginWallets(toWallet, fromWallet) && !isEnabledMargin(currency)) {
  //     this.setState({loading: false, alert: 'Invalid request'});
  //     return;
  //   }

  //   const currencyId = balances[currency].id;

  //   this.setState({loading: true});
  //   this._requestId = Date.now();
  //   requestTransfer(fromWallet, toWallet, transferAmount, currencyId, this._requestId);
  // }

  renderTransferBoy(step: BalancesTransferSteps) {
    const { currency } = this.props;
    const { transferAmount, toWallet, fromWallet } = this.state;
    //@todo i18n
    switch (step) {
      case BalancesTransferSteps.INIT: {
        const fromWalletOptions =
          getFilteredWallets(toWallet).map(getWalletOptions);
        const toWalletOptions =
          getFilteredWallets(fromWallet).map(getWalletOptions);

        return (
          <div className="balance-transfer__form">
            <div className="d-flex d-justify-content-center d-align-items-center mb-10">
              <div className="transfer-dialog__section">
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={fromWalletOptions}
                  value={getWalletOptions(fromWallet)}
                  formatOptionLabel={formatOptionLabel}
                />
              </div>
              <div
                className="swap-btn plr-rem12 clickable text-align-center"
                onClick={this.onSwitchBtnClick}
              >
                <div className="swap-btn__arrow-left">
                  <Icon cssmodule="fas" id="arrow-left" />
                </div>
                <div className="swap-btn__arrow-right">
                  <Icon cssmodule="fas" id="arrow-right" />
                </div>
              </div>
              <div className="transfer-dialog__section">
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={toWalletOptions}
                  value={getWalletOptions(toWallet)}
                  formatOptionLabel={formatOptionLabel}
                />
              </div>
            </div>
            <div className="mb-10">
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                options={fromWalletOptions}
                value={getWalletOptions(fromWallet)}
                formatOptionLabel={formatOptionLabel}
              />
            </div>
            <div className="mb-10">
              <span className="font-size-12 font-bold">Amount</span>
              <InputTextInline
                type="number"
                useHandlers={false}
                defaultValue={0}
                right={
                  <div>
                    Max Available:{" "}
                    <span className="transform__input__amount">
                      0.00000000 {currency}
                    </span>
                  </div>
                }
                onChange={(e) => {}}
              />
            </div>
            <div className="mb-10">
              <Tabs
                elements={[
                  {
                    title: "25%",
                    to: "25",
                    active: true,
                  },
                  {
                    title: "50%",
                    to: "50",
                  },
                  {
                    title: "75%",
                    to: "75",
                  },
                  {
                    title: "100%",
                    to: "100",
                  },
                  {
                    title: "0%",
                    to: "0",
                  },
                ]}
                tabType={TabTypes.DASHED_BUTTONS}
              />
            </div>
            <div>
              <Button
                onClick={() => this.nextStep(BalancesTransferSteps.PREVIEW)}
                classes="btn w-100"
              >
                Preview
              </Button>
            </div>
          </div>
        );
      }
      case BalancesTransferSteps.PREVIEW: {
        return (
          <div className="balances-transfer__preview">
            <div className="font-size-14 mb-10">
              Please review the details of the transfer
            </div>
            <div className="mb-15">Internal transfers are free</div>
            <div className="preview__round mb-15">
              <table>
                <colgroup>
                  <col width="40%" />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <td>Transfer from</td>
                    <td>{fromWallet} Wallet</td>
                  </tr>
                  <tr>
                    <td>Transfer to</td>
                    <td>{toWallet} Wallet</td>
                  </tr>
                  <tr>
                    <td>Coin</td>
                    <td>{currency}</td>
                  </tr>
                  <tr>
                    <td>Amount</td>
                    <td>
                      <NumberFormat number={transferAmount} decimals={8} />{" "}
                      {currency}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="d-flex d-align-items-center">
              <Button
                onClick={() => this.nextStep(BalancesTransferSteps.INIT)}
                classes="btn balances-transfer__backbtn"
              >
                Back
              </Button>
              <Button
                onClick={this.finish}
                classes="btn balances-transfer__confirmbtn"
              >
                Confirm
              </Button>
            </div>
          </div>
        );
      }
    }
  }

  finish() {
    this.setState({
      success: true,
    });
  }

  render() {
    const { mId } = this.props;
    const { step, success } = this.state;

    // const decimals = getNumDecimals(currency);
    // const pickedDecimals = decimals > 8 ? 8 : decimals;
    // const floatingPointRegex = `^[+]?([0-9]+([.][0-9]{0,${pickedDecimals}})?|[.][0-9]{1,${pickedDecimals}})`

    // const {total: toWalletTotal = 0, available: toWalletAvailable = 0, reserved: toWalletReserved = 0} = _get(balances, [currency, toWallet], {});
    // const {total: fromWalletTotal = 0, available: fromWalletAvailable = 0, reserved: fromWalletReserved = 0} = _get(balances, [currency, fromWallet], {});

    // const warning = warningText(currency, toWallet, fromWallet);

    return (
      <Modal
        id={mId}
        initWidth={456}
        className="transfer-dialog"
        headerContent={`Transfer any`}
      >
        <div className="transfer-dialog__body">
          {this.renderTransferBoy(step)}
          {success && (
            <div className="overlay-upper">
              <div className="w-100 text-center">
                <div className="font-size-18 mb-10">Transfer completed</div>
                <Icon
                  classes={["green-circle-50"]}
                  cssmodule="fas"
                  id="check-circle"
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

// BalancesTransferDialog.propTypes = {
//   mId: PropTypes.string,
//   currency: PropTypes.string.isRequired,
//   balances: PropTypes.object.isRequired,
//   defaultWallet: PropTypes.string,
//   requestTransfer: PropTypes.func.isRequired,
//   closeBalOverlay: PropTypes.func
// };

const mapDispatchToProps = (dispatch) => ({
  closePopup(id) {
    dispatch(closeModal(id));
  },
  requestTransfer(from, to, amount, ccy, clientId) {
    // dispatch(requestTransfer({
    //   from: getWalletIdFromName(from),
    //   to: getWalletIdFromName(to),
    //   amount: +amount,
    //   ccy,
    //   clientId
    // }))
  },
});
export default connect(null, mapDispatchToProps)(BalancesTransferDialog);
