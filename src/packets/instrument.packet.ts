// trades = MDExecReport
import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { PacketManner } from "./packet-manner";

export enum InstrumentRequestType {
  ALL = 0,
  // ALL2 = 1,
  USE_SYMBOL = 2 // symbol enum of requested symbol, when the type of request == 2 -> symbol Enum feild is gonna use
}

const INSTRUMENT_REQUEST_STRUCTURE = [
  new DataByte('type', TypedData.CHAR, 2), // 4
  new DataByte('padding', TypedData.SHORT), // 6
  new DataByte('accountId', TypedData.INT), // 8
  new DataByte('requestType', TypedData.SHORT), // 12
  new DataByte('key', TypedData.INT), // 14
  new DataByte('symbolName', TypedData.CHAR, 24), // 18
  new DataByte('symbolType', TypedData.SHORT), // 42
  new DataByte('symbolEnum', TypedData.SHORT), // 44
  new DataByte('sessionId', TypedData.INT), // 46
  new DataByte('sendingTime', TypedData.LONG), // 50
  new DataByte('seqNum', TypedData.INT) // 58
];

export const InstrumentRequestManner = new PacketManner(PacketHeaderMessageType.INSTRUMENT_REQUEST, INSTRUMENT_REQUEST_STRUCTURE);

export enum InstrumentResponseType {
  SNAPSHOT = 1,
  SNAPSHOT_START,
  SNAPSHOT_CONTINUATION,
  SNAPSHOT_FINISH,
  UPDATE,
}

const INSTRUMENT_STRUCTURE = [
  new DataByte('type', TypedData.CHAR, 2), // 4
  new DataByte('padding', TypedData.SHORT), // 6
  new DataByte('responseType', TypedData.SHORT), // 8
  new DataByte('symbolEnum', TypedData.SHORT), // 10
  new DataByte('symbolName', TypedData.CHAR, 24), // 12
  new DataByte('symbolType', TypedData.SHORT), // 36
  new DataByte('priceIncrement', TypedData.DOUBLE), // 38
  new DataByte('minSize', TypedData.DOUBLE), // 46
  new DataByte('maxSize', TypedData.DOUBLE), // 54
  new DataByte('sendingTime', TypedData.DOUBLE), // 62
  new DataByte('seqNum', TypedData.DOUBLE) // 70
];

interface InstrumentStructure {
  type: string,
  padding: number,
  responseType: InstrumentResponseType,
  symbolEnum: number,
  symbolName: string,
  symbolType: number,
  priceIncrement: number,
  minSize: number,
  maxSize: number,
  sendingTime: number
  seqNum: number
}

export const InstrumentManner = new PacketManner<InstrumentStructure>(PacketHeaderMessageType.INSTRUMENT, INSTRUMENT_STRUCTURE);