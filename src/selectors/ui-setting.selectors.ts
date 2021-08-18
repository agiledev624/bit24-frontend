import { createSelector } from "reselect";
import { RootState } from "@/models/root-state.model";
import _isString from "lodash/isString";
import _memoize from "lodash/memoize";

const getSettingReducer = (state: RootState) => state.setting;

export const getSetting = createSelector(getSettingReducer, (settings) =>
  _memoize((key: string) => settings[key])
);

// export function getSetting(state: RootState, key: string): any {
//   const setting = getSettingReducer(state)[key];

//   if (setting !== undefined) {
//     return setting;
//   }

//   return DEFAULT_USER_SETTINGS_MAP[key];
// }

export function getTableSorting(
  state,
  { name, defaultSortBy, defaultSortDirection }
) {
  const tablesSorting = getSetting(state)("tables_sorting");
  const savedOrder = tablesSorting[name] || "";

  if (!_isString(savedOrder) || !savedOrder.includes("-")) {
    return {
      defaultSortBy,
      defaultSortDirection,
    };
  }

  const [sortBy, sortDirection] = savedOrder.split("-");

  return {
    defaultSortBy: sortBy,
    defaultSortDirection:
      sortDirection === "ASC" || sortDirection === "DESC"
        ? sortDirection
        : null,
  };
}

export function isFavorite(state, symbol) {
  const favorites = getSetting(state)("favorite_symbols");

  return !!~favorites
    .map((symbol) => symbol.toUpperCase())
    .indexOf(symbol.toUpperCase());
}
