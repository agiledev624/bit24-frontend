import { BookData, OrderBookModel, OrderBookRaw } from "@/models/book.model";
import _sortBy from "lodash/sortBy";

export function toRawBook(array: [string, string]): OrderBookRaw {
  return {
    price: +array[0],
    size: +array[1],
  };
}

type binanceBookData = [string, string]; // [price, size]

export function convertToBookData(array: binanceBookData[]): BookData {
  return array.reduce(
    (o, c) => ({
      ...o,
      [+c[0]]: +c[1],
    }),
    {}
  );
}

export function bookDataToArray(
  bookData: BookData,
  isBid: boolean = true
): OrderBookModel[] {
  let sumSize = 0;
  let array = [];

  const desc = (o: OrderBookRaw) => -o.price;
  const asc = (o: OrderBookRaw) => o.price;

  for (let price in bookData) {
    array.push({ price: +price, size: +bookData[price] } as OrderBookRaw);
  }

  if (isBid) {
    array = _sortBy(array, desc);
  } else {
    array = _sortBy(array, asc);
  }

  const data = array.map(({ price, size }) => {
    sumSize = sumSize + size;

    return {
      price: price,
      size: size,
      sumSize: sumSize,
    };
  });

  return data;
}
