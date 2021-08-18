import { createSelector } from "reselect";

const getWsReducer = (state) => state.ws;

export const wsCollectionSelector = createSelector(
  getWsReducer,
  (ws) => ws.wsCollection
);
