import { RoutePaths } from "@/constants/route-paths";
import { isUserLoggedIn } from "@/selectors/auth.selectors";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { MarketHistoryModuleType } from "./market-history.types";

function getEmptyMessageByModule(module: MarketHistoryModuleType) {
  switch (module) {
    case "open-order": {
      return "There is no open orders";
    }
    case "stop-order": {
      return "There is no stop orders";
    }
    case "order-history": {
      return "There is no order history";
    }
    case "trade-history": {
      return "There is no trade history";
    }
    default:
      return "??asdasd??";
  }
}

interface MarketHistoryEmptyMessageProps {
  isLoggedIn: boolean;
}

const MarketHistoryEmptyMessage = ({
  isLoggedIn,
}: Partial<MarketHistoryEmptyMessageProps>) => {
  if (isLoggedIn) return null;

  return (
    <div className="market-history__empty_message">
      <p>
        <Link to={RoutePaths.LOGIN}>Log in</Link> or{" "}
        <Link to={RoutePaths.REGISTER}>Register Now</Link> to trade
      </p>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: isUserLoggedIn(state),
});
export default connect(mapStateToProps)(MarketHistoryEmptyMessage);
