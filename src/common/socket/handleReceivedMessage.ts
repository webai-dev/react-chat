import {
  ChatRoom,
  SocketMessage,
  Me,
  CompanyRoomList,
  RoomItem,
  RoomDetail,
} from "../../types/types";
// import ChatService from "../services/chat";
import { getRoomDetail } from "../services/rooms";

// const { markMessageAsRead } = ChatService;

export const handleReceivedMessage = (
  chatRoom: ChatRoom,
  message: SocketMessage,
  me: Me,
  companyId: number | null,
  companyRoomLists: CompanyRoomList[]
) => {
  if (message.body?.data?.user?.id !== me.id) {
    if (message.body?.data?.roomID) {
      let updatedCompanyRooms = companyRoomLists.find(
        (company) => company.companyId === companyId
      );

      let roomId = message.body?.data?.roomID;
      if (updatedCompanyRooms && updatedCompanyRooms.rooms) {
        let targetRoom = updatedCompanyRooms.rooms.find(
          (r) => r && r.id === roomId
        );
        if (targetRoom) {
          updatedCompanyRooms.rooms = [
            targetRoom,
            ...updatedCompanyRooms?.rooms.filter((r) => r && r.id !== roomId),
          ];
        } else {
          let companyID = message.context?.company.companyID
            ? message.context?.company.companyID
            : 0;
          let roomID = message.context?.room.roomID
            ? message.context?.room.roomID
            : 0;

          getRoomDetail(companyID, roomID).then((data: RoomDetail | null) => {
            if (data) {
              let lastActiveUsers = data.participants
                .filter((d) => d.id === message.body?.data?.user?.id)
                .map((d) => {
                  return { ...d, companyMembership: [] };
                });
              let newRoomItem: RoomItem = {
                id: data.id,
                imageUrl: data.imageUrl,
                lastMessage: data.lastMessage,
                name: data.name,
                lastReadMessageID: message.body?.data?.id
                  ? message.body?.data?.id
                  : null,
                roomType: data.roomType,
                unreadCount: data.unreadCount,
                lastActiveUsers: lastActiveUsers,
              };
              if (updatedCompanyRooms) {
                updatedCompanyRooms.rooms = [
                  newRoomItem,
                  ...updatedCompanyRooms?.rooms.filter(
                    (r) => r && r.id !== roomId
                  ),
                ];
              }
            }
          });
        }
      }
    }

    if (chatRoom) {
      chatRoom.newMessageFromOther = true;

      if (message.body?.data?.id) {
        const {
          id,
          message: messageText,
          messageType,
          sentAt,
        } = message.body?.data;
        chatRoom.messages.forEach((message) => (message.new = false));
        chatRoom.messages = [
          ...chatRoom.messages,
          {
            id: id,
            message: messageText || "",
            messageType: messageType || 0,
            sentAt: sentAt || "",
            user: message.body?.data?.user,
            new: true,
          },
        ];
      }

      if (chatRoom.visible && chatRoom.expanded && chatRoom.focused) {
        // markMessageAsRead(
        //   companyId,
        //   message.body?.data?.roomID,
        //   message.body?.data?.id
        // );
      } else {
        chatRoom.nextHasMore = true;
      }
    }

    return chatRoom;
  } else if (message.body?.data?.user?.id === me.id) {
    if (chatRoom) {
      if (message.body?.data?.id) {
        const {
          id,
          message: messageText,
          messageType,
          sentAt,
        } = message.body?.data;
        chatRoom.messages.forEach((message) => (message.new = false));
        chatRoom.messages = chatRoom.messages.filter((m) => m.id !== 0);

        chatRoom.messages = [
          ...chatRoom.messages,
          {
            id: id,
            message: messageText || "",
            messageType: messageType || 0,
            sentAt: sentAt || "",
            user: message.body?.data?.user,
            new: true,
            check: "received",
          },
        ];
      }
    }
  } else {
    if (chatRoom) {
      let messagesLength = chatRoom.messages.length;
      chatRoom.messages = [
        ...chatRoom.messages.slice(0, messagesLength - 1),
        { ...chatRoom.messages[messagesLength - 1], check: "received" },
      ];
    }
  }
  return null;
};
