export const UPDATE_UI_SETTING = "@ui/UPDATE_UI_SETTING";
export const OVERRIDE_UI_SETTING = "@ui/OVERRIDE_UI_SETTING";
export const UI_SET_ORDER = "@ui/UI_SET_ORDER";
export const TOGGLE_BOOLEAN_SETTING = "@ui/TOGGLE_BOOLEAN_SETTING";
export const TOGGLE_WORKSPACE_SETTING = "@ui/TOGGLE_WORKSPACE_SETTING";
export const TOGGLE_FAVOR_SYMBOL = "@ui/TOGGLE_FAVOR_SYMBOL";

export function updateUISetting({ key, value, persist = false }) {
  return {
    type: UPDATE_UI_SETTING,
    payload: { key, value, persist },
  };
}

export function overrideUISetting({ settings, persist }) {
  return {
    type: OVERRIDE_UI_SETTING,
    payload: { settings, persist },
  };
}

export function setOrder(section, orderBy, sortDirection, persist) {
  return {
    type: UI_SET_ORDER,
    payload: {
      section,
      key: orderBy,
      direction: sortDirection,
      persist,
    },
  };
}

export function toggleBooleanSetting({ key, persist }) {
  return {
    type: TOGGLE_BOOLEAN_SETTING,
    payload: {
      key,
      persist,
    },
  };
}

export function toggleWorkspaceSetting({ key, persist }) {
  return {
    type: TOGGLE_WORKSPACE_SETTING,
    payload: {
      key,
      persist,
    },
  };
}
