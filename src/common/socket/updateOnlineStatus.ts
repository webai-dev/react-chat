import { CompanyRoomList, SocketMessage } from "../../types/types";

export const updateOnlineStatus = (
  roomLists: CompanyRoomList[],
  message: SocketMessage
) => {
  const updatedRoomLists = [...roomLists];
  const userID = message.body?.object?.id;
  const isOnline = message.body?.data?.isOnline;

  updatedRoomLists.forEach((roomList) => {
    if (roomList && roomList.rooms) {
      roomList.rooms.forEach((room) => {
        room.lastActiveUsers.forEach((activeUser) => {
          if (activeUser.id === userID) {
            activeUser.isOnline = isOnline || false;
          }
        });
      });
    }
  });

  return updatedRoomLists;
};
