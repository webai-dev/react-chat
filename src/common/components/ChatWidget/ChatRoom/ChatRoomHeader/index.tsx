import React, {useContext, useEffect, useState} from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CloseIcon from "@material-ui/icons/Close";
import {ChatRoom, RoomDetail} from "../../../../../types/types";
import { RoomListsContext } from "../../../../hooks/useRoomLists";
import { ChatRoomsContext } from "../../../../hooks/useChatRooms";
import { CompanyContext } from "../../../../hooks/useCompanies";
import {MeContext} from "../../../../hooks/useMe";
import { getRoomDetail } from "../../../../services/rooms";
import ChatImage from "../../_Common/ChatImage";

// Global styles
export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "70px",
    padding: "10px 15px",
  },
  closeIcon: {
    marginLeft: "20px",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    cursor: "pointer",
    color: (exp) => (!exp ? "#A4AFB7" : "#FFFFFF"),
  },
  imageContainer: {
    position: "relative",
    width: 50,
    height: 50,
    minWidth: 50,
    marginRight: "20px",
  },
  info: {
    marginLeft: 0,
  },
  name: {
    color: (exp) => (!exp ? "#555555" : "#FFFFFF"),
    fontSize: 16,
    fontWeight: "bold",
  },
  department: {
    color: (exp) => (!exp ? "#555555" : "#FFFFFF"),
    fontSize: 12,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
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

interface ChatRoomHeaderProps {
  chatRoom: ChatRoom | undefined;
  connectionStatus: number;
}

/**
 * ChatRoomHeader component
 * @param {ChatRoomHeaderProps} props Properties
 * @description ChatRoomHeader component consists of User Details, Add Button, Close button
 */
const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  chatRoom = null,
  connectionStatus = 1,
}) => {
  // Default styling
  const { companyRoomLists, loadingList } = useContext(RoomListsContext);
  const { hideChatRoom, updateChatRooms } = useContext(ChatRoomsContext);
  const { selectedCompany } = useContext(CompanyContext);
  const [roomDetail, setRoomDetail] = useState<RoomDetail | undefined>(undefined);
  const { me } = useContext(MeContext);

  const [showGroupChatIcon, setShowGroupChatIcon] = useState(false);

  useEffect(() => {
    const roomItem =
        companyRoomLists &&
        companyRoomLists
            .map((roomList) => roomList.rooms)
            .flat()
            .find((r) => r && r.id === chatRoom?.roomId);
    if (chatRoom && !loadingList) {
      if (roomItem) {
        setRoomDetail({
          id: roomItem.id,
          imageUrl: roomItem.imageUrl,
          lastMessage: roomItem.lastMessage,
          name: roomItem.name,
          participants: roomItem.lastActiveUsers,
          readBy: [],
          roomType: roomItem.roomType,
          unreadCount: roomItem.unreadCount,
          creator: null,
          teamID: null,
        });
        if(roomItem.roomType !== 0) {
          setShowGroupChatIcon(true);
        }
      } else {
        getRoomDetail(chatRoom.companyId, chatRoom.roomId).then((data) => {
          if (data) {
            setRoomDetail(data);
            if (data.teamID){
              setShowGroupChatIcon(false);
            } else setShowGroupChatIcon(data?.creator?.id === me?.id);
          }
        });
      }
    }
  }, [loadingList]);

  const classes = useStyles(
    (!chatRoom?.expanded || !chatRoom.focused || !chatRoom.scrollAtBottom) && roomDetail && roomDetail.unreadCount > 0
  );

  let roomTitle = "";
  let roomSubTitle = "";

  if (roomDetail) {
    const { name, roomType, participants } = roomDetail;
    const filteredParticipants = roomDetail?.participants.filter(p => me && p.id !== me.id);

    if (roomType === 0) {
      roomTitle = name || "Group chat room";
      roomSubTitle = filteredParticipants.map((user) => user.firstName).join(", ");
    } else {
      roomTitle = filteredParticipants
          ? filteredParticipants[0]?.firstName + " " + filteredParticipants[0]?.lastName
          : "";
      roomSubTitle = filteredParticipants
          ? (filteredParticipants[0]?.companyMembership || [])
              .map((membership) => membership.jobTitle)
              .join(", ")
          : "";
    }
  }

  return (
    <div data-testid="chat-room-header">
      <Container className={classes.root}>
        <div className={classes.detailsContainer}>
          <div className={classes.imageContainer}>
            {roomDetail && (
              <ChatImage
                  connectionStatus={connectionStatus}
                  room={{
                    id: roomDetail.id,
                    lastActiveUsers: roomDetail?.participants.filter(p => me && p.id !== me.id),
                    lastReadMessageID: 0,
                    name: roomDetail.name,
                    roomType: roomDetail?.roomType,
                    unreadCount: roomDetail?.unreadCount,
                  }}
              />
            )}
          </div>
          <div className={classes.info}>
            <div className={classes.name}>{roomTitle}</div>
            <div className={classes.department}>{roomSubTitle}</div>
          </div>
        </div>

        <div className={classes.iconContainer}>
          {
            showGroupChatIcon && (
              <PersonAddIcon
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (chatRoom) {
                    chatRoom.groupModalOpened = true;
                    updateChatRooms({...chatRoom});
                  }
                }}
              />)
          }
          <CloseIcon
            className={classes.closeIcon}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (roomDetail && selectedCompany) {
                hideChatRoom(roomDetail.id, selectedCompany.id);
              }
            }}
          />
        </div>
      </Container>
    </div>
  );
};

export default ChatRoomHeader;
