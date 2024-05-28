import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import NullableImage from "../NullableImage";
import { ActiveUser, RoomItem } from "../../../../../types/types";

// Global styles
export const useStyles = makeStyles({
  imageContainer: {
    position: "relative",
    width: 50,
    height: 50,
    minWidth: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #cccccc",
    borderRadius: 25,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  photoSingle: {
    width: 28,
    height: 28,
    borderRadius: 15,
    border: "1px solid #aaa",
    background: "white",
  },
  photoTwice: {
    width: 28,
    height: 28,
    borderRadius: 15,
    margin: "0 -5px",
    border: "1px solid #aaa",
    background: "white",
  },
  photoTriple: {
    width: 28,
    height: 28,
    borderRadius: 15,
    position: "absolute",
    border: "1px solid #aaa",
    background: "white",
  },
  photoTriple1: {
    top: 0,
    left: 10,
  },
  photoTriple2: {
    top: 18,
    left: 0,
  },
  photoTriple3: {
    top: 18,
    left: 20,
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
});

interface ChatImageProps {
  onClick?: () => void;
  team?: boolean;
  modal?: boolean;
  room: RoomItem;
  selectedRoomId?: number;
  connectionStatus: number;
}

/**
 * ChatImage common component
 * @param {ChatImageProps} props Properties
 * @description ChatImage component consists of conatiner for chat image
 */
const ChatImage: React.FC<ChatImageProps> = ({
  room = {
    id: 0,
    lastActiveUsers: [],
    lastReadMessageId: 0,
    name: "",
    roomType: 0,
    unreadCount: 0,
  },
  connectionStatus = 1,
}) => {
  const { roomType, lastActiveUsers } = room;
  const classes = useStyles();
  let isOnline = false;

  if (roomType !== 0 && lastActiveUsers && lastActiveUsers[0]) {
    isOnline = lastActiveUsers[0].isOnline || false;
  }

  return (
    <div data-testid="chat-image" className={classes.imageContainer}>
      {(!lastActiveUsers || lastActiveUsers.length < 2) && (
        <NullableImage
          src={(lastActiveUsers || [{}])[0]?.profilePhotoUrl}
          className={roomType === 0 ? classes.photoSingle : classes.photo}
        />
      )}
      {lastActiveUsers && lastActiveUsers.length >= 2 && (
        <Box
          display="flex"
          alignItems="center"
          height="100%"
          width="50px"
          padding="0 5px"
        >
          {lastActiveUsers.length === 2 &&
            lastActiveUsers.map((user: ActiveUser, index: number) => (
              <NullableImage
                key={index}
                src={user.profilePhotoUrl}
                className={classes.photoTwice}
              />
            ))}
          {lastActiveUsers.length === 3 &&
            lastActiveUsers.map((user: ActiveUser, index: number) => (
              <NullableImage
                key={index}
                src={user.profilePhotoUrl}
                className={classNames(
                  classes.photoTriple,
                  index === 0
                    ? classes.photoTriple1
                    : index === 1
                    ? classes.photoTriple2
                    : classes.photoTriple3
                )}
              />
            ))}
        </Box>
      )}
      {(roomType === 1 || roomType === 2) && (
        <div
          className={classes.status}
          style={{
            backgroundColor:
              connectionStatus === 1 //connection online
                ? isOnline
                  ? "green"
                  : "red"
                : connectionStatus === -1 //connection offline beyond reconnecting
                ? "gray"
                : "red",
          }}
        />
      )}
    </div>
  );
};

export default ChatImage;
