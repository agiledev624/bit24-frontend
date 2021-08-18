import { toggleBooleanSetting } from "@/actions/ui-setting.actions";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { IconButton } from "@/ui-components";
import React, { MouseEvent } from "react";
import { connect } from "react-redux";

interface BalancesEyeToggleProps {
  isHideData: boolean;
  toggleSetting: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const BalanceEyes = ({
  isHideData,
  toggleSetting,
}: Partial<BalancesEyeToggleProps>) => (
  <IconButton
    cssmodule="far"
    id={isHideData ? "eye-slash" : "eye"}
    onClick={toggleSetting}
  />
);

const mapStateToProps = (state) => ({
  isHideData: getSetting(state)("hidden_balance"),
});

const mapDispatchToProps = (dispatch) => ({
  toggleSetting: () => {
    dispatch(toggleBooleanSetting({ key: "hidden_balance", persist: false }));
  },
});
export const BalanceEyeToggle = connect(
  mapStateToProps,
  mapDispatchToProps
)(BalanceEyes);
