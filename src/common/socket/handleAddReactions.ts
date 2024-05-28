import { ChatRoom, Me, SocketReactionMessage } from "../../types/types";

export const handleAddReactions = (
  chatRoom: ChatRoom,
  message: SocketReactionMessage,
  me: Me,
  companyId: number | null
) => {
  if (message.body?.data && message.body?.data.length > 0) {
    if (chatRoom) {
      let index = chatRoom.messages.findIndex(
        (m) => m.id === message.body?.object?.id
      );

      if (index !== -1 && message.body.data[0].property === "reactions") {
        chatRoom.messages[index].reactions = message.body.data[0].value;
      }
    }

    return chatRoom;
  }

  return null;
};
