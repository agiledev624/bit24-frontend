import { PacketReader, PacketSender } from "@/internals";
import { UserLogin } from "@/message-structures/admin-risk";

export function sendUserLogin(params): number[] {
  const sender = new PacketSender("H");

  if (UserLogin.length > 3) {
    for (let i = 3; i < UserLogin.length; i++) {
      const dataByte = UserLogin[i];
      dataByte.putValue(params[dataByte.name], sender);
    }
  }

  sender.updateSize();

  return sender.getData();
}

export function readUserLogin(buffer: number[]) {
  const reader = new PacketReader(buffer);
  const result = {
    [UserLogin[0].name]: reader.getMessageType(),
    [UserLogin[1].name]: reader.getMessageTypeAlias(),
    [UserLogin[2].name]: reader.getMessageLength(),
  };

  if (UserLogin.length > 3) {
    for (let i = 3; i < UserLogin.length; i++) {
      const dataByte = UserLogin[i];

      result[dataByte.name] = dataByte.getValue(reader);
    }
  }

  return result;
}
