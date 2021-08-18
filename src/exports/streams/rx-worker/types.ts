import { Notification, Observable } from "rxjs";

export interface GenericWorkerMessage<P = any> {
  payload: P;
  transferable?: Transferable[];
}

export interface WorkerMessageNotification<T> extends MessageEvent {
  data: Notification<T>;
}

export interface DoWork<I, O> {
  work(input$: Observable<I>): Observable<O>;
  selectTransferables?(output: O): Transferable[];
}

// same as DoWork, but selectTransferables is required
export interface DoTransferableWork<I, O> extends DoWork<I, O> {
  selectTransferables(output: O): Transferable[];
}

export interface DoWorkUnit<I, O> {
  workUnit(input: I): Observable<O>;
  selectTransferables?(output: O): Transferable[];
}

// same as DoWorkUnit, but selectTransferables is required
export interface DoTransferableWorkUnit<I, O> extends DoWorkUnit<I, O> {
  selectTransferables(output: O): Transferable[];
}

export type WorkerFactory = () => Worker;
