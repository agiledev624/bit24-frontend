import { config } from '@/config';
import { AppTradeType } from '@/constants/trade-type';
import { defer, Observable, of } from 'rxjs';
import { catchError, delay, retryWhen, switchMap, take, timeout } from 'rxjs/operators';

interface MakeRequestOptions {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  retry: boolean;
  delay: number;
  attempts: number;
  params: {
    [x: string]: any // accept type of string | number but lib.d.ts defined accept string only, I dunno reason why
  };
  tradeType: AppTradeType
}

interface MakeRequestError {
  error: boolean;
  message: string;
}

const DEFAULT_DELAY_MS = 1000;
const RETRY_ATTEMPS = 3;

const defaultOption: Partial<MakeRequestOptions> = {
  method: 'GET',
  params: {},
  delay: DEFAULT_DELAY_MS,
  attempts: RETRY_ATTEMPS,
  tradeType: AppTradeType.SPOT
}

export function makeRequest<T>(endpoint: string, options?: Partial<MakeRequestOptions>): Observable<T | MakeRequestError | any> {
  options = {...defaultOption, ...options};
  
  const url = new URL(`${options.tradeType === AppTradeType.SPOT ? config.http : config.fhttp}/${endpoint}`);
  const params = new URLSearchParams(options.params);
  url.search = params.toString();

  let fetch$ = defer(() => fetch(url.toString(), {
    method: options.method
  }));
  const {retry} = options || {};

  if(retry) {
    const {delay: delayInMs, attempts} = options;
    const totalTimeout = delayInMs * attempts;

    fetch$ = fetch$.pipe(
      retryWhen(errors => errors.pipe(
        delay(delayInMs),
        take(attempts),
      )),
      timeout(totalTimeout)
    );
  }

  return fetch$.pipe(
    switchMap(response => {
      if (response.ok) {
        // OK return data
        return response.json();
      } else {
        // Server is returning a status requiring the client to try something else.
        return of({ error: true, message: `Error ${response.status}` });
      }
    }),
    catchError(err => {
      // Network or other error, handle appropriately
      console.error(err);
      return of({ error: true, message: err.message })
    })
  );
}