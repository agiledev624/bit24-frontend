import React from "react";
import { getCellClassByHeader, getHeaderLabel } from "./OrderBook.helpers";

interface BookSideHeaderProps {
  headers: string[];
}

/**
 *
 * Header default direction
 * Price - Side - Total
 * isReverse => Total - Side - Price
 */
export const BookSideHeader = ({ headers }: BookSideHeaderProps) => {
  return (
    <thead>
      <tr>
        {headers.map((header: string) => (
          <th key={header} className={getCellClassByHeader(header)}>
            <div className="th-inner">
              <span>{getHeaderLabel(header)}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};
