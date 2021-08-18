import _isFunction from 'lodash/isFunction';

const headers = {
  // 'Content-Type': 'application/json',
  // 'Access-Control-Allow-Origin': '*',
  // 'Accept': 'application/json'
};

const hooks = [
  'onRequest',
  'onRequestError',
  'onResponse',
  'onResponseError'
];

let interceptors = [];

function intercept(fetch, ...args) {
  const intercepts = [...interceptors];

  let promise = Promise.resolve(args);

  intercepts.forEach(({ onRequest, onRequestError }) => {
    if ((~hooks.indexOf('onRequest') && onRequest) || (~hooks.indexOf('onRequestError') && onRequestError)) {
      promise = promise.then(args => {
        const [url, options] = args;
        const opts = {
          headers,
          ...options
        }

        return _isFunction(onRequest) ? onRequest(url, opts) : [url, opts];
      }, (error) => {
        if (_isFunction(onRequestError)) {
          onRequestError(error)
        }

        return Promise.reject(error);
      })
    }
  });

  // register fetch call
  // args must be return inside onRequest
  promise = promise.then(args => {
    return fetch.apply(null, args)
  });

  // response intercepters
  intercepts.forEach(({ onResponse, onResponseError }) => {
    if ((~hooks.indexOf('onResponse') && onResponse) || (~hooks.indexOf('onResponseError') && onResponseError)) {
      promise = promise.then(res => {
        return _isFunction(onResponse) ? onResponse(res) : res;
      }, (error) => {
        _isFunction(onResponseError) && onResponseError(error);

        return Promise.reject(error);
      });
    }
  });

  return promise;
}

//@ts-ignore
window.fetch = (originalFetch => {
  return (...args) => intercept(originalFetch, ...args);
})(window.fetch);


export default {
  register(interceptor) {
    interceptors.push(interceptor);

    return () => {
      const index = interceptors.indexOf(interceptor);

      if (~index) {
        interceptors.splice(index, 1);
      }
    }
  },
  clear() {
    interceptors = [];
  }
}