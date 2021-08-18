import {
  OVERRIDE_UI_SETTING,
  TOGGLE_BOOLEAN_SETTING,
  TOGGLE_WORKSPACE_SETTING,
  TOGGLE_FAVOR_SYMBOL,
  UI_SET_ORDER,
  UPDATE_UI_SETTING,
} from "@/actions/ui-setting.actions";
import { getDefaultUserSetting, updateThemeVariables } from "@/exports";
import _isNull from "lodash/isNull";
import _get from "lodash/get";

const initialState = getDefaultUserSetting();

export const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_UI_SETTING: {
      const { key, value } = action.payload;
      if (key === "theme" && state.theme !== value) {
        updateThemeVariables(value);
      }
      return {
        ...state,
        [key]: value,
      };
    }
    case TOGGLE_FAVOR_SYMBOL: {
      const { symbol } = action.payload;

      let favorites = [...state.favorite_symbols];

      if (~favorites.indexOf(symbol)) {
        favorites = favorites.filter((s) => s !== symbol);
      } else {
        favorites = [...favorites, symbol];
      }
      return {
        ...state,
        favorite_symbols: favorites,
      };
    }
    case OVERRIDE_UI_SETTING: {
      const { settings } = action.payload;
      return {
        ...state,
        ...settings,
      };
    }
    case TOGGLE_BOOLEAN_SETTING: {
      const { key } = action.payload;
      const value = !_get(state, [key]);

      return {
        ...state,
        [key]: value,
      };
    }
    case TOGGLE_WORKSPACE_SETTING: {
      const { key } = action.payload;
      const value = !_get(state, ["enabled_workspaces", key]);

      return {
        ...state,
        enabled_workspaces: {
          ..._get(state, ["enabled_workspaces"], {}),
          [key]: value,
        },
      };
    }
    case UI_SET_ORDER: {
      const { section, key, direction } = action.payload;

      const settingKey = "tables_sorting";
      const currentMap = state[settingKey];
      const [prevKey, prevAsc] = (currentMap[section] || "-").split("-");
      let newOrder = direction;
      // depending on the table type direction may be set explicitly or may be not
      // if not set then need to determine it here

      if (!newOrder && !_isNull(newOrder)) {
        newOrder =
          key !== prevKey ? "desc" : prevAsc !== "desc" ? "desc" : "asc";

        if (key === prevKey && prevAsc === "asc") {
          newOrder = "none";
        }
      }

      const nextValue = `${key}-${newOrder || "NULL"}`;
      const newSortOrder = {
        ...currentMap,
        [section]: nextValue,
      };

      const nextState = {
        ...state,
        tables_sorting: newSortOrder,
      };

      return nextState;
    }
    default:
      return state;
  }
};
