import {
  ChatRoom,
  SocketMessage,
  Me,
  Company,
  CompanyRoomList,
} from "../../types/types";

export const updateCompanyList = (
  roomLists: CompanyRoomList[],
  companies: Company[],
  chatRooms: ChatRoom[],
  companyId: number | null,
  message: SocketMessage,
  me: Me | null
) => {
  const updatedCompanies = [...companies];
  const chatRoom = chatRooms.find(
    (room) => room.roomId === message.body?.data?.roomID
  );

  if (message.body?.data?.user && message.body?.data?.user?.id !== me?.id) {
    if (
      !chatRoom ||
      !chatRoom.visible ||
      !chatRoom.expanded ||
      !chatRoom.focused ||
      !chatRoom.scrollAtBottom
    ) {
      const company = updatedCompanies.find(
        (company) => company.id === companyId
      );

      if (company) {
        let totalUnreadCount = 0;
        roomLists.forEach((roomList) => {
          if (roomList.companyId === company.id) {
            roomList.rooms &&
            roomList.rooms.forEach((r) => {
                if (r.unreadCount > 0) {
                  totalUnreadCount += 1;
                }
              });
          }
        });

        company.unreadCount = totalUnreadCount;
      }
    }
  }

  return updatedCompanies;
};
