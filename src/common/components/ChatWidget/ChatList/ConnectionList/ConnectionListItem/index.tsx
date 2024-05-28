import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import ConnectionImage from "../../../_Common/ConnectionImage";
import { ConnectionItem } from "../../../../../../types/types";
import { getRoomWithConnection, createRoomWithConnection } from "../../../../../services/connections";
import { ChatRoomsContext } from "../../../../../hooks/useChatRooms";

import Checkbox from "@material-ui/core/Checkbox";

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
    backgroundColor: "white",
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

interface ConnectionListItemProps {
  onClick?: () => void;
  connection: ConnectionItem;
  modalItem?: boolean;
  selectedMembers?: number[];
  setSelectedMembers?: React.Dispatch<React.SetStateAction<number[]>>;
  connectionStatus?: number;
}

/**
 * ConnectionListItem component
 * @param {ConnectionListItemProps} props Properties
 * @description ConnectionListItem component consists of data for one connection
 */
const ConnectionListItem: React.FC<ConnectionListItemProps> = ({
  onClick = () => undefined,
  connectionStatus = 1,
  connection = {
    id: -1,
    firstName: "",
    lastName: "",
    profilePhotoUrl: "",
    isOnline: false,
  },
  modalItem = false,
  selectedMembers = [],
  setSelectedMembers = () => undefined,
}) => {
  const { firstName, lastName } = connection;
  const classes = useStyles();
  const { addChatRoom } = useContext(ChatRoomsContext);

  let roomTitle = firstName + " " + lastName;
  let roomSubTitle = "";

  const handleClickConnection = async () => {
    let room = await getRoomWithConnection(connection.id);

    if (!room) {
      room = await createRoomWithConnection(connection.id);
    }

    if (room) {
      addChatRoom(room.id, null);
    }
  };

  return (
    <div
      data-testid="room-list-item"
      className={classes.root}
      style={
        modalItem
          ? {
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              marginRight: "80px",
            }
          : {}
      }
      onClick={handleClickConnection}
    >
      <ConnectionImage
        connection={connection}
        connectionStatus={connectionStatus}
      />
      <div className={classes.info}>
        <div className={classes.name}>{roomTitle}</div>
        <div className={classes.occupation}>{roomSubTitle}</div>
      </div>
    </div>
  );
};

export default ConnectionListItem;
