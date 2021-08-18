import _merge from 'lodash/merge';
import _isObject from 'lodash/isObject';
import _isNull from 'lodash/isNull';
import _isString from 'lodash/isString';
import { invariant } from '@/exports/invariant';

interface Options {
  isSession?: boolean;
  expiration?: number | string;
};

const Storage = (function () {
  const expiredTime = "_expiredTime";

  /**
   * 
   * @param {Options} options 
   */
  function getStorageByOption(options: Options) {
    const { isSession } = options;

    return getStorage(isSession);
  }

  function getStorage(isSession: boolean | undefined) {
    return isSession ? window.sessionStorage : window.localStorage;
  }

  return {
    size({ isSession = false }) {
      return getStorage(isSession).length;
    },

    get(key: string, options: Options = {}): any {
      const item = getStorageByOption(options).getItem(key);
      if (!item) return item; // null

      let value;
      try {
        value = JSON.parse(item);
      } catch (e) {
        value = JSON.parse(JSON.stringify(item))
      }

      if (_isObject(value) && value.hasOwnProperty(expiredTime)) {
        if (new Date().getTime() > value[expiredTime]) {
          this.delete(key, options);

          return undefined;
        }
      }
      return value;
    },

    save(key: string, value: any, options: Options = {}) {
      invariant(
        !!key || value !== "" || value !== undefined,
        `The "key" must have a value, given "key": ${key} or "value":${value}`
      );
      //@ts-ignore
      const { expiration } = options;

      if (expiration) {
        value = _merge({}, _isObject(value) ? value : { value }, {
          [expiredTime]: new Date(expiration).getTime()
        });
      }

      getStorageByOption(options).setItem(key, JSON.stringify(value));
    },

    /**
     * Updates the value in the store for a given key in localStorage. 
     * If the value is a string it will be replaced. 
     * If the value is a null it will be replaced. 
     * If the value is an object it will be deep merged.
     * 
     * @param {String} key The key
     * @param {String | Object} value The value to update with
     * @param {Options} options 
     * @return {Any} value The value to save
     */
    update(key: string, value: string | Object, options: Options = {}): any {
      invariant(
        !!key || value !== "" || value !== undefined,
        `The "key" must have a value, given "key": ${key} or "value":${value}`
      );
      let item = this.get(key);
      value = _isString(value) || _isNull(value) ? value : _merge({}, item, value);
      this.save(key, value, options);

      return value;
    },

    /**
     * Delete the value for a given key in localStorage.
     * @param  {string} key
     * @param {Options} options
     * @return {any}
     */
    delete(key: string, options: Options = {}) {
      getStorageByOption(options).removeItem(key);
    },

    clear() {
      window.localStorage.clear();
    },

    key(key: number): string | null {
      return window.localStorage.key(key);
    }
  }
})();

export default Storage;