import React, { CSSProperties, MouseEvent, ReactNode } from "react";
import _uniqueId from "lodash/uniqueId";
import _isString from "lodash/isString";
import _isEqual from "lodash/isEqual";
import classNames from "classnames";
import { EMPTY_ARRAY, EMPTY_OBJ } from "@/exports";
import { SelectDropdown } from "./ui/Dropdown/Select.dropdown";
import { Tooltip } from ".";

export const NOOP = (to: string) => {};

export enum TabTypes {
  RADIO_BUTTONS = 1,
  NORMAL = 2,
  DASHED_BUTTONS = 3,
}
interface TabContainerProps<T = string> {
  elements: TabProps<T>[];
  selected?: string;
  onChange?: (to: string) => void;
  tabStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  tabType?: TabTypes;
  containerClassName?: string;
  tabClassName?: string;
  disabled?: boolean;
  hasTooltip?: boolean;
}

interface TabDropdownOptions {
  label: ReactNode;
  value: string;
}

export interface TabProps<T = string> {
  active?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  title: string | ReactNode;
  to: T;
  tooltip?: string;
  style?: CSSProperties;
  className?: string;
  dropdownOptions?: TabDropdownOptions[];
}

function getTabClassesByType(tabType: TabTypes): string {
  switch (tabType) {
    case TabTypes.NORMAL: {
      return "";
    }
    case TabTypes.RADIO_BUTTONS: {
      return "tab-radio-buttons";
    }
    case TabTypes.DASHED_BUTTONS: {
      return "tab-dashed-options";
    }
  }
}

export const Tabs = React.memo(
  ({
    elements = EMPTY_ARRAY,
    selected = "",
    onChange = NOOP,
    disabled,
    containerStyle,
    tabStyle = EMPTY_OBJ,
    tabType = TabTypes.NORMAL,
    containerClassName,
    tabClassName,
    hasTooltip,
  }: TabContainerProps) => (
    <div
      className={classNames(
        "tabs",
        getTabClassesByType(tabType),
        containerClassName,
        {
          "tabs--disabled": disabled,
        }
      )}
      style={containerStyle}
    >
      {elements.map((elm) => {
        const {
          active,
          onClick,
          title = "",
          to = "",
          style = {},
          dropdownOptions,
          className: tabChildClassName,
          tooltip,
        } = elm;

        const isDropdown = dropdownOptions && dropdownOptions.length;
        let item = _isString(title) ? <span>{title}</span> : title;
        let isActive = active || selected === to;

        if (isDropdown) {
          let found = dropdownOptions.find(({ value }) =>
            _isEqual(value, selected)
          );
          let titleAlias = !!found ? found.label : title;
          isActive = !!found;

          item = (
            <SelectDropdown
              options={dropdownOptions}
              placeholder={titleAlias}
              className="ui-tabs--dropdown"
              // value={!!found ? found.value : ""}
              //@ts-ignore
              onChange={
                onClick ||
                function ({ value, label }) {
                  onChange(value);
                }
              }
            />
          );
        }
        const className = classNames("tab", tabClassName, tabChildClassName, {
          active: isActive,
        });

        let props = {
          key: to || _uniqueId("tabs-"),
          className,
          style: { ...tabStyle, style },
        };

        if (!isDropdown) {
          //@ts-ignore
          props.onClick =
            onClick ||
            function (e) {
              e.preventDefault();
              e.stopPropagation();
              onChange(to);
            };
        }

        if (hasTooltip) {
          return (
            <div {...props}>
              <Tooltip tooltipContent={tooltip}> {item} </Tooltip>{" "}
            </div>
          );
        }

        return <div {...props}> {item} </div>;
      })}
    </div>
  )
);
