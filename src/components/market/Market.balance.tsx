import React, { useState } from "react";

export const MarketBalance = () => {
  const [isOpen, setOpen] = useState(false);

  return isOpen ? (
    <div
      className="d-flex d-align-items-center cpn-market-info__balances clickable"
      onClick={() => setOpen(false)}
    >
      <span className="mr-10">»</span>
      <div className="info">
        <div className="title">Balance</div>
        <div className="value">10.4738 BTC</div>
      </div>
      <div className="info">
        <div className="title">Equity</div>
        <div className="value">10.4738 BTC</div>
      </div>
      <div className="info">
        <div className="title">Available Margin</div>
        <div className="value">9.0000 BTC</div>
      </div>
    </div>
  ) : (
    <div
      className="market-info__balances clickable"
      onClick={() => setOpen(true)}
    >
      <div className="dropdown__button">« Stats</div>
    </div>
  );
};
