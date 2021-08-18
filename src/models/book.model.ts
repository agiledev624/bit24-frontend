export interface OrderBookRaw {
  price: number;
  size: number;
}

export interface OrderBookModel extends OrderBookRaw {
  sumSize: number;
}

/**
 * @example
 * book data should be saved in following structure
 * {
 *  bids: {
 *  [price1]: amount1,
 *  [price2]: amount2
 * ....
 *  }
 * }
 */
export type BookItem = {
  [price: number]: number; // pirce:quantity
};

export type BookData = Partial<BookItem>;
