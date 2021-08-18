import { riskWsUrl, testurl1 } from "@/config/config";
import { WebSocketChannelEnum, WebSocketKindEnum, WebSocketKindStateEnum } from "@/constants/websocket.enums";
import { shallowCompareObjects } from "@/exports";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

interface WSInfo {
  url: string;
  id: number;
  type: WebSocketKindEnum
};


/**
 * if the primary server is down after 3 retry times -> switch to the secondary server
 */
class WebsocketMananger {
  private wsInstances = {};
  private pendingUrls: {[x in WebSocketKindEnum]?: string[]} = {};
  private usingSockets: {[x in WebSocketKindEnum]?: string} = {};
  socketId: number = WebSocketKindEnum.ADMIN_RISK;

  wsEntriesSubject = new Subject();
  
  constructor(adminRiskUrl: string) {
    this.usingSockets[WebSocketKindEnum.ADMIN_RISK] = adminRiskUrl;
    
    this.usingSockets[WebSocketKindEnum.MARKET] = testurl1;
  }

  hasInstance(id: number): boolean {
    return this.wsInstances.hasOwnProperty(id);
  }

  registerInstance(id: number, url: string) {
    if(this.usingSockets[id] === url)
      this.wsInstances[id] = true;
  }

  removeInstance(id: number) {
    delete this.wsInstances[id];
  }

  getEntries$(): Observable<any> {
    return this.wsEntriesSubject.asObservable().pipe(
      distinctUntilChanged((prev, current) => shallowCompareObjects(prev, current))
    );
  }

  addWs(url: string, type: WebSocketKindEnum) {
    if(!this.pendingUrls.hasOwnProperty(type))
      this.pendingUrls[type] = [];

    if(!this.pendingUrls[type].includes(url)) { 
      this.pendingUrls[type].push(url);
    }
  }

  getUrlEntries(): string[] {
    const urls = [];
    for(let type in this.pendingUrls) {
      const url = this.pendingUrls[type].shift();
      this.usingSockets[type] = url;
      url && urls.push(url);
    }

    console.warn('url entries',  urls);

    console.log('remaining pendings', {...this.pendingUrls});
    return urls;
  }

  // accept current entries and emit new value
  acceptEntries() {
    const ids = [];
    for(let type in this.usingSockets) {
      if(+type === WebSocketKindEnum.ADMIN_RISK)
        continue;
        
      ids.push(+type)
    }

    this.wsEntriesSubject.next(ids);
  }

  clear() {}

  isRiskAdminWsById(id: number): boolean {
    return id === WebSocketKindEnum.ADMIN_RISK;
  }

  isMarketWsById(id: number): boolean {
    return id === WebSocketKindEnum.MARKET;
  }

  isOrderWsById(id: number): boolean {
    return id === WebSocketKindEnum.ORDERS;
  }

  isMarketWsByUrl(url: string): boolean {
    const id = this._getRunningSocketTypeByUrl(url);

    return this.isMarketWsById(id);
  }

  isOrderWsByUrl(url: string): boolean {
    const id = this._getRunningSocketTypeByUrl(url);

    return this.isOrderWsById(id);
  }

  private _getRunningSocketTypeByUrl(url: string): number {
    for(let type in this.usingSockets) {
      if(this.usingSockets[type] === url) 
        return +type;
    }

    return 0;
  }

  getUrlFromId(id: number): string | null {
    if(!this.usingSockets[id])
      return null;

    return this.usingSockets[id];
  }

  getIdFromUrl(url: string): number | null {
    const id = this._getRunningSocketTypeByUrl(url);

    if(!id)
      return null;

    return id;
  }

  getSocketInChargeOfByChannel(channel: WebSocketChannelEnum): WebSocketKindEnum | null {
    switch (channel) {
      case WebSocketChannelEnum.MARKET:
      case WebSocketChannelEnum.TRADES: 
      case WebSocketChannelEnum.ORDERBOOK:
      case WebSocketChannelEnum.CHART: {
        return WebSocketKindEnum.MARKET;
      }
      // tested
      // used to test 2nd websocket
      // case WebSocketChannelEnum.ORDERBOOK:
      // case WebSocketChannelEnum.CHART: {
        // return WebSocketKindEnum.ORDERS;
      // }
      default: {
        return null;
      }
    }
  }

}

export const SingletonWSManager = new WebsocketMananger(riskWsUrl);