import React, {useState, useContext, useRef, useEffect} from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SendIcon from "@material-ui/icons/Send";
import chat from "../../../../services/chat";
import { ChatRoom } from "../../../../../types/types";
import { MeContext } from "../../../../hooks/useMe";
import { CompanyContext } from "../../../../hooks/useCompanies";
import { ChatRoomsContext } from "../../../../hooks/useChatRooms";
import { RoomListsContext } from "../../../../hooks/useRoomLists";
import { v4 as uuidv4 } from "uuid";
import InputEmoji from "react-input-emoji";
import { NewMessage } from "../../../../../types";

// Global styles
export const useStyles = makeStyles({
  icon: {
    width: "31px",
    height: "31px",
    padding: "0 10px",
    cursor: "pointer",
  },
  input: {
    outline: "none",
    height: "39px",
    width: "100%",
    padding: "0 10px",
    border: "1px solid #D6D6D6",
  },
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "55px",
    padding: "5px 15px",

    color: "#3870A0",
    bottom: 0,
    fontSize: "24px",
  },
});

interface ChatInputProps {
  chatRoom: ChatRoom | null | undefined;
  connectionStatus: number;
  setSendFailed: (flag: boolean) => void;
}

/**
 * ChatInput component
 * @param {ChatInputProps} props Properties
 * @description ChatInput component consists of input box and send button
 */
const ChatInput: React.FC<ChatInputProps> = ({
  chatRoom = null,
  connectionStatus = 1,
  setSendFailed,
}) => {
  // Default styling
  const classes = useStyles();
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const { sendMessage } = chat;
  const { me } = useContext(MeContext);
  const { selectedCompany } = useContext(CompanyContext);
  const { updateChatRooms } = useContext(ChatRoomsContext);
  const { companyRoomLists } = useContext(RoomListsContext);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleChange = (e: string) => {
    setMessage(e);
  };

  // useEffect(() => {
  //   console.log(connectionStatus);
  // }, [connectionStatus]);

  const handleSend = async () => {
    let data = {
      message: message,
      trackingID: uuidv4(),
      sentAt: new Date(),
    };
    setIsSending(true);
    setMessage("");
    if (chatRoom && me) {
      chatRoom.messages = [
        ...chatRoom.messages,
        {
          id: 0,
          message: message,
          messageType: 0,
          readBy: me.id,
          sentAt: data.sentAt.toString(),
          trackingID: data.trackingID,
          user: {
            id: me.id,
            firstName: me.firstName,
            lastName: me.lastName,
            isOnline: true,
            companyMembership: [],
          },
          new: true,
          check: "sent",
        },
      ];
      chatRoom.newMessageFromMe = true;

      updateChatRooms(chatRoom);
    }
    let updatedCompanyRooms = companyRoomLists.find(
      (company) => selectedCompany && company.companyId === selectedCompany.id
    );
    if (updatedCompanyRooms && updatedCompanyRooms.rooms) {
      let targetRoom = updatedCompanyRooms.rooms.find(
        (r) => chatRoom && r && r.id === chatRoom.roomId
      );
      if (targetRoom) {
        updatedCompanyRooms.rooms = [
          targetRoom,
          ...updatedCompanyRooms?.rooms.filter(
            (r) => chatRoom && r && r.id !== chatRoom.roomId
          ),
        ];
      }
    }
    if (connectionStatus === 1) {
      const response = await sendMessage(
        selectedCompany && selectedCompany.id,
        chatRoom?.roomId,
        data
      );
      if (!response && chatRoom?.messages) {
        chatRoom.messages = chatRoom?.messages.map((m) =>
          m.id === 0 ? { ...m, check: "failed" } : m
        );
      }
    } else {
      let response: NewMessage | null = null;
      if (!(connectionStatus === 1)) {
        response = await sendMessage(
            selectedCompany && selectedCompany.id,
            chatRoom?.roomId,
            data
        );

        if (response) {
          if (chatRoom?.messages) {
            chatRoom.messages = chatRoom?.messages.map((m) =>
                m.id === 0 ? { ...m, check: "received" } : m
            );
            updateChatRooms(chatRoom);
          }
        } else {
          let started = Date.now();
          // loop every 10 seconds
          let interval = setInterval(async function () {
            if (Date.now() - started > 46000) {
              clearInterval(interval);
              if (chatRoom?.messages) {
                chatRoom.messages = chatRoom?.messages.map((m) =>
                    m.id === 0 ? { ...m, check: "failed" } : m
                );
                setSendFailed(true);
              }
            }
            // Retry sending message for first 2 minutes or after 5 minutes
            else {
              // let response = connectionStatus === 1 ? 1 : 0;
              if (response) {
                if (chatRoom?.messages) {
                  chatRoom.messages = chatRoom?.messages.map((m) =>
                      m.id === 0 ? { ...m, check: "received" } : m
                  );
                  updateChatRooms(chatRoom);
                }
                setSendFailed(false);
                clearInterval(interval);
              } else {
                response = await sendMessage(
                    selectedCompany && selectedCompany.id,
                    chatRoom?.roomId,
                    data
                );
              }
            }
          }, 15000);
        }

      }
    }
    setIsSending(false);
  };

  useEffect(() => {
    if(isSending)
      inputRef.current.focus();
  }, [inputRef.current]);

  return (
    <>
      <Container data-testid="chat-input" className={classes.root}>
        <InputEmoji
          value={message}
          className={classes.input}
          onChange={handleChange}
          cleanOnEnter
          onEnter={() => {
            handleSend();
            // inputRef.current.autofocus = true;
          }}
          placeholder="Message"
          ref={inputRef}
        />

        <SendIcon onClick={handleSend} className={classes.icon} />
      </Container>
    </>
  );
};

export default ChatInput;
