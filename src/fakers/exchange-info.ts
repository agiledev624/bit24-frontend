export const exchangeInfo = {
  "symbols": [{
    "symbol": "ETHBTC",
    "status": "TRADING",
    "baseAsset": "ETH",
    "baseAssetPrecision": 8,
    "quoteAsset": "BTC",
    "quotePrecision": 8,
    "quoteAssetPrecision": 8,
    "baseCommissionPrecision": 8,
    "quoteCommissionPrecision": 8,
    "orderTypes": ["LIMIT",
      "LIMIT_MAKER",
      "MARKET",
      "STOP_LOSS_LIMIT",
      "TAKE_PROFIT_LIMIT"],
    "icebergAllowed": true,
    "ocoAllowed": true,
    "quoteOrderQtyMarketAllowed": true,
    "isSpotTradingAllowed": true,
    "isMarginTradingAllowed": true,
    "filters": [{
      "filterType": "PRICE_FILTER",
      "minPrice": "0.00000100",
      "maxPrice": "100000.00000000",
      "tickSize": "0.00000100"
    }, {
      "filterType": "PERCENT_PRICE",
      "multiplierUp": "5",
      "multiplierDown": "0.2",
      "avgPriceMins": 5
    }, {
      "filterType": "LOT_SIZE",
      "minQty": "0.00100000",
      "maxQty": "100000.00000000",
      "stepSize": "0.00100000"
    }, {
      "filterType": "MIN_NOTIONAL",
      "minNotional": "0.00010000",
      "applyToMarket": true,
      "avgPriceMins": 5
    }, {
      "filterType": "ICEBERG_PARTS",
      "limit": 10
    }, {
      "filterType": "MARKET_LOT_SIZE",
      "minQty": "0.00000000",
      "maxQty": "5821.94919458",
      "stepSize": "0.00000000"
    }, {
      "filterType": "MAX_NUM_ALGO_ORDERS",
      "maxNumAlgoOrders": 5
    }, {
      "filterType": "MAX_NUM_ORDERS",
      "maxNumOrders": 200
    }],
    "permissions": ["SPOT",
      "MARGIN"]
  }, {
    "symbol": "LTCBTC",
    "status": "TRADING",
    "baseAsset": "LTC",
    "baseAssetPrecision": 8,
    "quoteAsset": "BTC",
    "quotePrecision": 8,
    "quoteAssetPrecision": 8,
    "baseCommissionPrecision": 8,
    "quoteCommissionPrecision": 8,
    "orderTypes": ["LIMIT",
      "LIMIT_MAKER",
      "MARKET",
      "STOP_LOSS_LIMIT",
      "TAKE_PROFIT_LIMIT"],
    "icebergAllowed": true,
    "ocoAllowed": true,
    "quoteOrderQtyMarketAllowed": true,
    "isSpotTradingAllowed": true,
    "isMarginTradingAllowed": true,
    "filters": [{
      "filterType": "PRICE_FILTER",
      "minPrice": "0.00000100",
      "maxPrice": "100000.00000000",
      "tickSize": "0.00000100"
    }, {
      "filterType": "PERCENT_PRICE",
      "multiplierUp": "5",
      "multiplierDown": "0.2",
      "avgPriceMins": 5
    }, {
      "filterType": "LOT_SIZE",
      "minQty": "0.01000000",
      "maxQty": "100000.00000000",
      "stepSize": "0.01000000"
    }, {
      "filterType": "MIN_NOTIONAL",
      "minNotional": "0.00010000",
      "applyToMarket": true,
      "avgPriceMins": 5
    }, {
      "filterType": "ICEBERG_PARTS",
      "limit": 10
    }, {
      "filterType": "MARKET_LOT_SIZE",
      "minQty": "0.00000000",
      "maxQty": "36996.75469771",
      "stepSize": "0.00000000"
    }, {
      "filterType": "MAX_NUM_ORDERS",
      "maxNumOrders": 200
    }, {
      "filterType": "MAX_NUM_ALGO_ORDERS",
      "maxNumAlgoOrders": 5
    }],
    "permissions": ["SPOT",
      "MARGIN"]
  }, {
    "symbol": "BNBBTC",
    "status": "TRADING",
    "baseAsset": "BNB",
    "baseAssetPrecision": 8,
    "quoteAsset": "BTC",
    "quotePrecision": 8,
    "quoteAssetPrecision": 8,
    "baseCommissionPrecision": 8,
    "quoteCommissionPrecision": 8,
    "orderTypes": ["LIMIT",
      "LIMIT_MAKER",
      "MARKET",
      "STOP_LOSS_LIMIT",
      "TAKE_PROFIT_LIMIT"],
    "icebergAllowed": true,
    "ocoAllowed": true,
    "quoteOrderQtyMarketAllowed": true,
    "isSpotTradingAllowed": true,
    "isMarginTradingAllowed": true,
    "filters": [{
      "filterType": "PRICE_FILTER",
      "minPrice": "0.00000010",
      "maxPrice": "100000.00000000",
      "tickSize": "0.00000010"
    }, {
      "filterType": "PERCENT_PRICE",
      "multiplierUp": "5",
      "multiplierDown": "0.2",
      "avgPriceMins": 5
    }, {
      "filterType": "LOT_SIZE",
      "minQty": "0.01000000",
      "maxQty": "100000.00000000",
      "stepSize": "0.01000000"
    }, {
      "filterType": "MIN_NOTIONAL",
      "minNotional": "0.00010000",
      "applyToMarket": true,
      "avgPriceMins": 5
    }, {
      "filterType": "ICEBERG_PARTS",
      "limit": 10
    }, {
      "filterType": "MARKET_LOT_SIZE",
      "minQty": "0.00000000",
      "maxQty": "60513.22854760",
      "stepSize": "0.00000000"
    }, {
      "filterType": "MAX_NUM_ORDERS",
      "maxNumOrders": 200
    }, {
      "filterType": "MAX_NUM_ALGO_ORDERS",
      "maxNumAlgoOrders": 5
    }],
    "permissions": ["SPOT",
      "MARGIN"]
  }]
}