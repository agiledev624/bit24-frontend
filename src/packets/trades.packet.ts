// trades = MDExecReport
import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { PacketManner } from "./packet-manner";

const TRADE_MESSAGE_STRUCTURE = [
  new DataByte('type', TypedData.SHORT), // 4
  new DataByte('padding', TypedData.SHORT), // 6
  new DataByte('symbolEnum', TypedData.SHORT), // 8
  new DataByte('symbolType', TypedData.SHORT), // 10
  new DataByte('price', TypedData.DOUBLE), // 12
  new DataByte('volume', TypedData.DOUBLE), // 20
  new DataByte('sendingTime', TypedData.LONG), // 28
  new DataByte('seqNum', TypedData.INT), // 36
  new DataByte('side', TypedData.SHORT), // 40
  new DataByte('bit24Symbol', TypedData.CHAR, 12), // 42
];

export const TradesManner = new PacketManner(PacketHeaderMessageType.EXEC_REPORT, TRADE_MESSAGE_STRUCTURE);