import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { PacketManner } from "./packet-manner";
	
const RISK_ACCOUNT_INFO_STRUCTURE = [
  new DataByte('type', TypedData.CHAR, 2), // 4
  new DataByte('padding', TypedData.SHORT), // 6
  new DataByte('accountId', TypedData.INT), // 8
  new DataByte('sessionId', TypedData.INT), // 12
  new DataByte('symbolEnum', TypedData.SHORT), // 16
  new DataByte('key', TypedData.INT), // 18
  new DataByte('accountEquity', TypedData.DOUBLE), // 22
  new DataByte('symbolEquity', TypedData.DOUBLE), // 30
  new DataByte('leverage', TypedData.DOUBLE), // 38
  new DataByte('longPosition', TypedData.DOUBLE), // 46
  new DataByte('shortPosition', TypedData.DOUBLE), // 54
  new DataByte('msgSeqId', TypedData.LONG), // 62
  new DataByte('sendingTime', TypedData.LONG), // 70
  new DataByte('symbol', TypedData.CHAR, 16), // 78
  new DataByte('tradeId', TypedData.SHORT), // 94
];

export const RiskAccountManner = new PacketManner(PacketHeaderMessageType.RISK_ACCOUNT, RISK_ACCOUNT_INFO_STRUCTURE);

const RISK_SYMBOL_INFO_STRUCTURE = [
  new DataByte('type', TypedData.CHAR, 2), // 4
  new DataByte('padding', TypedData.SHORT), // 6
  new DataByte('symbolEnum', TypedData.SHORT), // 8
  new DataByte('accountId', TypedData.INT), // 10
  new DataByte('accountEquity', TypedData.DOUBLE), // 14
  new DataByte('symbolEquity', TypedData.DOUBLE), // 22
  new DataByte('availableMargin', TypedData.DOUBLE), // 30
  new DataByte('usedMargin', TypedData.DOUBLE), // 38
  new DataByte('leverage', TypedData.DOUBLE), // 46
  new DataByte('longCash', TypedData.DOUBLE), // 54
  new DataByte('longPosition', TypedData.DOUBLE), // 62
  new DataByte('openLongOrders', TypedData.DOUBLE), // 70
  new DataByte('shortCash', TypedData.DOUBLE), // 78
  new DataByte('shortPosition', TypedData.DOUBLE), // 86
  new DataByte('openShortOrders', TypedData.DOUBLE), // 94
  new DataByte('executedLongCash', TypedData.DOUBLE), // 102
  new DataByte('executedLongPosition', TypedData.DOUBLE), // 110
  new DataByte('executedShortCash', TypedData.DOUBLE), // 118
  new DataByte('executedShortPosition', TypedData.DOUBLE), // 126
  new DataByte('tradingDisabled', TypedData.CHAR, 1), // 134
  new DataByte('MMR', TypedData.DOUBLE), // 135
  new DataByte('sessionId', TypedData.INT), // 143
  new DataByte('msgSeqId', TypedData.INT), // 147
];

export const RiskSymbolManner = new PacketManner(PacketHeaderMessageType.RISK_USER_SYMBOL, RISK_SYMBOL_INFO_STRUCTURE);