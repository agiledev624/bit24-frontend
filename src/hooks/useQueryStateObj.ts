import { createMergedQuery, history, parseQueryState } from "@/exports";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";

const hasWindowLocation =
  typeof window !== "undefined" && "location" in window && "history" in window;

enum QueryActionEnum {
  REPLACE = "replace",
  PUSH = "push",
}

interface QueryOptionsAction {
  method: QueryActionEnum;
}

interface QueryStringInterface {
  getQueryString: () => string;
  setQueryString: (str: string, options: QueryOptionsAction) => void;
}

export interface QueryStateOptions {
  stripDefaults?: boolean;
  queryStringInterface?: QueryStringInterface;
}

/**
 *
 * @param {object} param0
 */
function useHashQueryStringInterface({
  disabled = false,
} = {}): QueryStringInterface {
  const enabled = !disabled && hasWindowLocation;
  const hasQSI = useMemo(
    () => ({
      getQueryString() {
        if (!enabled) {
          return "";
        }

        return window.location.hash;
      },
      setQueryString(newQueryString: string, { method = "replace" }) {
        if (!enabled) return;

        // use window history to update hash using replace / push
        window.history[method === "replace" ? "replaceState" : "pushState"](
          window.history.state,
          "",
          `${history.location.pathname}#${newQueryString}`
        );

        // manually dispatch a hashchange event (replace state does not trigger this event)
        // so all subscribers get notified (old way for IE11)
        const customEvent = document.createEvent("CustomEvent");
        customEvent.initEvent("hashChange", false, false);

        window.dispatchEvent(customEvent);

        setR((r) => r + 1); // used to trigger re-renders
      },
    }),
    [enabled]
  );

  const [, setR] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const hashChangeHandler = () => {
      setR((r) => r + 1);
    };

    window.addEventListener("hashChange", hashChangeHandler, {
      capture: false,
    });

    return () =>
      window.removeEventListener("hashchange", hashChangeHandler, {
        capture: false,
      });
  }, [enabled]);

  return hasQSI;
}

export function useReactRouterQueryStringInterface() {
  if (!history) {
    console.warn("useRouter - router was not found");
    return;
  }

  return {
    getQueryString: () => history.location.search,
    setQueryString: (newQueryString, { method = "replace" }) => {
      history[method](
        `${history.location.pathname}?${newQueryString}${history.location.hash}`
      );
    },
  };
}

/**
 *
 * @param {object} defaultQueryState
 * @param {object {
 *  stripDefaults?: boolean
 *  queryStringInterface?: {getQueryString, setQueryString}
 * }} queryStateOpts
 */
export function useQueryStateObj(
  defaultQueryState: Object,
  queryStateOpts: QueryStateOptions = {}
) {
  const { queryStringInterface } = queryStateOpts;

  const hashQSI = useHashQueryStringInterface(
    queryStringInterface && { disabled: true }
  );
  const activeQSI = queryStringInterface || hashQSI;

  const queryString = activeQSI.getQueryString();

  const [, setLatestMergedQueryString] = useState<string>(); // string

  const queryState = useMemo(
    () => ({
      ...defaultQueryState,
      ...parseQueryState(queryString),
    }),
    [defaultQueryState, queryString]
  );

  const ref = useRef({
    defaultQueryState,
    queryStateOpts,
    activeQSI,
  });

  // (newState, opts) => void
  const setQueryState = useCallback((newState, opts) => {
    const { defaultQueryState, queryStateOpts, activeQSI } = ref.current;

    const { stripDefaults = true } = queryStateOpts;
    const stripOverwrite = {};

    // when a params are set to the same value as in the defaults
    // we remove them to avoid having two URLs reproducing the same state unless stripDefaults = false
    if (stripDefaults) {
      Object.keys(newState).forEach((key) => {
        if (defaultQueryState[key] === newState[key]) {
          stripOverwrite[key] = null;
        }
      });
    }

    // retrieve the last value (by re-executing the search getter)
    const currentQueryState = {
      ...defaultQueryState,
      ...parseQueryState(activeQSI.getQueryString()),
    };

    const mergedQueryString = createMergedQuery(
      currentQueryState || {},
      newState,
      stripOverwrite
    );

    activeQSI.setQueryString(mergedQueryString, opts || {});

    // triggers an update (in case the QueryStringInterface misses to do so)
    setLatestMergedQueryString(mergedQueryString);
  }, []);

  useEffect(() => {
    ref.current = {
      defaultQueryState,
      queryStateOpts,
      activeQSI,
    };
  });

  return [queryState, setQueryState];
}
