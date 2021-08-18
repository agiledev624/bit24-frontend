// order = Transaction
import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { TransactionModel } from "@/models/order.model";
import { PacketManner } from "./packet-manner";

const TRANSACTION_MESSAGE_STRUCTURE = [
  new DataByte('orderMessageType', TypedData.SHORT), // 4
  new DataByte('padding', TypedData.SHORT), // 6
  new DataByte('accountId', TypedData.INT), // 8
  new DataByte('clientOrderId', TypedData.LONG), // 12
  new DataByte('symbolEnum', TypedData.SHORT), // 20
  new DataByte('orderType', TypedData.SHORT), // 22
  new DataByte('symbolType', TypedData.SHORT), // 24
  new DataByte('price', TypedData.DOUBLE), // 26
  new DataByte('side', TypedData.SHORT), // 34
  new DataByte('qty', TypedData.DOUBLE), // 36
  new DataByte('tif', TypedData.SHORT), // 44
  new DataByte('stopPrice', TypedData.DOUBLE), // 46
  new DataByte('symbol', TypedData.CHAR, 12), // 54
  new DataByte('orderId', TypedData.LONG), // 66
  new DataByte('cancelShares', TypedData.DOUBLE), // 74
  new DataByte('execId', TypedData.LONG), // 82
  new DataByte('execShares', TypedData.DOUBLE), // 90
  new DataByte('remainQty', TypedData.DOUBLE), // 98
  new DataByte('execFee', TypedData.DOUBLE), // 106
  new DataByte('expiredDate', TypedData.CHAR, 12), // 114
  new DataByte('tradeId', TypedData.CHAR, 6), // 126
  new DataByte('rejectReason', TypedData.SHORT), // 132
  new DataByte('sendingTime', TypedData.LONG), // 134
  new DataByte('sessionId', TypedData.INT), // 142
  new DataByte('key', TypedData.INT), // 146
  new DataByte('displaySize', TypedData.DOUBLE), // 150
  new DataByte('refreshSize', TypedData.DOUBLE), // 158
  new DataByte('layers', TypedData.SHORT), // 166
  new DataByte('sizeIncrement', TypedData.DOUBLE), // 168
  new DataByte('priceIncrement', TypedData.DOUBLE), // 176
  new DataByte('priceOffset', TypedData.DOUBLE), // 184
  new DataByte('origPrice', TypedData.DOUBLE), // 192
  new DataByte('execPrice', TypedData.DOUBLE), // 200
  new DataByte('seqId', TypedData.LONG), // 208
  new DataByte('takeProfitPrice', TypedData.DOUBLE), // 216
  new DataByte('triggerType', TypedData.SHORT), // 218
];

export const TransactionManner = new PacketManner<TransactionModel>(PacketHeaderMessageType.TRANSACTION, TRANSACTION_MESSAGE_STRUCTURE);