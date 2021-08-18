/**
 * which [may] occurs during runtime
 * these following actions is drafts, it may or not be used in the future
 */

import { push, RouterAction } from "connected-react-router";

export const CHANGE_THEME = "@app/CHANGE_THEME";
// hmmm dilemma of creating an ErrorReducer or located in App reducer
export const GLOBAL_NOTIFIER = "@app/GLOBAL_NOTIFIER";

export const SAVE_DATA_STORAGE = "@app/STORAGE_SAVE";
export const DELETE_DATA_STORAGE = "@app/DELETE_DATA_STORAGE";

// modals
export const OPEN_MODAL = "@app/OPEN_MODAL";
export const CLOSE_MODAL = "@app/CLOSE_MODAL";
export const CLOSE_ALL_MODALS = "@app/CLOSE_ALL_MODALS";

export const UPDATE_WS_ENTRY = "@app/UPDATE_WS_ENTRY";

export function showModal(id: string, component: any, props: any) {
  return {
    type: OPEN_MODAL,
    payload: { id, component, props },
  };
}

export function closeModal(id) {
  return {
    type: CLOSE_MODAL,
    payload: id,
  };
}

export function closeAllModals() {
  return {
    type: CLOSE_ALL_MODALS,
  };
}

export function navigate(path: string = "/", state?: any): RouterAction {
  return push(path);
}

export function saveToStorage(key: string, data: any) {
  return {
    type: SAVE_DATA_STORAGE,
    payload: { key, data },
  };
}

export function deleteFromStorage(key: string) {
  return {
    type: DELETE_DATA_STORAGE,
    payload: { key },
  };
}

export const updateSocketUrlEntries = (entries = []) => ({
  type: UPDATE_WS_ENTRY,
  payload: entries,
});
