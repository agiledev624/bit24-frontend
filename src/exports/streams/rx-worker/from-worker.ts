import { Notification, Observable, Observer, Subscription } from "rxjs";
import { dematerialize, map, materialize, tap } from "rxjs/operators";
import { WorkerFactory, WorkerMessageNotification } from "./types";

export interface WorkerOptions {
  terminateOnComplete: boolean;
}

export function fromWorker<I, O>(
  workerFactory: WorkerFactory,
  input$: Observable<I>,
  selectTransferables?: (input: I) => Transferable[],
  options: WorkerOptions = { terminateOnComplete: true }
): Observable<O> {
  return new Observable((resObserver: Observer<Notification<O>>) => {
    let worker: Worker;
    let subscription: Subscription;

    try {
      worker = workerFactory();
      worker.onmessage = (ev: WorkerMessageNotification<O>) =>
        resObserver.next(ev.data);
      worker.onerror = (ev: ErrorEvent) => resObserver.error(ev);

      subscription = input$
        .pipe(
          materialize(),
          tap((input) => {
            if (selectTransferables && input.hasValue) {
              const transferable = selectTransferables(input.value);
              console.log(">transferable", transferable);
              worker.postMessage(input, transferable);
            } else {
              worker.postMessage(input);
            }
          })
        )
        .subscribe();
    } catch (error) {
      resObserver.error(error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }

      if (worker && options.terminateOnComplete) {
        worker.terminate();
      }
    };
  }).pipe(
    map(({ kind, value, error }) => new Notification(kind, value, error)),
    dematerialize()
  );
}
