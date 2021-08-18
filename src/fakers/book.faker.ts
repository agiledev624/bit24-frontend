import _sortBy from 'lodash/sortBy';
import { OrderBookModel } from '@/models/book.model';

const fbids = [
  { price: 10867.0, size: 3542 },
  { price: 10867.5, size: 23542 },
  { price: 10868.0, size: 53542 },
  { price: 10868.5, size: 1153 },
  { price: 10869.0, size: 17590 },
  { price: 10869.5, size: 40036 },
  { price: 10870.0, size: 94611 },
  { price: 10870.5, size: 20528 },
  { price: 10871.0, size: 936853 },
];

const fasks = [
  { price: 10871.5, size: 980924 },
  { price: 10872.0, size: 1427 },
  { price: 10872.5, size: 17499 },
  { price: 10873.0, size: 512 },
  { price: 10873.5, size: 5000 },
  { price: 10874.0, size: 3264 },
  { price: 10874.5, size: 3003 },
  { price: 10875.0, size: 312 },
  { price: 10875.5, size: 3213 },
];

const maxBid = (fbids[fbids.length - 1] || {}).size || 0;
const maxAsk = (fasks[fasks.length - 1] || {}).size || 0;

const maxSumSize = Math.max(Number(maxBid), Number(maxAsk));

export { fbids, fasks, maxSumSize };