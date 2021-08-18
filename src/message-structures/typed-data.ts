import { PacketReader, PacketSender } from "@/internals";
import _isObject from 'lodash/isObject';
import _isArray from 'lodash/isArray';

export enum TypedData {
  CHAR = 1,
  LONG,
  INT,
  SHORT,
  DOUBLE,
  CUSTOM_DATA
}

export interface IReadCustomData {
  getCustomValue: (reader: PacketReader) => any
}

export interface IPutCustomData {
  putCustomValue: (values: Object | Object[], sender: PacketSender) => void
}

export class DataByte implements IReadCustomData, IPutCustomData {
  name: string;
  type: TypedData;
  private _length: number = 1;

  constructor(name: string, type: TypedData, length?: number) {
    this.name = name;
    this.type = type;
    if (length)
      this._length = length;
  }

  putValue(value: any, sender: PacketSender) {
    switch (this.type) {
      case TypedData.LONG: {
        sender.putLong(value || 0);
        break;
      }
      case TypedData.INT: {
        sender.putInt(value || 0);
        break;
      }
      case TypedData.DOUBLE: {
        sender.putDouble(value || 0);
        break;
      }
      case TypedData.SHORT: {
        sender.putShort(value || 0);
        break;
      }
      case TypedData.CHAR: {
        sender.putChar(value || '', this._length);
        break;
      }
      case TypedData.CUSTOM_DATA: {
        if(!_isObject(value) && !_isArray(value)) {
          throw new Error('CUSTOM_DATA requires values represents as an object or array of object')
        }
        this.putCustomValue(value, sender);
        break;
      }
    }

  }

  getValue(reader: PacketReader): any {
    switch (this.type) {
      case TypedData.LONG: {
        return reader.getLong();
      }
      case TypedData.INT: {
        return reader.getInt();
      }
      case TypedData.DOUBLE: {
        return reader.getDouble();
      }
      case TypedData.SHORT: {
        return reader.getShort();
      }
      case TypedData.CHAR: {
        return reader.getChar(this._length, true);
      }
      case TypedData.CUSTOM_DATA: {
        return this.getCustomValue(reader)
      }
    }
  }

  length(): number {
    switch(this.type) {
      case TypedData.LONG: {
        return 8;
      }
      case TypedData.INT: {
        return 4;
      }
      case TypedData.DOUBLE: {
        return 8;
      }
      case TypedData.SHORT: {
        return 2;
      }
      case TypedData.CHAR:
      case TypedData.CUSTOM_DATA: {
        return this._length;
      }
    }
  }

  getCustomValue(reader: PacketReader) { }
  putCustomValue(values: Object | Object[], sender: PacketSender) { }
}