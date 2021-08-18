import { saveToStorage } from "@/actions/app.actions";
import {
  OVERRIDE_UI_SETTING,
  TOGGLE_BOOLEAN_SETTING,
  TOGGLE_FAVOR_SYMBOL,
  UI_SET_ORDER,
  UPDATE_UI_SETTING,
} from "@/actions/ui-setting.actions";
import { UI_SETTING_STORAGE_KEY } from "@/constants/storage-keys";
import { RootState } from "@/models/root-state.model";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { filter, map, withLatestFrom } from "rxjs/operators";

export const uiSettingEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(
      UPDATE_UI_SETTING,
      OVERRIDE_UI_SETTING,
      UI_SET_ORDER,
      TOGGLE_BOOLEAN_SETTING,
      TOGGLE_FAVOR_SYMBOL
    ),
    //@todo defined type
    filter((action) => action.payload.persist),
    withLatestFrom(state$),
    map(([_, state]) => {
      const { setting } = state;

      return saveToStorage(UI_SETTING_STORAGE_KEY, setting);
    })
  );
