import { ObservableWorkerConstructor, runWorker } from "./run-worker";

export function registerRxWorker() {
  return <I, O>(workerConstructor: ObservableWorkerConstructor<I, O>): void => {
    runWorker(workerConstructor);
  };
}
