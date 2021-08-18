// trades = MDExecReport
import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { PacketReader } from "@/internals";
import { DataByte, IReadCustomData, TypedData } from "@/message-structures/typed-data";
import { getPackLength, PacketManner } from "./packet-manner";

const BOOK_PRICE_STRUCTURE = [
  new DataByte('price', TypedData.DOUBLE), // 0
  new DataByte('volume', TypedData.DOUBLE), // 8
  new DataByte('side', TypedData.CHAR, 1), // 16
];

class BookPrice10LevelDataByte extends DataByte implements IReadCustomData {
  getCustomValue(reader: PacketReader) {
    const prices = [];
    const maxLoop = this.length() / getPackLength(BOOK_PRICE_STRUCTURE);

    for (let i = 0; i < maxLoop; i++) {
      let o = {};

      BOOK_PRICE_STRUCTURE.forEach((dataByte) => {
        o[dataByte.name] = dataByte.getValue(reader);
      })

      prices.push(o);
    }

    return prices;
  }
}

const BOOK_MESSAGE_STRUCTURE = [
  new DataByte('type', TypedData.SHORT), // 4
  new DataByte('padding', TypedData.SHORT), // 6
  new DataByte('symbolEnum', TypedData.SHORT), // 8
  new DataByte('symbolType', TypedData.SHORT), // 10
  new DataByte('sendingTime', TypedData.LONG), // 12
  new DataByte('seqNum', TypedData.INT), // 20
  new DataByte('startLayer', TypedData.SHORT), // 24 // 1, 2, 3
  new DataByte('bit24Symbol', TypedData.CHAR, 12), // 26 // 1, 2, 3
  new BookPrice10LevelDataByte('price', TypedData.CUSTOM_DATA, 340) // 38
];

export const BookManner = new PacketManner(PacketHeaderMessageType.BOOK_10, BOOK_MESSAGE_STRUCTURE);