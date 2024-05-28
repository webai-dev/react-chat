import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import ChatImage from "../../../_Common/ChatImage";
import { RoomItem } from "../../../../../../types/types";

import Checkbox from "@material-ui/core/Checkbox";
import { CompanyContext } from "../../../../../hooks/useCompanies";
import { ChatRoomsContext } from "../../../../../hooks/useChatRooms";

// Global styles
export const useStyles = makeStyles({
  iconContainer: {
    paddingLeft: "15px",
    paddingRight: "12px",
    color: "#707070",
  },
  info: {
    marginLeft: 50,
  },
  name: {
    color: "#707070",
    fontSize: 16,
  },
  occupation: {
    color: "#707070",
    fontSize: 13,
  },
  root: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    padding: "16px 22px 13px",
    cursor: "pointer",

    backgroundColor: (selected) => (selected ? "#4F8DCB1A" : "white"),
  },
  status: {
    position: "absolute",
    width: 12,
    height: 12,
    bodorRadius: 8,
    boxShadow: "0px 1px 3px #00000029",
    border: "1px solid #707070",
    borderRadius: 6,
    bottom: 0,
    right: 0,
  },
  unread: {
    width: 3,
    height: "100%",
    position: "absolute",
    backgroundColor: "#3870A0",
    left: 0,
    top: 0,
  },
});

interface RoomListItemProps {
  onClick?: () => void;
  team?: boolean;
  modal?: boolean;
  room: RoomItem;
  selectedRoomId?: number;
  modalItem?: boolean;
  selectedMembers?: number[];
  setSelectedMembers?: React.Dispatch<React.SetStateAction<number[]>>;
  connectionStatus: number;
}

/**
 * RoomListItem component
 * @param {RoomListItemProps} props Properties
 * @description RoomListItem component consists of data for one user/group in Chat Room
 */
const RoomListItem: React.FC<RoomListItemProps> = ({
  onClick = () => undefined,
  selectedRoomId = -1,
  room = {
    id: 0,
    lastActiveUsers: [],
    lastReadMessageID: 0,
    name: "",
    roomType: 0,
    unreadCount: 0,
  },
  modalItem = false,
  selectedMembers = [],
  setSelectedMembers = () => undefined,
  connectionStatus = 1,
}) => {
  const { id, name, lastMessage, roomType, unreadCount, lastActiveUsers } =
    room;
  const classes = useStyles(selectedRoomId === id);
  const { addChatRoom } = useContext(ChatRoomsContext);
  const { selectedCompany } = useContext(CompanyContext);

  let roomTitle = "";
  let roomSubTitle = "";

  if (roomType === 0) {
    roomTitle = name || "Group chat room";
    roomSubTitle = lastMessage ? lastMessage.message : "";
  } else {
    roomTitle = lastActiveUsers
      ? lastActiveUsers[0]?.firstName + " " + lastActiveUsers[0]?.lastName
      : "";
    roomSubTitle = lastActiveUsers
      ? lastActiveUsers[0]?.companyMembership
          .map((membership) => membership.jobTitle)
          .join(", ")
      : "";
  }

  const handleClickRoomListItem = () => {
    if (!modalItem) {
      addChatRoom(id, selectedCompany && selectedCompany.id);
      onClick();
    }
  };

  return (
    <div
      data-testid="room-list-item"
      className={classes.root}
      onClick={handleClickRoomListItem}
      style={
        modalItem
          ? {
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              marginRight: "80px",
            }
          : {}
      }
    >
      {unreadCount > 0 && <div className={classes.unread} />}
      {modalItem && (
        <Checkbox
          color="default"
          checked={
            selectedMembers.filter(
              (id) =>
                room.lastActiveUsers &&
                room.lastActiveUsers[0].id &&
                id === room.lastActiveUsers[0].id
            ).length > 0
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedMembers([
                ...selectedMembers,
                room.lastActiveUsers[0].id,
              ]);
            } else {
              let updatedMembers = selectedMembers.filter(
                (id) => id !== room.lastActiveUsers[0].id
              );
              setSelectedMembers(updatedMembers);
            }
          }}
          inputProps={{ "aria-label": "checkbox with default color" }}
        />
      )}

      <ChatImage connectionStatus={connectionStatus} room={room} />
      <div className={classes.info}>
        <div className={classes.name}>{roomTitle}</div>
        <div className={classes.occupation}>{roomSubTitle}</div>
      </div>
    </div>
  );
};

export default RoomListItem;
