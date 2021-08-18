# bit24-exchange-web-desktop

## Project Structure

```
src
├── config
│   └── routes.ts
│   └── config.ts
│   └── index.ts
├── components // particular Exchange components are located here (for example: Header, Market, OrderBook, Trades, Chart, Login/RegisterForm ....)and should be followed by the [container pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

├── constants // includes almost enum variables we wanna share through files
│   └── route-paths.ts
├── epics // I am using redux-observable for "Trading-flows" (or Exchange-flows), since it's just a middleware if you're not familiar with Reactive/Rxjs style, I highly recommend you choose another alternative middleware that you prefer to, and creating individual folder (thunks, sagas ...), see @/store-wrapper.ts and @/exports/configure-store.ts for more details
│   └── ws.epic.ts // for websock lifecycle
│   └── auth.epic.ts // for authentication or authorizaton
│   └── storage.epic.ts // includes only 2 Actions: [Save] and [Delete] localStorage data
│   └── ui-setting.epic.ts // [load]/[save]/[get] object or key from @/exports/defaultUISettings.ts
│   └── market.epic.ts // for market data, watchlist... widely used in Trading screen
│   └── balance.epic.ts // user balance
│   └── order.epic.ts // order
│   └── position.epic.ts // margin trading
│   └── chart.epic.ts // if there's no Chart channel for realtime update, alternative Trade channel can be used
│   └── orderbook.epic.ts // depth and order book
│   └── trade.epic.ts // recent trades
│   └── index.ts
├── exports // contains functions/variables are exported to somewhere
│   ├── streams
│   │   └── hooks // React's hook as stream, which works with Observable's pipe
│   │   ├── browser-state.ts
│   │   └── index.ts
│   ├── configure-store.ts // config react-redux store
│   ├── defaultUISettings.ts
│   ├── history.ts // react-router's history
│   └── index.ts
├── fakers // where I place dummy data
├── HOCs // React Higher order Component
│   ├── withErrorBoundary.tsx // trace exception on view
│   ├── withLoadable.tsx // usually used in Routes
│   ├── withRouteGuard.ts // unauthorized users are unable to bypass the guard
│   └── index.ts
├── hooks
│   ├── usePrevious.ts // in order to keep previous value
│   ├── useQuery.ts
│   ├── useQueryString.ts // parses queryString ?param1=&param2= to local state
│   ├── useQueryStateObj.ts // ignored this, useQueryString extends this object
│   └── useRouteToTradeType.tsx
├── internals
│   ├── decorators
│   ├── Storage.ts
│   └── index.ts
├── models // object modeling
├── pages
│   ├── Exchange.page.tsx
│   ├── Home.page.tsx
│   └── Login.page.tsx
├── reducers // includes redux's reducer for entire project
├── resources // public resources (external css, images, TradingView lib/datafeed)
├── selectors // state selectors
├── ui-components  // contains common UIs in entire app
├── App.tsx // root App, app-routes are declared here
├── bootstrap.tsx // init market-data or loading resources before render Root ()
├── store-wrapper.ts // wrap rootReducer/rootEpic here
└── index.ts
```

## Missing features

There are some missing features, we will be making on soon:

- [ ] HTTP/WS Adapter (or whatever) that will be used to transform data which responsed by server to an expected format
- [ ] Implementing fully websocket-data-flow
- [ ] React-grid-layout
- [ ] Implementing a library for arbitrary-precision decimal and non-decimal arithmetic (bigNumber.js or Math.js)

## Remark

The overall flow of Gitflow is:

1. A develop branch is created from master
2. A release branch is created from develop
3. Feature branches are created from develop
4. When a feature is complete it is merged into the develop branch
5. When the release branch is done it is merged into develop and master
6. If an issue in master is detected a hotfix branch is created from master
7. Once the hotfix is complete it is merged to both develop and master

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
