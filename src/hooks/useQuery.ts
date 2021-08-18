import { useReducer, useEffect, useCallback, useMemo } from "react";

const initialQueryState = {
  loading: false,
  data: null,
  error: null,
};

function queryReducer(state, action) {
  switch (action.type) {
    case "START": {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case "SUCCESS": {
      return {
        ...state,
        data: action.data,
        loading: false,
        error: null,
      };
    }
    case "ERROR": {
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    }
    case "RESET": {
      return initialQueryState;
    }
    default: {
      throw new Error(`Invalid action type ${action.type}`);
    }
  }
}

const initialOptions = {};
const initialDeserialize = (res) => res.json();

function fire({ url, dispatch, deserialize, options }) {
  const abortController = new window.AbortController();
  dispatch({ type: "START" });

  const dataPromise = (async () => {
    try {
      const res = await fetch(url, {
        ...options,
        signal: abortController.signal,
      });

      const data = await deserialize(res);
      dispatch({ type: "SUCCESS", data });
      return data;
    } catch (error) {
      if (error.name !== "AbortError") {
        dispatch({ type: "ERROR", error });
      }
    }
  })();

  return {
    dataPromise,
    abort: () => {
      abortController.abort();
    },
  };
}

/**
 * @usage
 *  const [{ data, loading, error }, { refetch }] = useQuery({
		url: "",
		options
	});
 */
export function useQuery({
  url,
  options = initialOptions,
  deserialize = initialDeserialize,
}) {
  const [queryState, dispatch] = useReducer(queryReducer, initialQueryState);

  useEffect(() => {
    if (!url) {
      dispatch({ type: "RESET" });
      return;
    }

    const { abort } = fire({ url, dispatch, deserialize, options });
    return abort;
  }, [url, options, deserialize]);

  const reset = useCallback(() => dispatch({ type: "RESET" }), [dispatch]);

  const refetch = useCallback(() => {
    const { dataPromise } = fire({ url, dispatch, deserialize, options });

    return dataPromise;
  }, [url, options, deserialize]);

  const queryActions = useMemo(() => ({ refetch, reset }), [refetch, reset]);

  return [queryState, queryActions];
}

export default useQuery;
