import uuidv1 from "uuid/v1";

import WatchableStore from "./watchable-store";

export type ToastItem = {
  id: string;
  status?: any;
  message: string;
  header?: string;
  timer: number;
  classNames?: string;
  runAnim: boolean;
};

const DEFAULT_ACTIONS = ["success", "info", "warning", "error"];

const ToastStore = () => {
  const store = WatchableStore({
    action: "",
    message: "",
    runAnim: true,
  });

  DEFAULT_ACTIONS.forEach((status) => {
    /**
     *
     * @param {string} message
     * @param {?number} timer timer (in second)
     * @param {?string} classNames
     */
    store[status] = function (message, header, timer, classNames) {
      if (timer) timer = timer * 1000; // convert to ms

      store.data = {
        id: uuidv1(),
        status,
        header,
        message,
        timer,
        classNames,
        runAnim: true,
      };
    };
  });

  return store;
};

const store = ToastStore();
export default store;
