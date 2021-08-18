/**
 * use url query string as state
 */
import { useState, useMemo, useCallback } from "react";
import {
  QueryStateOptions,
  useQueryStateObj,
  useReactRouterQueryStringInterface,
} from "./useQueryStateObj";
import {
  parseQueryStateValue,
  shallowCompareObjects,
  toQueryStateValue,
} from "@/exports";

/**
 *
 * @param {any} a compared value A
 * @param {any} b compared value B
 * @returns {boolean}
 */
function isSameJsonString(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * query string from window.location.hash
 * @example
 * /#param1=&param2=
 *
 * @param {string} name
 * @param {any} defaultValue
 * @param {object} queryStateOpts {
 *  stripDefaults?: boolean
 *  queryStringInterface?: {getQueryString, setQueryString}
 * }
 */
export function useQueryString(
  name: string,
  defaultValue: any,
  queryStateOpts?: QueryStateOptions
): [any, Function] {
  // default value is not allowed to be changed after init
  [defaultValue] = useState(defaultValue);

  const defaultQueryStateValue = defaultValue;
  const defaultQueryState = useMemo(() => {
    return defaultQueryStateValue
      ? {
          [name]: defaultQueryStateValue,
        }
      : {};
  }, [name, defaultQueryStateValue]);

  if (defaultQueryStateValue === null) {
    throw new Error("unsupported defaultValue");
  }

  const [queryState, setQueryState] = useQueryStateObj(
    defaultQueryState,
    queryStateOpts
  );

  const setQueryStateItem = useCallback(
    (newValue, opts) => {
      // stringify the given value (or array of strings)
      let newQueryStateValue = toQueryStateValue(newValue);

      // warn when value type is not supported (do not warn when null was passed explicitly)
      if (
        (newQueryStateValue === null && newValue !== newQueryStateValue) ||
        !(
          newQueryStateValue !== null &&
          typeof parseQueryStateValue(newQueryStateValue, defaultValue) ===
            typeof defaultValue
        )
      ) {
        console.warn(
          `value of ${JSON.stringify(
            newValue
          )} is not supported ${name} will reset to default value`,
          defaultValue
        );

        newQueryStateValue = null;
      }

      // when new value is equal to default, we call setQueryState with a null value to reset query string
      // arrays have to be compared json stringified, other values can compared by value
      if (
        (Array.isArray(defaultValue) &&
          isSameJsonString(newValue, defaultValue)) ||
        newValue === defaultValue
      ) {
        newQueryStateValue = null;
      }

      //@ts-ignore
      setQueryState({ [name]: newQueryStateValue }, opts);
    },
    [defaultValue, name, setQueryState]
  );

  // fallback to default value
  let value = defaultValue;
  const queryStateItem = queryState[name];
  let queryStateValue;

  if (queryStateItem || queryStateItem === "") {
    queryStateValue = parseQueryStateValue(queryStateItem, defaultValue);
  }

  if (
    queryStateValue !== undefined ||
    typeof queryStateValue === typeof defaultValue
  ) {
    value = queryStateValue;
  }

  return [value, setQueryStateItem];
}

export function useQueryStrings(
  defaultQueryState,
  queryStateOpts?: QueryStateOptions
): [any, Function] {
  // default value is not allowed to be changed after init

  if (!defaultQueryState) {
    throw new Error("unsupported defaultQueryState");
  }

  const [queryState, setQueryState] = useQueryStateObj(
    defaultQueryState,
    queryStateOpts
  );

  // (obj, obj) => void
  const setQueryStateItem = useCallback(
    (newValues, opts) => {
      if (typeof newValues !== "object") {
        throw new Error("newValue must be an object");
      }

      let newStates = { ...queryState };
      Object.entries(newValues).forEach(([name, newValue]) => {
        const defaultValue = defaultQueryState[name];
        // stringify the given value (or array of strings)
        let newQueryStateValue = toQueryStateValue(newValue as any);

        // warn when value type is not supported (do not warn when null was passed explicitly)
        if (
          (newQueryStateValue === null && newValue !== newQueryStateValue) ||
          !(
            newQueryStateValue !== null &&
            typeof parseQueryStateValue(newQueryStateValue, defaultValue) ===
              typeof defaultValue
          )
        ) {
          console.warn(
            `value of ${JSON.stringify(
              newValue
            )} is not supported ${name} will reset to default value`,
            defaultValue
          );

          newQueryStateValue = null;
        }

        // when new value is equal to default, we call setQueryState with a null value to reset query string
        // arrays have to be compared json stringified, other values can compared by value
        if (
          (Array.isArray(defaultValue) &&
            isSameJsonString(newValue, defaultValue)) ||
          newValue === defaultValue
        ) {
          newQueryStateValue = null;
        }

        newStates[name] = defaultValue;
        let qValue;

        if (newQueryStateValue || newQueryStateValue === "") {
          qValue = parseQueryStateValue(newQueryStateValue, defaultValue);
        }

        if (qValue !== undefined || typeof qValue === typeof defaultValue) {
          newStates[name] = qValue;
        }
      });

      // console.warn('newStates >>>', newStates, 'queryState', queryState);
      if (!shallowCompareObjects(newStates, queryState)) {
        //@ts-ignore
        setQueryState(newStates, opts);
      } else {
        console.warn("there is no difference", newStates, queryState);
      }
    },
    [defaultQueryState, queryState, setQueryState]
  );

  // fallback to default value
  let value = { ...queryState };

  Object.entries(value).forEach(([key, v]) => {
    const parsed = parseQueryStateValue(v as any, defaultQueryState[key]);
    if (parsed !== null || typeof parsed === typeof defaultQueryState[key]) {
      value[key] = parseQueryStateValue(v as any, defaultQueryState[key]);
    }
  });
  // console.warn('value', value, 'queryState', queryState);

  return [value, setQueryStateItem];
}

/**
 * query string from window.location.search (use question mark instead of hash)
 * @example
 * /?param1=&param2=
 */
export function useQMQueryString(name, defaultValue, opts?: QueryStateOptions) {
  return useQueryString(name, defaultValue, {
    queryStringInterface: useReactRouterQueryStringInterface(),
    ...opts,
  });
}
