import { invariant } from "@/exports";

export class PacketReader {
  private _pos: number;
  private _data: number[];
  private _length: number;
  private _messageType: string;
  private _messageTypeAlias: string;
  private _error;
  private _messageLength: number;

  constructor(a: number[]) {
    this._pos = 0;
    this._data = a;
    this._length = a.length;

    this._messageType = this.getChar(1);
    this._messageTypeAlias = this.getChar(1);
    this._messageLength = this.getShort();
  }

  getMessageType(): string {
    return this._messageType;
  }

  // length of buffer from current _pos (included _pos)
  getRemainLength(): number {
    return this._length - this._pos;
  }

  getMessageTypeAlias(): string {
    return this._messageTypeAlias;
  }

  getMessageLength(): number {
    return this._messageLength;
  }

  getError(): string {
    return this._error;
  }

  parseByte(): number {
    invariant(this._pos < this._length, "parseByte: IndexOutOfBoundsException");
    return this._data[this._pos++]
  }

  getByte(): number {
    var a = this.parseByte();
    return 240 < a ? a - 256 : a;
  }

  getBool() {
    invariant(this._pos < this._length, "getBool: IndexOutOfBoundsException");
    return 0 < this._data[this._pos++];
  }

  getBytes(a) {
    invariant(this._pos + a <= this._length, "getBytes: IndexOutOfBoundsException");
    let b = [];
    for (let d = 0; d < a; d++) b.push(this.parseByte());
    return b;
  }

  getShort() {
    invariant(this._pos + 2 <= this._length, "getShort: IndexOutOfBoundsException");
    return this._pos + 2 > this._length ? 0 : (this.parseByte() & 255) + (this.parseByte() << 8);
  }

  getUnsignedShort() {
    invariant(this._pos + 2 <= this._length, "getUnsignedShort: IndexOutOfBoundsException");

    let a = (this.parseByte() & 255) << 0,
      b = (this.parseByte() & 255) << 8;

    return a + b;
  }

  getInt() {
    invariant(this._pos + 4 <= this._length, "getInt: IndexOutOfBoundsException");

    let a = new ArrayBuffer(4),
      b = new Uint8Array(a);

    for (let d = 3; 0 <= d; d--) b[3 - d] = this.parseByte();

    return (new DataView(a)).getInt32(0, true);
  }

  getLong() {
    invariant(this._pos + 8 <= this._length, "getLong: IndexOutOfBoundsException");

    let data = [];
    for (let i = 0; i < 8; i++) {
      data[i] = this.parseByte();
    }

    return this.byteArrayToLong(data);
  }

  getLongTime() {
    var a = {
      56: 72057594037927936,
      48: 281474976710656,
      40: 1099511627776,
      32: 4294967296,
      24: 16777216,
      16: 65536,
      8: 256,
      0: 1
    };
    invariant(this._pos + 8 <= this._length, "getLong: IndexOutOfBoundsException");

    return (this.parseByte() & 255) * a["0"] +
      (this.parseByte() & 255) * a["8"] +
      (this.parseByte() & 255) * a["16"] +
      (this.parseByte() & 255) * a["24"] +
      (this.parseByte() & 255) * a["32"] +
      (this.parseByte() & 255) * a["40"] +
      (this.parseByte() & 255) * a["48"] +
      (this.parseByte() & 255) * a["56"];

  }

  byteArrayToLong(array) {
    let positive = true;
    let value = 0;
    // [7] caused by little endian
    if (array[7] === (255 & 0xff)) {
      positive = false;
    }

    if (positive) {
      for (let i = 7; i >= 0; i--) {
        value = (value * 256) + array[i];
      }
    } else {
      value = 1;
      for (let i = 6; i >= 0; i--) {
        value = value * 256 - array[i];
      }
      value = -value;
    }
    return value;
  }

  getDouble() {
    invariant(this._pos + 8 <= this._length, "getDouble: IndexOutOfBoundsException");
    var buffer = new ArrayBuffer(8);
    var int8array = new Uint8Array(buffer);

    for (var i = 7; i >= 0; i--) {
      int8array[7 - i] = this.parseByte();
    }
    var dataview = new DataView(buffer);

    return dataview.getFloat64(0, true);
  }

  getCharArray() {
    var a = this.getUnsignedShort();
    return this.getBytes(a)
  }

  getChar(size: number, trim: boolean = true) {
    var out = this.getBytes(size);
    // var uintarray = new Uint8Array(out.length);
    // for (var i = 0; i < out.length; i++) {
    //   uintarray[i] = parseInt(out[i], 10);
    // }
    // //@ts-ignore
    // var encode = String.fromCharCode.apply(null, uintarray);

    var uintarray = [];
    for (var i = 0; i < out.length; i++) {
      const n = parseInt(out[i], 10);
      if(trim && n) {
        uintarray[i] = n
      }
    }

    var encode = String.fromCharCode(...uintarray);
    var decode = decodeURIComponent(escape(encode));

    return decode;
  }

  /**
   * layout convention: [size, ...bytes]
   */
  getString() {
    var out = this.getCharArray();
    var uintarray = new Uint8Array(out.length);
    for (var i = 0; i < out.length; i++) {
      uintarray[i] = parseInt(out[i], 10);
    }
    //@ts-ignore
    var encode = String.fromCharCode.apply(null, uintarray);
    var decode = decodeURIComponent(escape(encode));

    return decode;
  }

  clean() { }
}