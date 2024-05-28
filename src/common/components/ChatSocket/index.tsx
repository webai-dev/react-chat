import React, { useState, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";
import {
  SocketMessage,
  SocketUpdateMessage,
  SocketReactionMessage,
  RoomItem,
} from "../../../types/types";

import { MeContext } from "../../hooks/useMe";
import { CompanyContext } from "../../hooks/useCompanies";
import { RoomListsContext } from "../../hooks/useRoomLists";
import { ChatRoomsContext } from "../../hooks/useChatRooms";

import {
  updateOnlineStatus,
  handleReceivedMessage,
  handleReadRoom,
  updateRoomLists,
  updateCompanyList,
} from "../../socket";

import { getRoomDetail } from "../../services/rooms";

import { v4 as uuidv4 } from "uuid";
import { handleAddReactions } from "../../socket/handleAddReactions";

interface ChatSocketProps {
  connectionStatus: number;
  setConnectionStatus: React.Dispatch<React.SetStateAction<number>>;
}

let socket: Socket;
let pingInterval: NodeJS.Timeout;

/**
 * ChatWidget component
 * @param {ChatWidgetProps} props Properties
 * @description ChatWidget component consists of ChatList and ChatRoom components
 */
const ChatSocket: React.FC<ChatSocketProps> = ({
  connectionStatus = 1,
  setConnectionStatus = () => null,
}) => {
  // States
  const { selectedCompany, companies, setCompanies } =
    useContext(CompanyContext);
  const { chatRooms, updateChatRooms } = useContext(ChatRoomsContext);
  const { me } = useContext(MeContext);
  const { companyRoomLists, setCompanyRoomLists, updateCompanyRoomLists } =
    useContext(RoomListsContext);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    socket = io("", {
      path: "/api/v1/chatinit/socket.io",
      forceNew: true,
      reconnectionAttempts: 3,
      transports: ["polling"],
      timeout: 2000,
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    });

    socket.on("connect", () => {
      socket.emit(
        JSON.stringify({
          method: "debug",
          uuid: uuidv4(),
        })
      );
      console.log("Connected", socket.connected);
      setConnectionStatus(1);
      setConnected(true);
    });

    if (socket) {
      let connectionInterval = setInterval(() => {
        if (!socket.connected) {
          setConnected(false);
          setConnectionStatus((prevValue) => (prevValue === -1 ? -1 : 0));
        } else if (socket.connected) {
          setConnected(true);
          setConnectionStatus(1);
        }
      }, 5000);
      return () => {
        clearInterval(connectionInterval);
      };
    }
  }, [setConnectionStatus]);

  useEffect(() => {
    if (socket && connected) {
      pingInterval = setInterval(() => {
        socket.emit("message", "ping");
      }, 30000);

      return () => {
        clearInterval(pingInterval);
      };
    } else if (socket && !connected) {
      let started = Date.now();

      // loop every 10 seconds
      let interval = setInterval(function () {
        if (socket.connected || connected) {
          setConnectionStatus(1);
          setConnected(true);
          clearInterval(interval);
        } else if (Date.now() - started > 540000 && !socket.connected) {
          setConnectionStatus(-1);

          // retry every 60 seconds after the 9 minuts have passed
          let interval2 = setInterval(function () {
            if (socket.connected) {
              clearInterval(interval);
              clearInterval(interval2);
            } else {
              socket.connect();
            }
          }, 60000);
        }
        // Retry connecting for first 2 minutes or after 5 minutes
        else if (
          Date.now() - started < 120000 ||
          (Date.now() - started > 420000 && Date.now() - started <= 540000)
        ) {
          socket.connect();
        }
      }, 10000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [connected, setConnectionStatus]);

  useEffect(() => {
    if (socket && connected) {
      socket.on("message", async (message: SocketMessage) => {
        console.log(message);
        if (message.body?.object?.type === "User") {
          setCompanyRoomLists(updateOnlineStatus(companyRoomLists, message));
        // @ts-ignore
        } else if (message.body?.object?.type === "Message" && message.body?.data && message.body?.data[0]?.property !== "reactions") {
          const chatRoom = chatRooms.find(
            (room) => room.roomId === message.body?.data?.roomID
          );

          let updatedCompanyRoomLists = [
            ...companyRoomLists
          ];

          if (chatRoom && me) {
            const updatedChatRoom = handleReceivedMessage(
              chatRoom,
              message,
              me,
              selectedCompany && selectedCompany.id,
              companyRoomLists
            );

            if (updatedChatRoom) {
              updateChatRooms(updatedChatRoom);
            }
          } else {
            let updatedCompanyRooms = companyRoomLists.find(
              (company) =>
                company.companyId === message.context?.company.companyID
            );

            let roomId = message.body?.data?.roomID;

            if (!updatedCompanyRooms) {
              updatedCompanyRooms = {
                companyId: message.context?.company.companyID || null,
                rooms: [],
                page: 0,
                size: 10,
                searchTerm: null,
                hasMore: false,
              }

              updatedCompanyRoomLists = [
                ...companyRoomLists,
                updatedCompanyRooms
              ];

              setCompanyRoomLists(updatedCompanyRoomLists);
            }

            let targetRoom = updatedCompanyRooms.rooms.find(
              (r) => r && r.id === roomId
            );

            if (targetRoom) {
              updatedCompanyRooms.rooms = [
                targetRoom,
                ...updatedCompanyRooms?.rooms.filter(
                  (r) => r && r.id !== roomId
                ),
              ];

            } else {
              let companyID = message.context?.company.companyID
                ? message.context?.company.companyID
                : 0;
              let roomID = message.context?.room.roomID
                ? message.context?.room.roomID
                : 0;

              const data = await getRoomDetail(companyID, roomID);

              if (data) {
                let lastActiveUsers = data.participants
                  .filter((d) => me && d.id !== me.id)
                  .map((d) => {
                    return { ...d, companyMembership: [] };
                  });
                let newRoom: RoomItem = {
                  id: data.id,
                  imageUrl: data.imageUrl,
                  lastMessage: data.lastMessage,
                  name: data.name,
                  lastReadMessageID: message.body?.data?.id
                    ? message.body?.data?.id
                    : null,
                  roomType: data.roomType,
                  unreadCount: data.unreadCount + 1,
                  lastActiveUsers: lastActiveUsers,
                };
                if (updatedCompanyRooms) {
                  updatedCompanyRooms.rooms = [
                    newRoom,
                    ...updatedCompanyRooms?.rooms.filter(
                      (r) => r && r.id !== roomId
                    ),
                  ];
                  updateCompanyRoomLists(updatedCompanyRooms);
                }
              }
            }
          }

          if (message.body?.data?.roomID) {
            const updatedRoomLists = updateRoomLists(
              updatedCompanyRoomLists,
              chatRooms,
              message.body?.data?.roomID,
              message,
              me
            );
            setCompanyRoomLists(updatedRoomLists);
          }

          const updatedCompanies = updateCompanyList(
            updatedCompanyRoomLists,
            companies,
            chatRooms,
            message.body?.data?.companyID || null,
            message,
            me
          );

          localStorage.setItem("companies", JSON.stringify(updatedCompanies));
          setCompanies(updatedCompanies);
        }
      });

      return () => {
        socket.off();
      };
    }
  }, [
    chatRooms,
    me,
    companyRoomLists,
    connected,
    companies,
    selectedCompany,
    setCompanies,
    setCompanyRoomLists,
    updateChatRooms,
  ]);

  useEffect(() => {
    if (socket && connected) {
      socket.on("message", async (message: SocketUpdateMessage) => {
        // @ts-ignore
        if (message.body?.object?.type === "Room" && message.body?.data?.length && message.body?.data[0].property !== 'participants') {
          const chatRoom = chatRooms.find(
            (room) => room.roomId === message.body?.object?.id
          );
          if (chatRoom && me) {
            const updatedChatRoom = handleReadRoom(
              chatRoom,
              message,
              me,
              selectedCompany && selectedCompany.id
            );

            if (updatedChatRoom) {
              updateChatRooms(updatedChatRoom);
            }
          }
        }
      });

      return () => {
        socket.off();
      };
    }
  }, [
    chatRooms,
    me,
    companyRoomLists,
    connected,
    selectedCompany,
    updateChatRooms,
  ]);

  useEffect(() => {
    if (socket && connected) {
      socket.on("message", async (message: SocketReactionMessage) => {
        if (message.body?.object?.type === "Message") {
          if (chatRooms && me) {
            chatRooms.forEach((room) => {
              const updatedChatRoom = handleAddReactions(
                room,
                message,
                me,
                selectedCompany && selectedCompany.id
              );
              if (updatedChatRoom) {
                updateChatRooms(updatedChatRoom);
              }
            });
          }
        }
      });

      return () => {
        socket.off();
      };
    }
  }, [
    chatRooms,
    me,
    companyRoomLists,
    connected,
    selectedCompany,
    updateChatRooms,
  ]);

  return null;
};

export default ChatSocket;
