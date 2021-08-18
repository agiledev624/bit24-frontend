import { DataByte, TypedData } from "./typed-data";

const base = [
  new DataByte('messageType', TypedData.CHAR),
  new DataByte('typeAlias', TypedData.CHAR),
  new DataByte('messageLength', TypedData.SHORT),
]
export const UserLogin = [
  ...base,
  new DataByte('padding', TypedData.SHORT), // 4
  new DataByte('accountId', TypedData.INT), // 6
  new DataByte('riskMaster', TypedData.CHAR), // 10
  new DataByte('twoFACode', TypedData.CHAR, 6), // 11
  new DataByte('username', TypedData.CHAR, 6), // 17
  new DataByte('sessionId', TypedData.INT), // 23
  new DataByte('orderEntryIp1', TypedData.CHAR, 24), // 27
  new DataByte('orderEntryIp2', TypedData.CHAR, 24), // 51
  new DataByte('marketEntryIp1', TypedData.CHAR, 24), // 75
  new DataByte('marketEntryIp2', TypedData.CHAR, 24), // 99
  new DataByte('sendingTime', TypedData.LONG), // 123
  new DataByte('MsgSeqNum', TypedData.INT), // 131
  new DataByte('clientLoginKey', TypedData.INT), // 135
  new DataByte('loginStatus', TypedData.SHORT), // 139
  new DataByte('rejectReason', TypedData.SHORT), // 141
];
