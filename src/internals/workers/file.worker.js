import { runWorker } from "@/exports/streams/rx-worker";
import { bufferTime, filter, map } from "rxjs/operators";
import _isArray from 'lodash/isArray';
import { convertToBookData } from "@/transformers/book.transformer";
import { OrderBookSideEnum } from "@/constants/order-book-enums";

let lastSymbol = undefined;

class TestWorker {
  work(input$) {
    return input$.pipe(
      bufferTime(500),
      filter(batch => batch.length > 0),
      map((data) => {
        // console.log('message from main thread', data);

        let marketData = [];
        const tradesData = [];
        let bookData; 
        let charts = [];

        for (let i = data.length - 1; i >= 0; i--) {
          const payload = data[i];

          if (_isArray(payload) && !marketData.length) {
            marketData = payload.slice(0, 100);
          } else {
            if (payload["e"] === 'aggTrade') {
              tradesData.push(payload)
            } else if(payload["lastUpdateId"]) {
              const { asks, bids, lastUpdateId } = payload;
              bookData =  {
                asks: convertToBookData(asks), 
                bids: convertToBookData(bids),
                lastUpdateId
              }
            } else if(payload["e"] === 'kline') {
              // ChartSubject.next()
              charts.push(payload)
            }
          }
        }
        
        const ticker = marketData.reduce((ticker, rawData) => {
          const {s: symbol, h, l, c: lastPrice, p: priceChange, P: dailyChangePerc, v: volume} = rawData;
          ticker[symbol] = {
            symbol,
            high: h,
            low: l,
            lastPrice,
            volume,
            dailyChangePerc,
            priceChange
          };
      
          return ticker;
        }, {});

        return {
          marketData: ticker,
          tradesData: tradesData.map(trade => {
            const { m: isBuyer, l: id, T: tradeTime, p: price, q: amount } = trade;
        
            return {
              id,
              date: tradeTime,
              price: +price,
              amount: +amount,
              side: isBuyer ? OrderBookSideEnum.BID : OrderBookSideEnum.ASK
            }
          }),
          bookData,
          charts
        };
      })
    )
  }
}

runWorker(TestWorker);