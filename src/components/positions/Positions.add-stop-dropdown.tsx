import { Tabs } from "@/ui-components";
import { FixedDropdown } from "@/ui-components/ui/Dropdown/FixedDropdown";
import React from "react";
import { ControlGroupInline } from "../../ui-components/ui/inputs/ControlGroupInline";

export const AddStopDropdown = () => {
  return (
    <FixedDropdown
      title={
        <div className="w-100 text-right">
          <button className="btn black-btn">Add Stop</button>
        </div>
      }
      contentClasses="market-history__dropdown-menu"
    >
      {({ toggleContent }) => (
        <>
          <div className="content-info">
            <Tabs
              elements={[
                {
                  title: "Stop",
                  to: "stop",
                  active: true,
                },
                {
                  title: "Trailing Stop",
                  to: "trailing-stop",
                },
                {
                  title: "Stop Market",
                  to: "stop-market",
                },
              ]}
              tabStyle={{ fontSize: "70%" }}
            />
            <form className="mt-10">
              <ControlGroupInline
                type="number"
                label="Stop Price"
                appendText="USD"
                onChange={(v) => {}}
                defaultValue={0.0001}
              />
              <ControlGroupInline
                type="number"
                label="Est. PNL"
                appendText="USD"
                onChange={(v) => {}}
                defaultValue={0.0001}
                readonly={true}
              />
            </form>
            <div className="btn-toggler font-size-9">
              <div className="item text-center active">Last</div>
              <div className="item text-center">Index</div>
              <div className="item text-center">Mark</div>
            </div>
          </div>
          <div className="btn-list">
            <button className="btn cancel-btn" onClick={toggleContent}>
              Cancel
            </button>
            <button className="btn primary">Confirm</button>
          </div>
        </>
      )}
    </FixedDropdown>
  );
};
