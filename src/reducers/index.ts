import { connectRouter } from "connected-react-router";
import { history } from "@/exports";

import { RootState } from "@/models/root-state.model";
import { wsReducer as ws } from "./ws.reducer";
import { authReducer as user } from "./auth.reducer";
import { settingReducer as setting } from "./ui-setting.reducer";
import { appReducer as app } from "./app.reducer";
import { balanceReducer as balance } from "./balance.reducer";
import { tickerReducer as ticker } from "./ticker.reducer";
import { tradeReducer as trade } from "./trade.reducer";
import { bookReducer as book } from "./book.reducer";
import { orderReducer as order } from "./order.reducer";

export const rootReducer: RootState = {
  // connected-router
  router: connectRouter(history),
  ws,
  user,
  ticker,
  trade,
  app,
  order,
  setting,
  balance,
  book,
};
