const EMPTY_ARRAY_STRING = '[\u00A0]';

/**
 * @example
 * "?param=1&param=2" |> stripQuestionMark // should returns "param=1&param=2"
*/
export function stripLeadingHashOrQuestionMark(s: string = ''): string {
  if (s && (s.indexOf('?') === 0 || s.indexOf('#') === 0)) {
    return s.slice(1);
  }
  return s;
}

/**
 * 
 * @param {string} queryString initial query string (for example ?param=1&param=2)
 */
export function parseQueryState(queryString: string): Object | null {
  const queryState = {};
  const params = new URLSearchParams(stripLeadingHashOrQuestionMark(queryString));

  params.forEach((value, key) => {
    if (key in queryState.constructor.prototype) {
      return console.warn(`parseQueryState | invalid key "${key}" will be ignored`);
    }

    if (key in queryState) {
      const queryStateForKey = queryState[key];

      if (Array.isArray(queryStateForKey)) {
        queryStateForKey.push(value);
      } else {
        queryState[key] = [queryStateForKey, value];
      }
    } else {
      queryState[key] = value;
    }
  })

  return Object.keys(queryState).length ? queryState : null;
}

export function createMergedQuery(...queryStates): string {
  const mergedQueryStates = Object.assign({}, ...queryStates)
  const params = new URLSearchParams();

  Object.entries(mergedQueryStates).forEach(([key, value]) => {
    // entries with null or undefined values are removed from the query string
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length) {
        value.forEach(v => {
          params.append(key, v || '');
        })
      } else {
        params.append(key, EMPTY_ARRAY_STRING);
      }
    } else {
      params.append(key, value as any);
    }
  });

  params.sort();
  return params.toString();
}

export function toQueryStateValue(value: string | string[] | number | boolean | Date): string | string[] | null {
  if (Array.isArray(value)) {
    return value.map(v => v.toString());
  } else if (value || value === '' || value === false || value === 0) {
    if (value instanceof Date) {
      return value.toJSON();
    }

    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        return value.toString();
      default:
        break
    }
  }
  return null;
}

export function parseQueryStateValue(value: string | string[], defaultValue: string | string[] | number | boolean | Date): string | string[] | number | boolean | Date | null {
  const defaultValueType = typeof defaultValue

  if (Array.isArray(defaultValue)) {
    // special case of empty array saved in query string to keep it distinguishable from ['']
    if (value === EMPTY_ARRAY_STRING) {
      return [];
    }
    return [...value];
  }

  if (typeof value !== 'string' && !Array.isArray(value)) {
    return null;
  }

  if (defaultValue instanceof Date) {
    const valueAsDate = new Date(value.toString());

    if (!isNaN(valueAsDate.valueOf())) {
      return valueAsDate;
    }
  }

  switch (defaultValueType) {
    case 'string':
      return value.toString()
    case 'number':
      const num = Number(value);
      return num || num === 0 ? num : null;
    case 'boolean':
      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      }
      break;
    default:
  }
  return null;
}