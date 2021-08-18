import { createSelector } from "reselect";

const _getAppState = (state) => state.app;

export const getModals = createSelector(
  _getAppState,
  (appState) => appState.modals
);

export const getWsUrlAddresses = createSelector(
  _getAppState,
  (appState) => appState.socketAddresses
);

export const isAppReady = createSelector(
  _getAppState,
  (appState) => appState.isReady
);
