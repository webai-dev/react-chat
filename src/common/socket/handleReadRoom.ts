import { ActiveUser, ChatRoom, Me, SocketUpdateMessage } from "../../types/types";

export const handleReadRoom = (
  chatRoom: ChatRoom,
  message: SocketUpdateMessage,
  me: Me,
  companyId: number | null
) => {
  if (message.body?.data && message.body?.data.length > 0) {
    console.log(message);
    let readBy = message.body.data[0].value;
    // let messagesLength = chatRoom.messages.length;
    if (chatRoom) {
      if (readBy && readBy?.filter((u) => u !== me.id).length > 0) {
        chatRoom.messages.forEach((message) => {
          message.new = false;
          message.check = "none"; // No checkmark
        });
        
        if (chatRoom.participants) {
          chatRoom.participants.forEach((participant: ActiveUser) => {
            const readByUpdated = readBy?.find(id => id === participant.id);

            if (readByUpdated) {
              participant.lastReadMessageID = chatRoom.messages.length > 0 ? chatRoom.messages[chatRoom.messages.length - 1].id : undefined;
            }
          });
        }
      }

      chatRoom = { ...chatRoom, readBy: readBy };
    }

    return chatRoom;
  }

  return null;
};
