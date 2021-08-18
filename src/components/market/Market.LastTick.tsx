import { getLastPriceBySymbol } from "@/selectors/ticker.selectors";
import React from "react";
import { connect } from "react-redux";
import { LastTick } from "../LastTick";

const MarketLastTick = ({ price, symbol }) => (
  <div className="cpn-market-info__lastTick">
    <LastTick price={price} symbol={symbol} />
  </div>
);

const mapStateToProps = (state, { symbol }) => ({
  price: getLastPriceBySymbol(state)(symbol),
});

export default connect(mapStateToProps)(MarketLastTick);
