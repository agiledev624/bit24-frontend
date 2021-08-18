import { rootEpic } from "./epics";
import { configureStore } from "./exports";
import { rootReducer } from "./reducers";

export const store = configureStore(rootReducer, rootEpic);
