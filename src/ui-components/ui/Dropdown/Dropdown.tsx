import React, { ReactNode, useCallback, useState } from "react";
import classNames from "classnames";
import _isString from "lodash/isString";

export enum DropdownPosition {
  LEFT = "left",
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  RIGHT = "right",
}

export interface DropdownProps {
  children: ReactNode;
  defaultOpen?: boolean;
  title: ReactNode;
  displayArrow?: boolean;
  position?: DropdownPosition;
  contentHeader?: ReactNode;
  contentClasses?: string;
  titleClasses?: string;
  arrowClass?: string;
  closeDropdownAfterClick?: boolean;
  dropdownClasses?: string;
  toggledDropdown?: (toggled?) => {};
  hoverable?: boolean;
}

export const Dropdown = ({
  children,
  defaultOpen = false,
  title,
  displayArrow = false,
  position = DropdownPosition.RIGHT,
  contentHeader,
  contentClasses,
  titleClasses,
  arrowClass,
  dropdownClasses,
  toggledDropdown,
  hoverable,
}: DropdownProps) => {
  const [isOpen, setOpen] = useState(defaultOpen);

  const toggleContent = useCallback(
    (e) => {
      if (!hoverable) {
        toggledDropdown(!isOpen);
        setOpen(!isOpen);
      }
    },
    [toggledDropdown, hoverable, isOpen, setOpen]
  );

  const dropdownClass = classNames("cpn-dropdown", dropdownClasses, {
    "cpn-dropdown-hoverable": hoverable,
    show: isOpen,
  });

  const contentClsses = classNames(
    "cpn-dropdown__content",
    "nodisplay",
    contentClasses,
    {
      "cpn-dropdown__content--top-right":
        position === DropdownPosition.TOP_RIGHT,
      "cpn-dropdown__content--top-left": position === DropdownPosition.TOP_LEFT,
      "cpn-dropdown__content--left": position === DropdownPosition.LEFT,
    }
  );
  const arrowClsses = !!arrowClass ? arrowClass : "icon-dropdown_arrow_down";

  const _title = _isString(title) ? <span>{title}</span> : title;
  const titleCls = classNames("cpn-dropdown__button", titleClasses);

  return (
    <div className={dropdownClass}>
      <div className="cpn-dropdown__wrapper">
        <label className={titleCls} onClick={toggleContent}>
          {_title}
          {displayArrow && (
            <span className="cpn-dropdown__arrow">
              <span className={arrowClsses}></span>
            </span>
          )}
        </label>
        <div className={contentClsses} onMouseLeave={toggleContent}>
          {contentHeader && (
            <div className="cpn-dropdown__header mb-10">{contentHeader}</div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
