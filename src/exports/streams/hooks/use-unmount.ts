/**
 * React's hook as a stream
 *
 * > Emits only when component calls unmount
 * > Used to dispose event stream in React-component life-cycle
 *
 * @usage
 * const Component = () => {
 *  const unmount$ = useUnmount$(); // <- will be emitted when Component in unmount
 *
 *  const request$ = fromFetch('ajax').pipe(takeUntil(unmount$)).subscribe() <- data will keep stream until unmount$ events
 * }
 */

import { useEffect, useMemo } from "react";
import { Observable, Subject } from "rxjs";

export const useUnmount$ = (): Observable<void> => {
  const unmount$ = useMemo(() => new Subject<void>(), []);

  useEffect(
    () => () => {
      unmount$.next(); // emits nothing
      unmount$.complete(); // stream completed
    },
    [unmount$]
  );

  return unmount$;
};
