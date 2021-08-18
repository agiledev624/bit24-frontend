import { Observable, of, defer, throwError } from "rxjs"
import { createFakeResponse, generateRandTokenId } from "./helpers";
import { delay } from "rxjs/operators";

export enum LoginType {
  // navigate directly to TradingScreen
  NOOP = 1,
  //(optional) two factor authen
  //have to switch to new step before navigation
  ACTION = 2,
}

const DELAY = 2000;
export function createFakeNOOPLoginStream(username: string, isFailed: boolean = false): Observable<any> {
  if(isFailed) {
    const errorResponse = createFakeResponse(400, null, 'Invalid request');

    return throwError(errorResponse).pipe(
      delay(DELAY)
    );
  }

  const demoResponse = createFakeResponse(200, {
    username,
    token: generateRandTokenId(),
    login_type: LoginType.NOOP
  });

  return defer(() => of(demoResponse).pipe(
    delay(DELAY),
  ));
}

export function createFakeACTIONLoginStream(username: string, isFailed: boolean = false): Observable<any> {
  if(isFailed) {
    const errorResponse = createFakeResponse(400, null, 'Invalid request');

    return throwError(errorResponse).pipe(
      delay(DELAY),
    );
  }

  const demoResponse = createFakeResponse(200, {
    username,
    token: generateRandTokenId(),
    login_type: LoginType.ACTION
  });

  return of(demoResponse).pipe(
    delay(DELAY),
  );
}