import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { PacketReader, PacketSender } from "@/internals";
import { DataByte, TypedData } from "@/message-structures/typed-data";

export function getPackLength(structure: DataByte[]): number {
  return structure.reduce((result, current) => result + current.length(), 0);
}

export class PacketManner<T = any> {
  messageType: PacketHeaderMessageType;

  private _structure: DataByte[];

  constructor(messageType: PacketHeaderMessageType, messageStructure: DataByte[]) {
    this.messageType = messageType;

    // all messages have the same first 4 bytes
    this._structure = [
      new DataByte('messageType', TypedData.CHAR),
      new DataByte('typeAlias', TypedData.CHAR),
      new DataByte('messageLength', TypedData.SHORT),
      ...messageStructure
    ];
  }

  send(params: Object): number[] {
    const sender = new PacketSender(this.messageType);

    if (this._structure.length > 3) {
      for (let i = 3; i < this._structure.length; i++) {
        const dataByte = this._structure[i];
        dataByte.putValue(params[dataByte.name] || undefined, sender);
      }
    }

    sender.updateSize();

    return sender.getData();
  }

  read(buffer: number[], pretty?: boolean): T {
    const reader = new PacketReader(buffer);
    const result: T = Object.assign({
      [this._structure[0].name]: reader.getMessageType(),
      [this._structure[1].name]: reader.getMessageTypeAlias(),
      [this._structure[2].name]: reader.getMessageLength(),
    });

    if (this._structure.length > 3) {
      for (let i = 3; i < this._structure.length; i++) {
        const dataByte = this._structure[i];

        result[dataByte.name] = dataByte.getValue(reader);
      }
    }

    if(pretty) {
      const t = Object.assign({});
      for(let key in result) {
        if(result[key]) {
          t[key] = result[key]
        }
      }

      return t;
    }

    return result;
  }

  length(): number {
    return getPackLength(this._structure);
  }
}