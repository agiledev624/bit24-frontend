import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";

import BalancesOverlayMainTable from "./Balances.OverlayMainTable";
// import { isEnabledDeposit, isEnabledWithdraw } from '@/exports/balances.utils';
import { capitalize } from "@/exports";
import { showModal } from "@/actions/app.actions";
import BalancesTransferDialog from "./Balances.TransferDialog";
import { AppTradeType } from "@/constants/trade-type";

const RenderButton = ({ text, className, onClick, style = {} }) => (
  <div className={className} onClick={onClick} style={style}>
    {text}
  </div>
);

interface BalancesOverlayMainProps {
  closeBalOverlay: () => void;
  ccy: string;
  balances: any;
  ticker: any;
  openModal: (id: string, component: any, modalProps: any) => void;
  wallet: string;
  hideBalances: boolean;
}
class BalancesOverlayMain extends React.PureComponent<
  Partial<BalancesOverlayMainProps>
> {
  static defaultProps = {
    closeBalOverlay: function () {
      return null;
    },
    ccy: "",
    balances: {},
    ticker: {},
    wallet: AppTradeType.SPOT,
  };

  constructor(props) {
    super(props);

    // this.openDepositModal = this.openDepositModal.bind(this);
    // this.openWithdrawalModal = this.openWithdrawalModal.bind(this);
    this.openTransferModal = this.openTransferModal.bind(this);
  }

  // openWithdrawalModal() {
  // 	const { ccy, balances, wallet } = this.props;
  // 	const isEnabled = isEnabledWithdraw(ccy, balances);
  // 	if (!isEnabled)
  // 		return;

  // 	const { available, enableWithdraw, minWithdraw, reserved, total, feeWithdraw, withdrawalAmount } = balances[ccy][wallet];

  // 	// openModal('balances_withdraw_modal', BalancesWithdrawalDialog, {
  // 	//     currency: ccy,
  // 	//     available,
  // 	//     enableWithdraw,
  // 	//     minWithdraw,
  // 	//     reserved,
  // 	//     transactionFee: feeWithdraw,
  // 	//     total,
  // 	//     decimalAmount: withdrawalAmount
  // 	// });
  // }

  openTransferModal() {
    const { ccy, balances, wallet, openModal, closeBalOverlay } = this.props;
    const isEnabled = true;
    if (!isEnabled) return;

    openModal("balances_transfer_modal", BalancesTransferDialog, {
      currency: ccy,
      balances,
      defaultWallet: wallet,
      closeBalOverlay,
    });
  }

  // openDepositModal() {
  // 	const { ccy, balances, openModal, wallet } = this.props;
  // 	const isEnabled = isEnabledDeposit(ccy, balances);
  // 	if (!isEnabled)
  // 		return;

  // 	// openModal('balances_deposit_modal', BalancesDepositDialog, {
  // 	//     currency: ccy,
  // 	//     balances,
  // 	//     wallet,
  // 	// });
  // }

  render() {
    const {
      closeBalOverlay,
      ccy,
      balances,
      ticker,
      wallet: walletName,
      hideBalances,
    } = this.props;

    const isEnabledT = true;
    const transferBtnClasses = classNames("btn overlay-btn", {
      clickable: isEnabledT,
      unselectable: !isEnabledT,
    });

    return (
      <div id="balances-overlays">
        <span onClick={closeBalOverlay} className="closer clickable">
          ×
        </span>
        <span className="overlay-title">
          {ccy !== "" ? (
            <span>
              <span className="overlay-ccyName">{ccy}</span>
              <span className="show-soft has-ccy">&nbsp;{">"}&nbsp;</span>
              <span className="show-soft">{capitalize(walletName)} Wallet</span>
            </span>
          ) : null}
        </span>
        <div className="clear-eight"></div>
        <div className="d-flex d-justify-content-space-between align-items--center">
          {/* <RenderButton
						onClick={this.openDepositModal}
						className={depositBtnClasses}
						text="Deposit"
					/>

					<RenderButton
						onClick={this.openWithdrawalModal}
						className={withdrawBtnClasses}
						text="Withdraw"
					/> */}

          <RenderButton
            onClick={this.openTransferModal}
            className={transferBtnClasses}
            text="Transfer"
          />
        </div>
        <div className="clear-eight"></div>
        {ccy !== "" ? (
          <BalancesOverlayMainTable
            balances={balances}
            ticker={ticker}
            ccy={ccy}
            wallet={walletName}
            hideBalances={hideBalances}
          />
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  openModal: function (id, component, modalProps) {
    dispatch(showModal(id, component, modalProps));
  },
});

export default connect(null, mapDispatchToProps)(BalancesOverlayMain);
