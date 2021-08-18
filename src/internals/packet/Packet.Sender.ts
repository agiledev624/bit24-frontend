import { PacketHeaderAnalyze } from "./PackageHeaderAnalyze";

function build_string(str, length) {
  if (length === 0) {
    return ''
  } else if (str.length >= length) {
    return str.substring(0, length)
  } else {
    return str + ' '.repeat(length - str.length);
  }
}

var INDEX_SIZE_PACKET = 2;

// Packet writer
export class PacketSender {
  private _data = [];
  private _length = 0;
  private _pos = 0;
  private _isPackedHeader = !1;
  private _capacity = 0;

  constructor(messageType, defaultLength = 100, typeAlias = '') {
    this.reset();

    this.initData(defaultLength);
    this.putChar(messageType, 1);
    this.putChar(typeAlias, 1);
    // message length
    this.putShort(2);
  }

  initData(capacity) {
    this._data = [capacity];
    this._capacity = capacity;
  }

  reset() {
    this._pos = 0;
    this._length = 0;
    this._isPackedHeader = false;
  }

  packHeader() {
    if (this._isPackedHeader) {
      return;
    }
    this._isPackedHeader = true;

    var header = PacketHeaderAnalyze.genHeader(false, false);
    this.putByte(header);
    this.putUnsignedShort(this._length);
  }
  
  putByte(b) {
    this._data[this._pos++] = b;
    this._length = this._pos;
    return this;
  }
  
  putByteArray(bytes) {
    this.putShort(bytes.length);
    this.putBytes(bytes);
    return this;
  }

  putBytes(bytes) {
    for (var i = 0; i < bytes.length; i++) {
      this.putByte(bytes[i]);
    }
    return this;
  }

  putShort(v) {
    this.putByte((v >> 0) & 0xFF);
    this.putByte((v >> 8) & 0xFF);
    return this;
  }

  putUnsignedShort(v) {
    this.putByte(v >> 0);
    this.putByte(v >> 8);
    return this;
  }

  putInt(v) {
    this.putByte((v >> 0) & 0xff);
    this.putByte((v >> 8) & 0xff);
    this.putByte((v >> 16) & 0xff);
    this.putByte((v >> 24) & 0xff);

    return this;
  }

  putLong(v) {
    if (v < 0) {
      console.log("hahaha v < 0");
    }
    var data = [];

    for (var k = 0; k < 8; k++) {
      data[k] = (v & (0xff));
      v = Math.floor(v / 256);
    }

    // little endian
    for (var i = 0; i < 8; i++) {
      this.putByte(data[i]);
    }

    return this;
  }


  putDouble(v) {
    var buffer = new ArrayBuffer(8);
    var longNum = new Float64Array(buffer);

    longNum[0] = v;
    const array = Array.from(new Int8Array(buffer)).reverse(); // reverse for little endian

    for (let i = array.length - 1; i >= 0; i--) {
      this.putByte(array[i]);
    }

    return this;
  }

  putString(str) {
    //TODO: add this
    this.putByteArray(this._stringConvertToByteArray(str));
    return this;
  }

  putChar(string, length) {
    var str = build_string(string, length);
    this.putBytes(this._stringConvertToByteArray(str));
    return this;
  }

  updateShortAtPos(v: number, pos: number) {
    this._data[pos] = (v >> 0) & 0xFF;
    this._data[pos + 1] = (v >> 8) & 0xFF;
  }

  updateSize() {
    this.updateShortAtPos(this._length, INDEX_SIZE_PACKET);
  }

  getData() {
    return this._data.slice(0, this._length);
  }

  private _stringConvertToByteArray(strData) {
    if (strData == null)
      return null;

    var arrData = new Uint8Array(strData.length);
    for (var i = 0; i < strData.length; i++) {
      arrData[i] = strData.charCodeAt(i);
    }

    return arrData;
  }

  clean() {

  }
}
