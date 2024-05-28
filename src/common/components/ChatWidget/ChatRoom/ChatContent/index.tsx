import React, { useRef, useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import ChatContentItem from "./ChatContentItem";
import Box from "@material-ui/core/Box";
import ChatService from "../../../../services/chat";
import { ActiveUser, ChatRoom, RoomDetail } from "../../../../../types/types";
import { CompanyContext } from "../../../../hooks/useCompanies";
import { ChatRoomsContext } from "../../../../hooks/useChatRooms";
import { RoomListsContext } from "../../../../hooks/useRoomLists";
import { getRoomDetail } from "../../../../services/rooms";
import { MeContext } from "../../../../hooks/useMe";

import One2OneReadSign from "./One2OneReadSign";
import GroupReadSign from "./GroupReadSign";

// Global styles
export const useStyles = makeStyles({
  root: {
    overflowY: "auto",
    justifyContent: "flex-end",
    height: "320px",
    padding: "5px 15px",
    bottom: "75px",
  },
  loading: {
    fontSize: "12px",
    color: "#555555",
    letterSpacing: "0px",
    textAlign: "center",
  },
  loadingWrapper: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  reactionsLeft: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  reactionsRight: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-end",
  },
  chatItemWrapper: {
    paddingTop: 15,
  },
  readUsers: {
    marginTop: "5px",
    marginRight: "5px",
    width: "100%",
    height: "14px",
    display: "flex",
    justifyContent: "flex-end",
    fontSize: 13,
    cursor: 'pointer',
  },
  readUsersImage: {
    borderRadius: "50%",
    border: "1px solid #cccccc",
  },
});

interface ChatContentProps {
  chatRoom: ChatRoom | null | undefined;
  connectionStatus: number;
}

/**
 * ChatContent component
 * @param {ChatContentProps} props Properties
 * @description ChatContent component consists of list of ChatContentItem components
 */
