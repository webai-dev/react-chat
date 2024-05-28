import React, { useRef, useEffect, useContext, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ChatRoomHeader from "./ChatRoomHeader";
import ChatInput from "./ChatInput";
import ChatContent from "./ChatContent";
import { CompanyContext } from "../../../hooks/useCompanies";
import { ChatRoomsContext } from "../../../hooks/useChatRooms";
import { RoomListsContext } from "../../../hooks/useRoomLists";

// Global styles
export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "370px",
    height: "462px",
    position: "absolute",
    boxShadow: "0px 3px 6px #0000000A",
    background: "#fff",
    bottom: 0,
    right: (index) => ((index as number) + 1) * 390,
    margin: 0,
    padding: 0,
  },
  accordion: {
    display: "flex",
    flexDirection: "column",
    width: "370px",
    position: "fixed",
    boxShadow: "0px 3px 6px #0000000A",
    background: "#fff",
    bottom: 0,
    right: (index) => ((index as number) + 1) * 390,
    margin: 0,
    padding: 0,
    borderRadius: "0 !important",
  },
  accordionDetails: {
    display: "block",
    padding: 0,
  },
  accordionExpanded: {
    margin: "0 !important",
  },
  accordionSummary: {
    paddingLeft: 16,
    paddingRight: 0,
  },
  accordionSummaryUnread: {
    paddingLeft: 16,
    paddingRight: 0,
    backgroundColor: "#3870A0",
  },
  accordionSummaryContent: {
    margin: "0 !important",
    display: "block",
  },
  expandIconMinimized: {
    color: "#ffffff",
    paddingRight: "10px",
    transform: "none",
  },
  expandIcon: {
    color: "#a9b4bb",
    transform: "none",
    paddingRight: "10px",
  },
  messageContainer: {
    position: "relative",
    height: "100%",
  },
  hr: {
    height: "0.1px",
    margin: "0 auto",
    width: "90%",
    background: "#707070",
    opacity: 0.5,
    alignSelf: "center",
    marginBottom: "5px",
  },
});

interface ChatRoomProps {
  roomId: number;
  index: number;
  connectionStatus: number;
}

/**
 * ChatRoom component
 * @param {ChatRoomProps} props Properties
 * @description ChatRoom component consists of sections - ChatRoomHeader, ChatContent and ChatInput
 */
const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId = -1,
  index = 0,
  connectionStatus = 1,
}) => {
  const { chatRooms, updateChatRooms, expandChatRoom } =
    useContext(ChatRoomsContext);
  const { companyRoomLists } = useContext(RoomListsContext);

  const chatRoom =
    chatRooms && chatRooms.find((room) => room.roomId === roomId);
  const { selectedCompany } = useContext(CompanyContext);
  const roomItem =
    companyRoomLists &&
    companyRoomLists
      .map((roomList) => roomList.rooms)
      .flat()
      .find((r) => r && r.id === chatRoom?.roomId);

  const [sendFailed, setSendFailed] = useState(false);

  // Default styling
  const classes = useStyles(index);

  // States
  const wrapperRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    /**
     * Alert if clicked on outside of chat room
     */
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (chatRoom) {
          chatRoom.focused = false;
          updateChatRooms(chatRoom);
        }
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, chatRoom, updateChatRooms]);

  useEffect(() => {
    const onLoseFocus = () => {
      if (chatRoom && "hidden" in document) {
        chatRoom.focused = false;
        updateChatRooms(chatRoom);
      }
    };

    document.addEventListener("visibilitychange", onLoseFocus);

    return () => {
      document.removeEventListener("visibilitychange", onLoseFocus);
    };
  }, [wrapperRef, chatRoom, updateChatRooms]);


  return (
    <>
      <Accordion
        data-testid="chat-room"
        ref={wrapperRef}
        expanded={chatRoom && chatRoom.expanded}
        classes={{
          root: classes.accordion,
          expanded: classes.accordionExpanded,
        }}
        onClick={() => {
          if (chatRoom) {
            chatRoom.focused = true;
            updateChatRooms(chatRoom);
          }
        }}
        onChange={(event: React.ChangeEvent<{}>, expand: boolean) => {
          if (chatRoom) {
            chatRoom.expanded = expand;
            expandChatRoom(
              chatRoom.roomId,
              selectedCompany ? selectedCompany.id : null,
              expand
            );
            updateChatRooms(chatRoom);
          }
        }}
      >
        <AccordionSummary
          classes={{
            root:
              chatRoom &&
              (!chatRoom.expanded || !chatRoom.focused || !chatRoom.scrollAtBottom) &&
              roomItem &&
              roomItem.unreadCount > 0
                ? classes.accordionSummaryUnread
                : classes.accordionSummary,
            content: classes.accordionSummaryContent,
          }}
        >
          <ChatRoomHeader
            chatRoom={chatRoom}
            connectionStatus={connectionStatus}
          />
        </AccordionSummary>
        <hr className={classes.hr} />
        <AccordionDetails className={classes.accordionDetails}>
          <div className={classes.messageContainer}>
            <ChatContent
              chatRoom={chatRoom}
              connectionStatus={connectionStatus}
            />
            <ChatInput
              chatRoom={chatRoom}
              setSendFailed={(flag) => setSendFailed(flag)}
              connectionStatus={connectionStatus}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ChatRoom;
