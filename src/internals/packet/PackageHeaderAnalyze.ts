var BIT_IS_COMPRESS_INDEX = 5;
var BIT_IS_BIG_SIZE_INDEX = 3;
var BYTE_PACKET_SIZE_INDEX = 1;
var BIG_HEADER_SIZE = 5;
var NORMAL_HEADER_SIZE = 3;

export const PacketHeaderAnalyze = {
  getDataSize: function (data) {
    var bigSize = this.isBigSize(data);
    if (bigSize)
      return this.getIntAt(data, BYTE_PACKET_SIZE_INDEX);
    else
      return this.getUnsignedShortAt(data, BYTE_PACKET_SIZE_INDEX);
  },
  getCmdIdFromData: function (data) {
    return this.getShortAt(data, 1);
  },
  isBigSize: function (data) {
    return this.getBit(data[0], BIT_IS_BIG_SIZE_INDEX);
  },
  isCompress: function (data) {
    return this.getBit(data[0], BIT_IS_COMPRESS_INDEX);
  },
  // getValidSize: function (data) {
  //   var bigSize = this.isBigSize(data);
  //   var dataSize = 0;
  //   var addSize = 0;
  //   if (bigSize) {
  //     if (length < BIG_HEADER_SIZE)
  //       return -1;
  //     dataSize = this.getIntAt(data, BYTE_PACKET_SIZE_INDEX);
  //     addSize = BIG_HEADER_SIZE;
  //   }
  //   else {
  //     if (length < NORMAL_HEADER_SIZE)
  //       return -1;
  //     dataSize = this.getUnsignedShortAt(data, BYTE_PACKET_SIZE_INDEX);
  //     addSize = NORMAL_HEADER_SIZE;
  //   }
  //   return dataSize + addSize;
  // },
  getBit: function (input, index) {
    var result = input & (1 << index);
    return (result !== 0);
  },
  genHeader: function (bigSize, compress) {
    var header = 0;
    //set bit dau la binary hay ko
    header = this.setBit(header, 7, true);
    //bit 2: ko ma hoa
    header = this.setBit(header, 6, false);
    //bit 3: ko nen
    header = this.setBit(header, 5, compress);
    //bit 4: isBlueBoxed?
    header = this.setBit(header, 4, true);
    //bit 5: isBigSize?
    header = this.setBit(header, 3, bigSize);
    return header;
  },
  setBit: function (input, index, hasBit) {
    if (hasBit) {
      input |= 1 << index;
    } else {
      input &= ~(1 << index);
    }
    return input;
  },
  getIntAt: function (data, index) {
    return ((data[index] & 255) << 24) +
      ((data[index + 1] & 255) << 16) +
      ((data[index + 2] & 255) << 8) +
      ((data[index + 3] & 255) << 0);
  },
  getUnsignedShortAt: function (data, index) {
    var a = (data[index] & 255) << 8;
    var b = (data[index + 1] & 255) << 0;
    return a + b;
  },
  getShortAt: function (data, index) {
    return (data[index] << 8) + (data[index + 1] & 255);
  }
};
