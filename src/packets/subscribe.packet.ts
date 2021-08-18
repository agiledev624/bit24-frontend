// trades = MDExecReport
import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { PacketReader, PacketSender } from "@/internals";
import { DataByte, IPutCustomData, IReadCustomData, TypedData } from "@/message-structures/typed-data";
import { getPackLength, PacketManner } from "./packet-manner";

/**
 * Bit24SubsccribeStruct							
  SymbolEnum	short	2			Ex, BTC = 1		
  Symbol	char[]	16					
  SymbolType	short	2					
  Layers	short	2				// value = 1, 2, 3	
  Subscribe	char[]	1			(S = subscribe, U = unsubscribe)		
  => 23
 */
const SUBSCRIBE_STRUCTURE = [
  new DataByte('symbolEnum', TypedData.SHORT), // 0
  new DataByte('symbol', TypedData.CHAR, 16), // 2
  new DataByte('symbolType', TypedData.SHORT), // 18
  new DataByte('layer', TypedData.SHORT), // 20
  new DataByte('subscribe', TypedData.CHAR, 1), // 22
];

class SubscribeCustomByte extends DataByte implements IReadCustomData, IPutCustomData {
  putCustomValue(values: Object | Object[], sender: PacketSender) {
    const maxLoop = this.length() / getPackLength(SUBSCRIBE_STRUCTURE);
    for(let i = 0; i < maxLoop; i++) {
      SUBSCRIBE_STRUCTURE.forEach((dataByte) => {
        dataByte.putValue(values[i] ? values[i][dataByte.name] : undefined, sender);
      })
    }
  }

  getCustomValue(reader: PacketReader) {
    const subscribe = [];
    const maxLoop = this.length() / getPackLength(SUBSCRIBE_STRUCTURE);

    for (let i = 0; i < maxLoop; i++) {
      let o = {};

      SUBSCRIBE_STRUCTURE.forEach((dataByte) => {
        o[dataByte.name] = dataByte.getValue(reader);
      });

      if(!!o['symbolEnum']) {
        subscribe.push(o);
      }
    }

    return subscribe;
  }
}
const TRADE_MESSAGE_STRUCTURE = [
  new DataByte('type', TypedData.CHAR, 2), // 4
  new DataByte('padding', TypedData.SHORT), // 6
  new DataByte('accountId', TypedData.INT), // 8
  new DataByte('key', TypedData.INT), // 12
  new DataByte('sessionId', TypedData.INT), // 24
  new DataByte('sendingTime', TypedData.LONG), // 28
  new DataByte('MsgSeqNum', TypedData.INT), // 36
  new SubscribeCustomByte('bit24Subscribe', TypedData.CUSTOM_DATA, 115), // 40
];

export const SubscribeManner = new PacketManner(PacketHeaderMessageType.SUBSCRIBE, TRADE_MESSAGE_STRUCTURE);