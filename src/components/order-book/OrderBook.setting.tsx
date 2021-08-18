import { showModal } from "@/actions/app.actions";
import {
  toggleBooleanSetting,
  updateUISetting,
} from "@/actions/ui-setting.actions";
import { OrderBookStyleEnum } from "@/constants/order-book-enums";
import { greenText, redText } from "@/exports";
import { getSetting } from "@/selectors/ui-setting.selectors";
import {
  FixedDropdown,
  InputTextInline,
  Menu,
  MenuItem,
  RadioButton,
  RadioGroup,
  Switch,
} from "@/ui-components";
import Setting from "@/ui-components/icons/setting";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import OrderBookConfirm1ClickPopup from "./OrderBook.confirm-1-click-popup";

const BookSetting = ({
  dualColumn,
  scrollable,
  showDepth,
  groupLevel,
  enabled1Click,
  enable1ClickConfirmPopup,
  toggleBookMode,
  toggleScrollable,
  toggleDepth,
  toggleEnabling1Click,
  changeLevel,
}) => {
  const selectedColumnView = dualColumn
    ? OrderBookStyleEnum.DUAL_COL
    : OrderBookStyleEnum.SINGLE_COL;
  const toggleEnable1ClickFunc = useCallback(() => {
    toggleEnabling1Click(enabled1Click ? false : enable1ClickConfirmPopup);
  }, [enable1ClickConfirmPopup, toggleEnabling1Click, enabled1Click]);

  return (
    <FixedDropdown
      title={<Setting className="order-book__setting-icon" />}
      contentClasses="order-book__setting-menu"
      alignContent="right"
    >
      <Menu>
        <RadioGroup
          className="select-column"
          selectedValue={selectedColumnView}
          onChange={toggleBookMode}
        >
          <div className="label">Colums view</div>
          <RadioButton label="Single" value={OrderBookStyleEnum.SINGLE_COL} />
          <RadioButton label="Dual" value={OrderBookStyleEnum.DUAL_COL} />
        </RadioGroup>
        {/* <MenuItem content={
          <div className="orderbook__level-group">
            <div className="orderbook__input-group">
              <label className="label">1-Click</label>
              <Switch isActive={enabled1Click} onChange={toggleEnable1ClickFunc}/>
            </div>
            <div className="input-desc"> Place order directly from orderbook.</div>
          </div>
        } /> */}
        <MenuItem
          spaceBottom={true}
          content={
            <div className="orderbook__level-group">
              <div className="orderbook__input-group">
                <label className="label">Grouping</label>
                <InputTextInline
                  defaultValue={0.5}
                  readonly={true}
                  onChange={(value) => {
                    console.log("v", value);
                  }}
                  right={
                    <>
                      <div className="append clickable">
                        <i className={`fa fa-minus ${redText()}`} />
                      </div>
                      <div className="append clickable">
                        <i className={`fa fa-plus ${greenText()}`} />
                      </div>
                    </>
                  }
                />
              </div>
              <div className="input-desc">Group orders by price intervals.</div>
            </div>
          }
        />
        <MenuItem
          content={
            <div>
              <div className="orderbook__input-group">
                <label className="label">Refresh Rate</label>
                <InputTextInline
                  defaultValue={300}
                  onChange={(value) => {
                    console.log("v", value);
                  }}
                  right={<div className="append">ms</div>}
                />
              </div>
              <div className="input-desc">
                Higher value reduces number flickering and CPU load.
              </div>
            </div>
          }
        />
        <MenuItem
          content={
            <div className="d-flex d-justify-content-space-between w-100">
              <div className="label">Scrollable</div>
              <Switch
                isActive={scrollable}
                onChange={() => {
                  toggleScrollable();
                }}
              />
            </div>
          }
        />
        <MenuItem
          content={
            <div className="d-flex d-justify-content-space-between w-100">
              <div className="label">Depth Visualization</div>
              <Switch
                isActive={showDepth}
                onChange={() => {
                  toggleDepth();
                }}
              />
            </div>
          }
        />
      </Menu>
    </FixedDropdown>
  );
};

const mapStateToProps = (state) => ({
  dualColumn: getSetting(state)("orderbook_dual_column"),
  scrollable: getSetting(state)("orderbook_scrollable"),
  showDepth: getSetting(state)("orderbook_show_depth"),
  groupLevel: getSetting(state)("orderbook_zoom_level"),
  enabled1Click: getSetting(state)("orderbook_1_click"),
  enable1ClickConfirmPopup: getSetting(state)(
    "show_orderbook_1_click_confirm_popup"
  ),
});

const mapDispatchToProps = (dispatch) => ({
  toggleBookMode: function (mode: number, persist?: boolean) {
    const isDual = mode === OrderBookStyleEnum.DUAL_COL;
    dispatch(
      updateUISetting({
        key: "orderbook_dual_column",
        value: isDual,
        persist: true,
      })
    );
  },
  toggleScrollable: function (persist?: boolean) {
    dispatch(
      toggleBooleanSetting({ key: "orderbook_scrollable", persist: false })
    );
  },
  toggleDepth: function (persist?: boolean) {
    dispatch(
      toggleBooleanSetting({ key: "orderbook_show_depth", persist: false })
    );
  },
  toggleEnabling1Click: function (showPopup: boolean) {
    if (showPopup) {
      dispatch(
        showModal(
          "orderbook_confirm_1_click_popup",
          OrderBookConfirm1ClickPopup,
          {}
        )
      );
    } else {
      dispatch(
        toggleBooleanSetting({ key: "orderbook_1_click", persist: true })
      );
    }
  },
  changeLevel: function (level = 0, persist?: boolean) {
    dispatch(
      updateUISetting({
        key: "orderbook_zoom_level",
        value: level,
        persist: false,
      })
    );
  },
});

export const BookSettingDropdown = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookSetting);
