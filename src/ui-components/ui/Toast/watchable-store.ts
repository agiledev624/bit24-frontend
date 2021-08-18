/**
 * Simple data model with observable pattern, used to avoid using redux-store
 *
 * @param {*} initialData data attribute contains the state of the store
 * @param {*} [options={
 *  disableDeepFreeze: boolean
 * }]
 *
 * @note
 * You can subscribe to data to be notified when data changes
 * @example
 *
 * const subscriber = store.watch(cb);
 * store.unwatch(subscriber); // unwatch when we're done with it.
 */
function WatchableStore(
  initialData: any,
  options = {
    disableDeepFreeze: false,
  }
) {
  const handlers = [];

  let nextHandlerId = 0;

  return {
    get data() {
      return initialData;
    },
    set data(t) {
      initialData = options.disableDeepFreeze ? t : Object.freeze(t);

      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];

        handler.handler(initialData);
      }
    },
    watch(cb) {
      let id = nextHandlerId++;
      handlers.push({
        id,
        handler: cb,
      });

      return id;
    },
    unwatch(id) {
      var i = handlers.length;
      while (i--) {
        if (handlers[i].id === id) {
          handlers.splice(i, 1);
        }
      }
    },
  };
}

export default WatchableStore;
