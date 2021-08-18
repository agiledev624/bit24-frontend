import { combineReducers, createStore, applyMiddleware } from "redux";
import { combineEpics, createEpicMiddleware, ofType } from "redux-observable";
import { catchError, mergeMap, takeUntil, tap } from "rxjs/operators";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware } from "connected-react-router";
import history from "./history";
import { BehaviorSubject, merge } from "rxjs";
import { SingletonWSManager } from "@/internals";
import { initWSStream } from "./streams/socket/create-socket-stream";
import { forEach } from "lodash";

export function configureStore(reducers, epics = {}) {
  const rootReducer = combineReducers(reducers);

  // const rootEpic = (action$, store$, dependencies) =>
  //   //@ts-ignore
  //   combineEpics(...Object.values(epics))(action$, store$, dependencies).pipe(
  //     catchError((error, source) => {
  //       console.error('>>> [epics] >>>', error);
  //       return source;
  //     })
  //   );

  const epic$ = new BehaviorSubject(combineEpics(...Object.values(epics)));

  const rootEpic = (action$, store$, dependencies) =>
    epic$.pipe(
      tap(() => console.log("update root epic")),
      mergeMap((callEpicFunc: any) =>
        callEpicFunc(action$, store$, dependencies).pipe(
          catchError((error, source) => {
            console.error(">>> [epics] >>>", error);
            return source;
          })
        )
      )
    );

  const epicMiddleware = createEpicMiddleware();

  const middlewares = [routerMiddleware(history), epicMiddleware];

  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

  //@ts-ignore
  epicMiddleware.run(rootEpic);

  SingletonWSManager.getEntries$().subscribe((ids) => {
    console.log("get entries ids", ids);
    let streams = [];
    ids.forEach((id) => {
      streams.push(initWSStream(id));
    });

    if (streams.length) {
      console.log("streams", streams);
      const wsEpic = (action$, state$) =>
        merge(...streams.map((s) => s(action$, state$))).pipe(
          takeUntil(
            SingletonWSManager.getEntries$().pipe(
              tap(() => console.log("reperpeprepp"))
            )
          )
        );

      epic$.next(wsEpic);
    }
  });

  return store;
}
