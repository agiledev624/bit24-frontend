import { Dropdown, DropdownPosition } from "@/ui-components";
import Eye from "@/ui-components/icons/eye";
import React, { useState, useMemo } from "react";

export const ChartFavoriteDropdown = ({ options, selectedOptions, setSelectedOptions }) => {
  options = [
    {
      title: 'Bars1',
      icon: <Eye id="eye" className="eye" />,
    },
    {
      title: 'Bars2',
      icon: <i className="fas fa-eye font-size-12"></i>,
    }
  ];
  return (
    <Dropdown
      displayArrow={true}
      titleClasses="chart-fav-dropdown__ticker-btn"
      position={DropdownPosition.LEFT}
      arrowClass="icon-arrow_down_icon font-size-16"
      title="Test"
      contentClasses="chart-fav-dropdown__dropdown"
      toggledDropdown={() => true}
    >
      <div className="chart-fav-dropdown__wrapper">
        <ul>
          {options.map(option => (
            <li className="d-flex justify-content-between px-10 py-5">
              <div>
                {option.icon}
              </div>
              <div>
                {option.title}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Dropdown>
  );
};