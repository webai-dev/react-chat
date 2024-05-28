import { useState, createContext, useEffect } from "react";
import { useCompanies } from "../hooks/useCompanies";
import { getMessages } from "../services/chat";
// import { createTeamChat } from "../services/teams";
import { UseChatRooms, ChatRoom, ChatMessage } from "../../types/types";

export const useChatRooms = () => {
  const companyContext = useCompanies();
  let [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  let [activeRoomId, setActiveRoomId] = useState<number>(-1);
  const { selectedCompany } = companyContext;

  const addChatRoom = (roomId: number, companyId: number | null) => {
    const chatRoom = chatRooms.find((room) => room.roomId === roomId);

    if (chatRoom) {
      chatRoom.focused = true;
      chatRoom.visible = true;
      let chatRoomsLocal = localStorage.getItem("chatRooms");
      if (chatRoomsLocal) {
        if (companyId) {
          let id = companyId.toString();
          let newChatRooms = JSON.parse(chatRoomsLocal);
          if (newChatRooms[id.toString()]) {
            if (
              !newChatRooms[id.toString()]
                .map((room: number[]) => room[0])
                .includes(roomId)
            ) {
              newChatRooms[id.toString()].push([
                roomId,
                chatRoom.expanded ? 1 : 0,
              ]);
              // newChatRooms[id.toString()].push(roomId);
            }
          } else {
            // newChatRooms[id.toString()] = [roomId];
            newChatRooms[id.toString()] = [[roomId, chatRoom.expanded ? 1 : 0]];
          }

          localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
        } else {
          let id = "-1";
          let newChatRooms = JSON.parse(chatRoomsLocal);
          if (newChatRooms[id.toString()]) {
            if (
              !newChatRooms[id.toString()]
                .map((room: number[]) => room[0])
                .includes(roomId)
            ) {
              newChatRooms[id.toString()].push([
                roomId,
                chatRoom.expanded ? 1 : 0,
              ]);
              // newChatRooms[id.toString()].push(roomId);
            }
          } else {
            newChatRooms[id.toString()] = [[roomId, chatRoom.expanded ? 1 : 0]];
            // newChatRooms[id.toString()] = [roomId];
          }

          localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
        }
      } else {
        if (companyId !== null) {
          let id = companyId.toString();
          let newRoom: any = {};
          // newRoom[id] = [roomId];
          newRoom[id] = [[roomId, chatRoom.expanded ? 1 : 0]];
          localStorage.setItem("chatRooms", JSON.stringify(newRoom));
        } else if (companyId === null) {
          let id = "-1";
          let newRoom: any = {};
          // newRoom[id] = [roomId];
          newRoom[id] = [[roomId, chatRoom.expanded ? 1 : 0]];
          localStorage.setItem("chatRooms", JSON.stringify(newRoom));
        }
      }
      updateChatRooms(chatRoom);
    } else {
      const updatedChatRooms = {
        roomId,
        companyId,
        loadingPrev: true,
        prevHasMore: true,
        nextHasMore: true,
        visible: true,
        focused: true,
        expanded: true,
        messages: [],
      };
      let chatRoomsLocal = localStorage.getItem("chatRooms");
      if (chatRoomsLocal) {
        if (companyId) {
          let id = companyId.toString();
          let newChatRooms = JSON.parse(chatRoomsLocal);
          if (newChatRooms[id.toString()]) {
            if (
              !newChatRooms[id.toString()]
                .map((room: number[]) => room[0])
                .includes(roomId)
            ) {
              newChatRooms[id.toString()].push([roomId, 1]);
              // newChatRooms[id.toString()].push(roomId);
            }
          } else {
            newChatRooms[id.toString()] = [[roomId, 1]];
            // newChatRooms[id.toString()] = [roomId];
          }

          localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
        } else {
          let id = "-1";
          let newChatRooms = JSON.parse(chatRoomsLocal);
          if (newChatRooms[id.toString()]) {
            if (
              !newChatRooms[id.toString()]
                .map((room: number[]) => room[0])
                .includes(roomId)
            ) {
              newChatRooms[id.toString()].push([roomId, 1]);
              // newChatRooms[id.toString()].push(roomId);
            }
          } else {
            newChatRooms[id.toString()] = [[roomId, 1]];
            // newChatRooms[id.toString()] = [roomId];
          }

          localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
        }
      } else {
        if (companyId !== null) {
          let id = companyId.toString();
          let newRoom: any = {};
          // newRoom[id] = [roomId];
          newRoom[id] = [[roomId, 1]];
          localStorage.setItem("chatRooms", JSON.stringify(newRoom));
        } else if (companyId === null) {
          let id = "-1";
          let newRoom: any = {};
          // newRoom[id] = [roomId];
          newRoom[id] = [[roomId, 1]];
          localStorage.setItem("chatRooms", JSON.stringify(newRoom));
        }
      }
      setChatRooms([...chatRooms, updatedChatRooms]);
    }
  };

  const addChatRooms = (roomIds: Array<number[]>, companyId: number | null) => {
    // console.log("IDs", roomIds);
    let updatedChatRoomsList: ChatRoom[] = [];
    roomIds.forEach(([roomId, expanded]) => {
      const chatRoom = chatRooms.find((room) => room.roomId === roomId);

      if (chatRoom) {
        chatRoom.focused = true;
        chatRoom.visible = true;
        chatRoom.expanded = expanded === 1 ? true : false;
        let chatRoomsLocal = localStorage.getItem("chatRooms");
        if (chatRoomsLocal) {
          if (companyId) {
            let id = companyId.toString();
            let newChatRooms = JSON.parse(chatRoomsLocal);
            if (newChatRooms[id.toString()]) {
              if (
                !newChatRooms[id.toString()]
                  .map((room: number[]) => room[0])
                  .includes(roomId)
              ) {
                newChatRooms[id.toString()].push([roomId, expanded]);
                // newChatRooms[id.toString()].push(roomId);
              }
            } else {
              newChatRooms[id.toString()] = [[roomId, expanded]];
              // newChatRooms[id.toString()] = [roomId];
            }
            localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
          } else {
            let id = "-1";
            let newChatRooms = JSON.parse(chatRoomsLocal);
            if (newChatRooms[id.toString()]) {
              if (
                !newChatRooms[id.toString()]
                  .map((room: number[]) => room[0])
                  .includes(roomId)
              ) {
                newChatRooms[id.toString()].push([roomId, expanded]);
                // newChatRooms[id.toString()].push(roomId);
              }
            } else {
              newChatRooms[id.toString()] = [[roomId, expanded]];
              // newChatRooms[id.toString()] = [roomId];
            }
            localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
          }
        } else {
          if (companyId !== null) {
            let id = companyId.toString();
            let newRoom: any = {};
            // newRoom[id] = [roomId];
            newRoom[id] = [[roomId, expanded]];
            localStorage.setItem("chatRooms", JSON.stringify(newRoom));
          } else if (companyId === null) {
            let id = "-1";
            let newRoom: any = {};
            // newRoom[id] = [roomId];
            newRoom[id] = [[roomId, expanded]];
            localStorage.setItem("chatRooms", JSON.stringify(newRoom));
          }
        }
        updatedChatRoomsList.push(chatRoom);
      } else {
        const updatedChatRooms = {
          roomId,
          companyId,
          loadingPrev: true,
          prevHasMore: true,
          nextHasMore: true,
          visible: true,
          focused: true,
          expanded: expanded === 1 ? true : false,
          messages: [],
        };
        let chatRoomsLocal = localStorage.getItem("chatRooms");
        if (chatRoomsLocal) {
          if (companyId) {
            let id = companyId.toString();
            let newChatRooms = JSON.parse(chatRoomsLocal);
            if (newChatRooms[id.toString()]) {
              if (
                !newChatRooms[id.toString()]
                  .map((room: number[]) => room[0])
                  .includes(roomId)
              ) {
                newChatRooms[id.toString()].push([roomId, expanded]);
                // newChatRooms[id.toString()].push(roomId);
              }
            } else {
              newChatRooms[id.toString()] = [[roomId, expanded]];
              // newChatRooms[id.toString()] = [roomId];
            }
            localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
          } else {
            let id = "-1";
            let newChatRooms = JSON.parse(chatRoomsLocal);
            if (newChatRooms[id.toString()]) {
              if (
                !newChatRooms[id.toString()]
                  .map((room: number[]) => room[0])
                  .includes(roomId)
              ) {
                newChatRooms[id.toString()].push([roomId, expanded]);
                // newChatRooms[id.toString()].push(roomId);
              }
            } else {
              newChatRooms[id.toString()] = [[roomId, expanded]];
              // newChatRooms[id.toString()] = [roomId];
            }
            localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
          }
        } else {
          if (companyId !== null) {
            let id = companyId.toString();
            let newRoom: any = {};
            // newRoom[id] = [roomId];
            newRoom[id] = [[roomId, expanded]];
            localStorage.setItem("chatRooms", JSON.stringify(newRoom));
          } else if (companyId === null) {
            let id = "-1";
            let newRoom: any = {};
            // newRoom[id] = [roomId];
            newRoom[id] = [[roomId, expanded]];
            localStorage.setItem("chatRooms", JSON.stringify(newRoom));
          }
        }

        updatedChatRoomsList.push(updatedChatRooms);
        // setChatRooms([...chatRooms, updatedChatRooms]);
      }
    });

    setChatRooms(updatedChatRoomsList);
  };

  useEffect(() => {
    const item = localStorage.getItem("chatRooms");
    const selectedCompanyLocal = localStorage.getItem("selectedCompany");

    if (item && selectedCompanyLocal) {
      let roomsList = JSON.parse(item);
      if (JSON.parse(selectedCompanyLocal).id === null) {
        addChatRooms(
          roomsList["-1"] ? roomsList["-1"] : [],
          JSON.parse(selectedCompanyLocal).id
        );
      } else if (JSON.parse(selectedCompanyLocal).id) {
        addChatRooms(
          roomsList[JSON.parse(selectedCompanyLocal).id.toString()]
            ? roomsList[JSON.parse(selectedCompanyLocal).id.toString()]
            : [],
          JSON.parse(selectedCompanyLocal).id
        );
      }
    }
  }, [selectedCompany]);

  const hideChatRoom = (roomId: number, companyId: number | null) => {
    const chatRoom = chatRooms.find((room) => room.roomId === roomId);

    if (chatRoom) {
      chatRoom.focused = false;
      chatRoom.visible = false;
      chatRoom.expanded = true;
      let chatRoomsLocal = localStorage.getItem("chatRooms");
      if (chatRoomsLocal) {
        if (companyId) {
          let id = companyId.toString();
          let newChatRooms = JSON.parse(chatRoomsLocal);
          if (newChatRooms[id.toString()]) {
            newChatRooms[id.toString()] = newChatRooms[id.toString()].filter(
              (c: number[]) => c[0] !== roomId
            );
          } else {
            newChatRooms[id.toString()] = [];
          }

          localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
        } else {
          let id = "-1";
          let newChatRooms = JSON.parse(chatRoomsLocal);
          if (newChatRooms[id.toString()]) {
            newChatRooms[id.toString()] = newChatRooms[id.toString()].filter(
              (c: number[]) => c[0] !== roomId
            );
          } else {
            newChatRooms[id.toString()] = [];
          }

          localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
        }
      }

      // if (chatRoomsLocal) {
      //   let newChatRooms = JSON.parse(chatRoomsLocal);
      //   if (newChatRooms.includes(roomId)) {
      //     localStorage.setItem(
      //       "chatRooms",
      //       JSON.stringify(newChatRooms.filter((c: number) => c !== roomId))
      //     );
      //   }
      // } else {
      //   localStorage.setItem("chatRooms", JSON.stringify({}));
      // }
      updateChatRooms(chatRoom);
    }
  };

  const expandChatRoom = (
    roomId: number,
    companyId: number | null,
    expanded: boolean
  ) => {
    const chatRoom = chatRooms.find((room) => room.roomId === roomId);

    if (chatRoom) {
      chatRoom.expanded = expanded;
      let chatRoomsLocal = localStorage.getItem("chatRooms");
      if (chatRoomsLocal) {
        if (companyId) {
          let id = companyId.toString();
          let newChatRooms = JSON.parse(chatRoomsLocal);
          if (newChatRooms[id.toString()]) {
            newChatRooms[id.toString()] = newChatRooms[id.toString()].map(
              (c: number[]) => {
                if (c[0] !== roomId) {
                  return c;
                } else {
                  return [c[0], expanded ? 1 : 0];
                }
              }
            );
          }

          localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
        } else {
          let id = "-1";
          let newChatRooms = JSON.parse(chatRoomsLocal);
          if (newChatRooms[id.toString()]) {
            newChatRooms[id.toString()] = newChatRooms[id.toString()].map(
              (c: number[]) => {
                if (c[0] !== roomId) {
                  return c;
                } else {
                  return [c[0], expanded ? 1 : 0];
                }
              }
            );
          }

          localStorage.setItem("chatRooms", JSON.stringify(newChatRooms));
        }
      }
      updateChatRooms(chatRoom);
    }
  };

  const hideAllRoom = (companyId: number | null = null) => {
    // console.log(
    //   "B",
    //   chatRooms.filter((room) => {
    //     return room.companyId !== companyId;
    //   })
    // );

    setChatRooms([]);
  };

  const initializeChatRoom = (roomId: number) => {
    const chatRoom = chatRooms.find((room) => room.roomId === roomId);

    return new Promise<void>((resolve, reject) => {
      if (chatRoom) {
        getMessages(chatRoom.roomId, chatRoom.companyId, "unread")
          .then((messages) => {
            if (messages) {
              chatRoom.messages = messages.reverse();
              chatRoom.initialized = true;
              chatRoom.loadingPrev = false;
              updateChatRooms(chatRoom);
              resolve();
            }
          })
          .catch(() => {
            chatRoom.loadingPrev = false;
            updateChatRooms(chatRoom);
            reject();
          });
      }
    });
  };

  const updateChatRooms = (chatRoom: ChatRoom) => {
    const updatedChatRooms = chatRooms.map((room) => {
      if (room.roomId === chatRoom.roomId) {
        return chatRoom;
      } else {
        return room;
      }
    });

    setChatRooms(updatedChatRooms);
  };

  const loadPrevPage = (roomId: number) => {
    const chatRoom = chatRooms.find((room) => room.roomId === roomId);

    return new Promise<ChatMessage[]>((resolve, reject) => {
      if (chatRoom && chatRoom.messages && chatRoom.messages.length > 0) {
        setLoadingPrev(chatRoom, true);

        getMessages(
          chatRoom.roomId,
          chatRoom.companyId,
          "",
          chatRoom.messages[0].id,
          "up"
        )
          .then((messages) => {
            if (messages) {
              messages.reverse();
              chatRoom.messages = [...messages, ...chatRoom.messages];
              chatRoom.loadingPrev = false;
              if (messages.length === 0) {
                chatRoom.prevHasMore = false;
              }

              updateChatRooms(chatRoom);
              resolve(messages);
            } else {
              reject();
            }
          })
          .catch(() => {
            chatRoom.loadingPrev = false;
            updateChatRooms(chatRoom);
            reject();
          });
      }
    });
  };

  const loadNextPage = (roomId: number) => {
    const chatRoom = chatRooms.find((room) => room.roomId === roomId);

    return new Promise<ChatMessage[]>((resolve, reject) => {
      if (chatRoom) {
        setLoadingNext(chatRoom, true);

        getMessages(
          chatRoom.roomId,
          chatRoom.companyId,
          "",
          chatRoom.messages[chatRoom.messages.length - 1]
            ? chatRoom.messages[chatRoom.messages.length - 1].id
            : -1,
          "down"
        )
          .then((messages) => {
            if (messages) {
              messages.reverse();
              chatRoom.messages = [...chatRoom.messages, ...messages];
              chatRoom.loadingNext = false;
              if (messages.length === 0) {
                chatRoom.nextHasMore = false;
              }

              updateChatRooms(chatRoom);
              resolve(messages);
            } else {
              reject();
            }
          })
          .catch(() => {
            chatRoom.loadingNext = false;
            updateChatRooms(chatRoom);
            reject();
          });
      }
    });
  };

  const setLoadingPrev = (chatRoom: ChatRoom, loading: boolean) => {
    chatRoom.loadingPrev = loading;
    updateChatRooms(chatRoom);
  };

  const setLoadingNext = (chatRoom: ChatRoom, loading: boolean) => {
    chatRoom.loadingNext = loading;
    updateChatRooms(chatRoom);
  };

  const removeFailedMessage = (roomId: number, trackingID: string) => {
    const chatRoom = chatRooms.find((room) => room.roomId === roomId);

    if (chatRoom) {
      chatRoom.messages = chatRoom.messages.filter(
        (message) => message.trackingID !== trackingID
      );
      console.log(chatRoom.messages);
      updateChatRooms(chatRoom);
    }
  };

  return {
    chatRooms,
    activeRoomId,
    setChatRooms,
    setActiveRoomId,
    addChatRoom,
    addChatRooms,
    expandChatRoom,
    hideChatRoom,
    hideAllRoom,
    initializeChatRoom,
    updateChatRooms,
    loadNextPage,
    loadPrevPage,
    setLoadingPrev,
    setLoadingNext,
    removeFailedMessage,
  };
};

export const ChatRoomsContext = createContext({} as UseChatRooms);
