/**
 * pool worker
 */

import { Observable, ObservableInput, of, Subject, zip } from "rxjs";
import { finalize, map, mergeAll, tap } from "rxjs/operators";
import { fromWorker } from "./from-worker";
import { WorkerFactory } from "./types";

interface LazyWorker {
  factory: WorkerFactory;
  terminate: () => void;
  processing: boolean;
  index: number;
}

export interface WorkerPoolOptions<I, O> {
  workerCount?: number;
  fallbackWorkerCount?: number;
  flattenOperator?: (input$: Observable<Observable<O>>) => Observable<O>;
  selectTransferables?: (input: I) => Transferable[];
}

const defaultOptions = {
  workerCount: navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency - 1
    : null,
  fallbackWorkerCount: 3,
};

export function fromWorkerPool<I, O>(
  workerConstructor: (index: number) => Worker,
  workUnitIterator: ObservableInput<I>,
  options?: WorkerPoolOptions<I, O>
): Observable<O> {
  const {
    selectTransferables = undefined,
    workerCount,
    fallbackWorkerCount,
    flattenOperator = mergeAll<O>(),
  } = { ...defaultOptions, ...options };

  return new Observable<O>((resultObserver) => {
    const idleWorker$$: Subject<LazyWorker> = new Subject<LazyWorker>();

    let completed = 0,
      sent = 0,
      finished = false;

    const lazyWorkers: LazyWorker[] = Array.from({
      length: workerCount !== null ? workerCount : fallbackWorkerCount,
    }).map((_, index) => {
      let cachedWorker: Worker | null = null;

      return {
        processing: false,
        index,
        factory() {
          if (!cachedWorker) {
            cachedWorker = workerConstructor(index);
          }

          return cachedWorker;
        },
        terminate() {
          if (!this.processing && cachedWorker) {
            cachedWorker.terminate();
          }
        },
      };
    });

    const processor$ = zip(idleWorker$$, workUnitIterator).pipe(
      tap(([worker]) => {
        sent++;
        worker.processing = true;
      }),
      finalize(() => {
        idleWorker$$.complete();
        finished = true;
        lazyWorkers.forEach((worker) => worker.terminate());
      }),
      map(([worker, unitWork]): Observable<O> => {
        return fromWorker<I, O>(
          () => worker.factory(),
          of(unitWork),
          selectTransferables,
          {
            terminateOnComplete: false,
          }
        ).pipe(
          finalize(() => {
            completed++;

            worker.processing = false;

            if (!finished) {
              idleWorker$$.next(worker);
            } else {
              worker.terminate();
            }

            if (finished && completed === sent) {
              resultObserver.complete();
            }
          })
        );
      }),
      flattenOperator
    );

    const sub = processor$.subscribe(resultObserver);

    lazyWorkers.forEach((worker) => idleWorker$$.next(worker));

    return () => sub.unsubscribe();
  });
}
