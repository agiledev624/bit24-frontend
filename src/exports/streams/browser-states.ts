import { fromEvent, of, Observable, Subject } from "rxjs";
import {
  map,
  delay,
  startWith,
  tap,
  switchMap,
  distinctUntilChanged,
} from "rxjs/operators";
import { config } from "@/config";

export enum AppBrowserState {
  ACTIVE = 1,
  IDLE = 2,
  SLEPT = 3,
}

export function registerBrowserState(): Observable<AppBrowserState> {
  const appState$ = new Subject<AppBrowserState>();

  let hiddenKey = "";
  let visibilityChange;

  // Opera 12.10 and Firefox 18 and later support
  if (typeof document.hidden !== "undefined") {
    hiddenKey = "hidden";
    visibilityChange = "visibilitychange";
    //@ts-ignore
  } else if (typeof document.msHidden !== "undefined") {
    hiddenKey = "msHidden";
    visibilityChange = "msvisibilitychange";
    //@ts-ignore
  } else if (typeof document.webkitHidden !== "undefined") {
    hiddenKey = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }

  if (hiddenKey && visibilityChange) {
    const visibilityChanged$ = fromEvent(
      document,
      visibilityChange as string
    ).pipe(
      //@ts-ignore
      map((_) => document[hiddenKey]),
      switchMap((isHidden: boolean) => {
        const idleOrSlept$ = of(true).pipe(
          delay(config.appIdleTimeout),
          tap(() => {
            console.log(" >>>>>> appp is in idle");
            appState$.next(AppBrowserState.IDLE);
          }),
          delay(config.appSleptTimeout),
          tap(() => {
            console.log(" >>>>>> appp is slept");
            appState$.next(AppBrowserState.SLEPT);
          })
        );

        const awake$ = of(false).pipe(
          tap(() => {
            console.log(" >>>>>> appp is awakend");
            appState$.next(AppBrowserState.ACTIVE);
          })
        );

        if (isHidden) {
          return idleOrSlept$;
        } else {
          return awake$;
        }
      }),
      distinctUntilChanged()
    );

    visibilityChanged$.subscribe();
  }

  return appState$.pipe(startWith(AppBrowserState.ACTIVE));
}

// const browser$ = registerBrowserState();
// const timer1$ = interval(1000).pipe(
//   withLatestFrom(() => browser$),
// );

// timer1$.subscribe(state => {
//   console.warn('log state', state);
// })
