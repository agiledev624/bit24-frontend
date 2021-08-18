/**
 * In Main Thread
 * `
 * const input$ = of('Hello from main thread');
 * fromWorker<string, string>(() => new Worker('./hello.worker', { type: 'module' }), input$).subscribe(message => {
 *  console.log(message); // Outputs 'Hello from webworker'
 * });
 * `
 *
 * In Worker Thread
 * `
 * import { DoWork, ObservableWorker } from 'observable-webworker';
 * import { Observable } from 'rxjs';
 * import { map } from 'rxjs/operators';
 * @ObservableWorker()
 * export class HelloWorker implements DoWork<string, string> {
 *  public work(input$: Observable<string>): Observable<string> {
 *    return input$.pipe(
 *      map(message => {
 *        console.log(message); // outputs 'Hello from main thread'
 *        return `Hello from webworker`;
 *       }),
 *    );
 *   }
 * }
 * `
 */
export {
  getWorkerResult,
  workerIsTransferableType,
  runWorker,
  workerIsUnitType,
} from "./run-worker";
export { fromWorker } from "./from-worker";
export { fromWorkerPool } from "./from-pool";
export { registerRxWorker } from "./register-rx-worker";
