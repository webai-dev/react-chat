import {
  ChatRoom,
  CompanyRoomList,
  SocketMessage,
  Me,
} from "../../types/types";

export const updateRoomLists = (
  roomLists: CompanyRoomList[],
  chatRooms: ChatRoom[],
  roomId: number,
  message: SocketMessage,
  me: Me | null
) => {
  const updatedRoomLists = [...roomLists];
  const chatRoom = chatRooms.find(
    (room) => room.roomId === message.body?.data?.roomID
  );

  if (message.body?.data?.user?.id !== me?.id) {
    if (
      !chatRoom ||
      !chatRoom.visible ||
      !chatRoom.expanded ||
      !chatRoom.focused ||
      !chatRoom.scrollAtBottom
    ) {
      const roomItem = updatedRoomLists
        .map((roomList) => roomList.rooms)
        .flat()
        .find((room) => room && room.id === roomId);

      if (roomItem) {
        roomItem.unreadCount += 1;
      }
    }
  }

  return updatedRoomLists;
};
