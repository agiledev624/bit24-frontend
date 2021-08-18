import { DELETE_DATA_STORAGE, SAVE_DATA_STORAGE } from "@/actions/app.actions";
import Storage from "@/internals/Storage";
/**
 * used to save/delete storage,
 * acts as a task runs outside View
 * does not effect to Reducers
 */

import { ofType } from "redux-observable";
import { ignoreElements, tap } from "rxjs/operators";

export const storageSaveEpic = (action$) =>
  action$.pipe(
    ofType(SAVE_DATA_STORAGE),
    tap((action: any) => {
      const { key, data } = action.payload;
      Storage.save(key, data);
    }),
    ignoreElements()
  );

export const storageDeleteEpic = (action$) =>
  action$.pipe(
    ofType(DELETE_DATA_STORAGE),
    tap((action: any) => {
      const { key } = action.payload;
      console.warn("kekekek", key);
      Storage.delete(key);
    }),
    ignoreElements()
  );
