export { default as history } from "./history";
export { configureStore } from "./configure-store";

export { registerBrowserState, AppBrowserState } from "./streams";

export { invariant } from "./invariant";
export { sleep } from "./sleep";
export {
  stripLeadingHashOrQuestionMark,
  parseQueryState,
  createMergedQuery,
  toQueryStateValue,
  parseQueryStateValue,
} from "./query-string";

export {
  DEFAULT_USER_SETTINGS_MAP,
  getDefaultUserSetting,
} from "./defaultUISettings";
export { formatNumber } from "./format-number";
export { getPosition } from "./get-elm-position";
export { makeRequest } from "./make-request";
export { strTemplate } from "./string-template";
export { updateThemeVariables } from "./theme.style.utils";

export function greenText(): string {
  return "text--mountain-meadow";
}

export function redText(): string {
  return "text--burnt-sienna";
}

export function insertsAt(n: number, ins: any[], arr: any[]) {
  return [...arr.slice(0, n), ...ins, ...arr.slice(n)];
}

export function insertAt(n: number, entry: any, arr: any[]) {
  return [...arr.slice(0, n), entry, ...arr.slice(n)];
}

export const EMPTY_ARRAY = [];
export const EMPTY_OBJ = {};

/* eslint-disable no-self-compare */
export function shallowCompareArrays(arr1: any[], arr2: any[]): boolean {
  if (arr1 === arr2) {
    return true;
  }

  const len = arr1.length;

  if (arr2.length !== len) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function shallowCompareObjects(obj1: Object, obj2: Object): boolean {
  if (!obj1 || !obj2) {
    return false;
  }

  if (obj1 === obj2) {
    return true;
  }

  var aKeys = Object.keys(obj1);
  var bKeys = Object.keys(obj2);
  var len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    var key = aKeys[i];

    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  }
  // Step 6.a: NaN == NaN
  return x !== x && y !== y;
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function titleCase(string: string): string {
  return string
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/./, (x) => x.toUpperCase())
    .replace(/[^']\b\w/g, (y) => y.toUpperCase());
}

export function getTheme() {
  const elms = document.getElementsByTagName("body");
  const body = elms && elms.length ? elms[0] : null;
  return body ? body.className : "";
}

export function generateAlertId(alertPair, alertPriceStr) {
  return `alert:${alertPair}:${alertPriceStr}`;
}

/**
 * Clamp position between a range
 * @param  {number} - Value to be clamped
 * @param  {number} - Minimum value in range
 * @param  {number} - Maximum value in range
 * @return {number} - Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
