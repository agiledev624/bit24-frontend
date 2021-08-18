import React from "react";
import ReactDOM from "react-dom";
import { invariant, makeRequest } from "./exports";
import { Interceptor, Ioc } from "./internals";
import { store } from "./store-wrapper";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { routes } from "./config";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./exports";
import { filter, map, tap } from "rxjs/operators";
import { initCurrency } from "./exports/ticker.utils";
import { Observable } from "rxjs";
import { Init } from "./components/Init";
import { ToastContainer } from "./ui-components";
import Storage from "@/internals/Storage";
import { UI_SETTING_STORAGE_KEY } from "@/constants/storage-keys";

function loadTheme() {
  const elms = document.getElementsByTagName("body");
  const body = elms && elms.length ? elms[0] : null;
  if (body) {
    const initialUISettings = Storage.get(UI_SETTING_STORAGE_KEY);
    body.className = initialUISettings?.theme || "dark-theme";
  }
}

function onCompleted(element: HTMLDivElement) {
  ReactDOM.render(
    <React.Fragment>
      <BrowserRouter>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {renderRoutes(routes)}
            <Init />
            <ToastContainer />
          </ConnectedRouter>
        </Provider>
      </BrowserRouter>
    </React.Fragment>,
    element
  );
}

function createApp(element: HTMLDivElement): Observable<HTMLDivElement> {
  invariant(!!element, `[app] need to provide an element but got: ${element}`);

  return makeRequest("exchangeInfo", { retry: true }).pipe(
    // @todo spinner while loading
    filter(({ error }) => !error),
    tap((ticker) => {
      // const { symbols } = ticker;
      // initCurrency(symbols);
    }),
    map(() => element)
  );
}

export const App = {
  init(element) {
    console.log("-> ....version......->");
    // init theme from storage
    loadTheme();

    // register store to Ioc
    Ioc.singleton("Store", () => store);

    // register fetch interceptors
    registerInterceptors();

    // init ticker utils
    return createApp(element).subscribe(onCompleted);
  },
  getStore() {
    return Ioc.make("Store");
  },
};

export function getState(reducer: string, key: string, log?) {
  const store = Ioc.make("Store");
  if (store) {
    const state = store.getState();
    log && console.log("state", state, "reducer", reducer, "key", key);

    if (reducer) {
      if (state.hasOwnProperty(reducer)) {
        return key ? state[reducer][key] : state[reducer];
      } else {
        return undefined;
      }
    }

    return state;
  }

  return undefined;
}

function registerInterceptors() {
  Interceptor.register({
    onRequest: function (url, config) {
      // todo add access token here
      // const token = getState('user', 'token', true);

      // // clear token
      // if (config.headers["access_token"]) {
      //   if (token && config.headers["access_token"] !== token) {
      //     config.headers["access_token"] = token;
      //   } else {
      //     delete config.headers["access_token"];
      //   }
      // }

      // // add Authorization to every requests
      // if (token && (!config.headers || !config.headers["access_token"])) {
      //   config.headers["access_token"] = token;
      // }

      // console.warn('request', config)
      // Modify the url or config here
      return [url, config];
    },
    onResponse: function (response) {
      // console.log('[interceptor] response', response);
      // Modify the reponse object
      return response;
    },
  });

  // must registerd separately if you wanna listen exception from previous Interceptor
  Interceptor.register({
    onResponseError: function (response) {
      console.warn("onResponseError", response);
    },
  });
}