const ChatContent: React.FC<ChatContentProps> = ({
  chatRoom = null,
  connectionStatus = 1,
}) => {
  // Default styling
  const classes = useStyles();
  const { markAsRead } = ChatService;
  const { companies, setCompanies } =
    useContext(CompanyContext);
  const { loadPrevPage, loadNextPage, initializeChatRoom, updateChatRooms } =
    useContext(ChatRoomsContext);
  const { me } = useContext(MeContext);
  const {
    activeRoomList,
    companyRoomLists,
    getRoomItemById,
    updateCompanyRoomLists,
  } = useContext(RoomListsContext);
  const messageRoomRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  useEffect(() => {
    if (messageRoomRef && messageRoomRef.current && chatRoom && chatRoom.newMessageFromMe) {
      chatRoom.newMessageFromMe = false;
      messageRoomRef.current.scrollTop = messageRoomRef.current.scrollHeight;
      updateChatRooms(chatRoom);
    }
  }, [chatRoom?.newMessageFromMe, messageRoomRef]);

  useEffect(() => {
    if (messageRoomRef && messageRoomRef.current && chatRoom && chatRoom.newMessageFromOther) {
      chatRoom.newMessageFromOther = false;
      if (chatRoom.visible && chatRoom.focused && chatRoom.expanded && messageRoomRef.current.scrollTop + messageRoomRef.current.clientHeight + 73 > messageRoomRef.current.scrollHeight - 10) {
        messageRoomRef.current.scrollTop = messageRoomRef.current.scrollHeight;
      }
      updateChatRooms(chatRoom);
    }
  }, [chatRoom?.newMessageFromOther, messageRoomRef]);

  useEffect(() => {
    if (chatRoom && messageRoomRef.current) {
      if (messageRoomRef.current.scrollTop + messageRoomRef.current.clientHeight > messageRoomRef.current.scrollHeight - 10) {
        chatRoom.scrollAtBottom = true;
      } else {
        chatRoom.scrollAtBottom = false;
      }
      updateChatRooms(chatRoom);

    }
  }, [chatRoom, messageRoomRef.current?.scrollTop]);

  useEffect(() => {
    if (me && chatRoom && !chatRoom.initialized) {
      initializeChatRoom(chatRoom.roomId).then(() => {
        setDetailLoading(true);
        getRoomDetail(chatRoom.companyId, chatRoom.roomId).then(
          (data: RoomDetail | null) => {
            chatRoom.participants = data?.participants;
            chatRoom.roomType = data?.roomType;

            const participant = chatRoom.participants?.find(p => p.id === me?.id);
            const lastMessage = chatRoom.messages[chatRoom.messages.length - 1];

            if(participant && lastMessage && participant.lastReadMessageID === lastMessage.id) {
              messageRoomRef.current.scrollTop = messageRoomRef.current.scrollHeight;
              chatRoom.scrollPosition = messageRoomRef.current.scrollHeight;
            } else if (participant) {
              const message = document.getElementById(
                  `message-${participant.lastReadMessageID}`
              );

              if (message && messageRoomRef.current) {
                messageRoomRef.current.scrollTop = message.offsetTop;
                chatRoom.scrollPosition = message.offsetTop;
              }
            }

            updateChatRooms(chatRoom);

            if (messageRoomRef.current) {
              const { scrollHeight } = messageRoomRef.current;
              if (scrollHeight <= 330 && chatRoom) {
                markRoomRead(chatRoom);
              }
            }
            setDetailLoading(false);
          }
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoom, me]);

  useEffect(() => {
    if (chatRoom && chatRoom.initialized) {
      messageRoomRef.current.scrollTop = chatRoom.scrollPosition || 0;
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoom]);

  const markRoomRead = async (chatRoom: ChatRoom) => {
    const company = companies.find((c) => c.id === chatRoom.companyId);
    const room = companyRoomLists
      .map((roomList) => roomList.rooms)
      .flat()
      .find((room) => room && room.id === chatRoom.roomId);

    if (chatRoom.focused && chatRoom.expanded && chatRoom.visible) {
      if (activeRoomList && activeRoomList.rooms) {
        const room = activeRoomList.rooms.find(
          (room) => room && room.id === chatRoom.roomId
        );

        if (room && chatRoom.messages && chatRoom.messages.length > 0) {
          room.lastReadMessageID = chatRoom.messages[
            chatRoom.messages.length - 1
          ]
            ? chatRoom.messages[chatRoom.messages.length - 1].id
            : -1;
          room.unreadCount = 0;
        }

        updateCompanyRoomLists({ ...activeRoomList });
      }
      if (company && room) {
        let totalUnreadCount = 0;
        companyRoomLists.forEach((room) => {
          if (room.companyId === company.id) {
            room.rooms &&
              room.rooms.forEach((r) => {
                if (r.unreadCount > 0) {
                  totalUnreadCount += 1;
                }
              });
          }
        });

        company.unreadCount = totalUnreadCount;
        localStorage.setItem("companies", JSON.stringify([...companies]));
        setCompanies([...companies]);
      }
      await markAsRead(chatRoom.companyId, chatRoom.roomId);
    }
  };

  const handleScroll = async () => {
    if (chatRoom && messageRoomRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = messageRoomRef.current;

      chatRoom.scrollPosition = scrollTop;
      if (chatRoom.prevHasMore && !chatRoom.loadingPrev && scrollTop === 0) {
        loadPrevPage(chatRoom.roomId).then((messages) => {
          if (messageRoomRef.current) {
            messageRoomRef.current.scrollTop = messages.length * 63 + 1;
          }
        });
      } else if (
        chatRoom.nextHasMore &&
        !chatRoom.loadingNext &&
        scrollTop + clientHeight === scrollHeight
      ) {
        const room = getRoomItemById(chatRoom.roomId);
        if (
          chatRoom.messages[chatRoom.messages.length - 1] &&
          room?.lastReadMessageID !==
            chatRoom.messages[chatRoom.messages.length - 1].id
        ) {
          const company = companies.find(
            (c) => c && c.id === chatRoom.companyId
          );
          const room = companyRoomLists
            .map((roomList) => roomList.rooms)
            .flat()
            .find((room) => room && room.id === chatRoom.roomId);
          if (chatRoom.focused && chatRoom.expanded && chatRoom.visible) {
            if (activeRoomList && activeRoomList.rooms) {
              const room = activeRoomList.rooms.find(
                (room) => room && room.id === chatRoom.roomId
              );

              if (room) {
                room.lastReadMessageID = chatRoom.messages[
                  chatRoom.messages.length - 1
                ]
                  ? chatRoom.messages[chatRoom.messages.length - 1].id
                  : -1;
                room.unreadCount = 0;
              }

              updateCompanyRoomLists({ ...activeRoomList });
            }
            if (company && room) {
              let totalUnreadCount = 0;
              companyRoomLists.forEach((room) => {
                if (room.companyId === company.id) {
                  room.rooms &&
                    room.rooms.forEach((r) => {
                      if (r && r.unreadCount > 0) {
                        totalUnreadCount += 1;
                      }
                    });
                }
              });

              company.unreadCount = totalUnreadCount;

              localStorage.setItem("companies", JSON.stringify([...companies]));
              setCompanies([...companies]);
            }

            await markAsRead(chatRoom.companyId, chatRoom.roomId);
          }
        }

        loadNextPage(chatRoom.roomId).then((messages) => {
          if (messageRoomRef.current) {
            messageRoomRef.current.scrollTop =
              messageRoomRef.current.scrollHeight - messages.length * 63 - 1;
          }
        });
        chatRoom.messages.forEach((message) => (message.new = false));
      } else if (scrollTop + clientHeight === scrollHeight) {
        markRoomRead(chatRoom);
        // await markAsRead(chatRoom.companyId, chatRoom.roomId);
      }
    }
  };

  const participant = chatRoom?.participants?.find((participant: ActiveUser) => participant.id !== me?.id);
  const singleReadPosition = participant && chatRoom?.roomType !== 0 ? participant.lastReadMessageID : -1;
  let groupReadPosition: any = {};
  let groupAllReadPosition = -1;

  if (chatRoom && chatRoom.roomType === 0) {
    chatRoom.participants?.forEach((participant: ActiveUser) => {
      const messageID = participant.lastReadMessageID ? participant.lastReadMessageID.toString() : '-1';

      if (messageID !== '-1' && participant.id !== me?.id) {
        if (groupReadPosition[messageID]) {
          groupReadPosition[messageID].push(participant.id);
        } else {
          groupReadPosition[messageID] = [participant.id];
        }
      }
    });

    const sortedIds = Object.keys(groupReadPosition).map(id => parseInt(id)).sort((a, b) => a > b ? 1 : -1);
    let sum = 0;

    for (let i = 0; i < sortedIds.length; i++) {
      sum += groupReadPosition[sortedIds[i]].length;
      if (sum === ((chatRoom.participants?.length || 1) - 2)) {
        groupAllReadPosition = sortedIds[i];
        break;
      }
    }
  }

  return (
    <>
      <div
        data-testid="chat-content"
        className={classes.root}
        ref={messageRoomRef}
        onScroll={handleScroll}
      >
        {(chatRoom?.loadingPrev && detailLoading) && (
          <Box
            display="flex"
            flex={1}
            height={90}
            justifyContent="center"
            alignItems="center"
          >
            <p className={classes.loading}>Loading history...</p>
          </Box>
        )}
        {chatRoom &&
          (chatRoom.messages || [])
            .map((message, index) => (
              <React.Fragment>
                <div
                  id={`message-${message.id || message.trackingID}`}
                  key={index}
                  className={classes.chatItemWrapper}
                >
                  {
                     detailLoading && (
                        <Box className={classes.loadingWrapper}>
                          <p className={classes.loading}>Loading history...</p>
                        </Box>
                     )
                  }
                  <ChatContentItem
                    message={message}
                    connectionStatus={connectionStatus}
                    roomId={chatRoom.roomId}
                    companyId={chatRoom.companyId ? chatRoom.companyId : null}
                    singleReadPosition={singleReadPosition}
                    groupReadPosition={groupReadPosition}
                    groupAllReadPosition={groupAllReadPosition}
                    roomType={chatRoom.roomType}
                  />
                </div>
                {
                  (chatRoom?.roomType !== 0 && message.id === singleReadPosition) && (
                    <One2OneReadSign
                      chatRoom={chatRoom}
                      me={me}
                    />
                  )
                }
                {
                  (chatRoom?.roomType === 0 && groupReadPosition[message.id]) && (
                    <GroupReadSign
                      participants={chatRoom?.participants}
                      groupReadPosition={groupReadPosition}
                      message={message}
                    />
                  )
                }
              </React.Fragment>
            ))}
        {chatRoom?.loadingNext && (
          <Box
            display="flex"
            flex={1}
            height={90}
            justifyContent="center"
            alignItems="center"
          >
            <p className={classes.loading}>Loading history...</p>
          </Box>
        )}
      </div>
    </>
  );
};

export default ChatContent;
