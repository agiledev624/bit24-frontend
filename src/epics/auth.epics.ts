import {
  logoutSuccessAction,
  USER_AUTHORIZED,
  USER_LOGIN_2FA,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_REQUEST_LOGOUT,
} from "@/actions/auth.actions";
import { ofType, StateObservable } from "redux-observable";
import {
  map,
  tap,
  mapTo,
  mergeMap,
  withLatestFrom,
  filter,
  switchMap,
  catchError,
} from "rxjs/operators";
import { LoginType } from "@/fakers/auth.faker";
import {
  deleteFromStorage,
  navigate,
  saveToStorage,
} from "@/actions/app.actions";
import { defer, from, of } from "rxjs";
import { USER_STORAGE_KEY } from "@/constants/storage-keys";
import { isUserLoggedIn } from "@/selectors/auth.selectors";
import { RoutePaths } from "@/constants/route-paths";
import { requestAuthWs, requestUnauthWs } from "@/actions/ws.actions";

export const loginEpic = (actions$) =>
  actions$.pipe(
    ofType(USER_AUTHORIZED),
    map((action: any) => {
      console.warn("[USER_AUTHORIZED] data", action.payload);
      const { login_type, token, username } = action.payload;
      const isNoop = login_type === LoginType.NOOP;
      // const isNoop = true;

      if (!isNoop) {
        console.warn("login with extra action");
      }

      return {
        type: isNoop ? USER_LOGIN_SUCCESS : USER_LOGIN_2FA,
        payload: { token, username },
      };
    })
  );

// redirect to /
export const loginSuccessEpic = (action$, state$: StateObservable<any>) =>
  action$.pipe(
    ofType(USER_LOGIN_SUCCESS),
    tap(() => console.log("user-login-success", { ...state$.value.user })),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      of(
        saveToStorage(USER_STORAGE_KEY, state.user),
        requestAuthWs(action.payload.token),
        navigate(RoutePaths.ROOT)
      )
    )
  );

// redirect to 2fa
export const login2FAEpic = (action$) =>
  action$.pipe(ofType(USER_LOGIN_2FA), mapTo(navigate(RoutePaths.TWO_FACTOR)));

export const logoutEpic = (action$, state$) =>
  action$.pipe(
    ofType(USER_REQUEST_LOGOUT),
    withLatestFrom(state$),
    filter(([action, state]) => isUserLoggedIn(state) && action.payload.token),
    tap(() => console.warn("[logout epic] prepare log user out")),
    // @TODO: added api logout here, no matter what it is
    switchMap(([action]) =>
      defer(() =>
        from(fetch("https://jsonplaceholder.typicode.com/todos/1"))
      ).pipe(
        map(() => action.payload.token),
        catchError(() => of(logoutSuccessAction(action.payload.token))) // force logout even error occurs
      )
    ),
    map((token: string) => logoutSuccessAction(token))
  );

export const logoutSuccessEpic = (action$) =>
  action$.pipe(
    ofType(USER_LOGOUT_SUCCESS),
    tap(() => console.warn("[logout epic] user logged out -> end")),
    mergeMap((action: any) =>
      of(
        requestUnauthWs(action.payload.token),
        deleteFromStorage(USER_STORAGE_KEY),
        navigate("/")
      )
    )
  );
