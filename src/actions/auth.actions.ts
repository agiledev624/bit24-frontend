/**
 * [requestLoginAction] -> [AUTHORIZED SUCCESS]?  -> (Yes) -> [USER_LOGIN_2FA]? -> (Yes) -> (request 2FA) -> [LOGIN_SUCCESS] -> X
 * (call request)                                    (No) -> X                     (No) -> [LOGIN_SUCCESS] -> X
 *
 * [requestLogoutAction] -> [LOGOUT_SUCCESS]
 *  (call request)           (force logout)
 */

import { createFakeNOOPLoginStream } from "@/fakers/auth.faker";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

// [scenarios] [requestLoginAction] -> 'authorized' means getting accesstoken and user will be navigated to other page
export const USER_AUTHORIZED = "@user/AUTHORIZED";
// [scenarios] request logout or token expired -> 'unauthorized' means clean break user data
export const USER_UNAUTHORIZED = "@user/UNAUTHORIZED";
// update user state
export const USER_UPDATE = "@user/UPDATE";

// used to open new step to accomplish login flow (required 2FA)
export const USER_LOGIN_2FA = "@user/LOGIN_2FA";

// user authorized and successfully auth
export const USER_LOGIN_SUCCESS = "@user/LOGIN_SUCCESS";

export const USER_REQUEST_LOGOUT = "@user/REQUEST_LOGOUT";
export const USER_LOGOUT_SUCCESS = "@user/LOGOUT_SUCCCESS";

const isError = false;
export const requestLoginAction = ({ email, password, fallback }) =>
  createFakeNOOPLoginStream(email, isError).pipe(
    catchError((error) => {
      fallback(error);

      return throwError(error.errorMessage);
    })
  );

export function updateUserInfo(comingData) {
  return {
    type: USER_UPDATE,
    payload: comingData,
  };
}

// EMPTY will be replaced by api call later
// then kicks user out by all means
export const requestLogoutAction = (token: string) => ({
  type: USER_REQUEST_LOGOUT,
  payload: { token },
});

export const logoutSuccessAction = (token: string) => ({
  type: USER_LOGOUT_SUCCESS,
  payload: { token },
});
