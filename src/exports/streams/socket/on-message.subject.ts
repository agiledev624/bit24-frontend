import { Subject } from "rxjs";

// on-message source
export const wsOnMessageSrc$ = new Subject();

export const wsOnMessageObservable$ = wsOnMessageSrc$.asObservable();
