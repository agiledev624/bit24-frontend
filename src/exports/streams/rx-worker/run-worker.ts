import { fromEvent, Notification, Observable, Subscription } from "rxjs";
import { mergeMap, dematerialize, filter, map, materialize } from "rxjs/operators";
import { DoTransferableWork, DoWork, DoWorkUnit, WorkerMessageNotification } from "./types";

type DoableWorker<I, O> = DoWork<I, O> | DoWorkUnit<I, O>;

export type ObservableWorkerConstructor<I = any, O = any> = new (...args) => DoableWorker<I, O>;

export type WorkerPostMessageNotification<T> = (message: Notification<T>, transferable?: Transferable[]) => void;

export function workerIsTransferableType<I, O>(
  worker: DoableWorker<I, O>,
): worker is DoTransferableWork<I, O> {
  return !!worker.selectTransferables;
}

export function workerIsUnitType<I, O>(
  worker: DoableWorker<I, O>,
): worker is DoWorkUnit<I, O> {
  return !!(worker as DoWorkUnit<I, O>).workUnit;
}

export function getWorkerResult<I, O>(
  worker: DoableWorker<I, O>,
  incomingMessages$: Observable<WorkerMessageNotification<I>>
): Observable<Notification<O>> {
  const input$ = incomingMessages$.pipe(
    map((e: WorkerMessageNotification<I>): Notification<I> => e.data),
    map((n: Notification<I>) => new Notification(n.kind, n.value, n.error)),
    // ignore complete, the calling thread will manage termination of the stream
    filter(n => n.kind !== 'C'),
    dematerialize()
  );

  return workerIsUnitType(worker)
    ? input$.pipe(mergeMap(input => worker.workUnit(input).pipe(materialize())))
    : worker.work(input$).pipe(materialize());
}

export function runWorker<I, O>(workerConstructor: ObservableWorkerConstructor<I, O>): Subscription {
  const worker = new workerConstructor();

  // eslint-disable-next-line no-restricted-globals
  const incomingMessages$ = fromEvent<WorkerMessageNotification<I>>(self, 'message');

  const transferableWorker = workerIsTransferableType(worker);

  return getWorkerResult(worker, incomingMessages$).subscribe((notification: Notification<O>) => {
    // type to workaround ts trying to compile as non-webworker context
    const workerPostMessage = (postMessage as unknown) as WorkerPostMessageNotification<O>;

    if(transferableWorker && notification.hasValue) {
      workerPostMessage(notification, worker.selectTransferables(notification.value));
    } else {
      workerPostMessage(notification);
    }
  });
}