import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import GroupModal from "./GroupModal";
import Alert from "@material-ui/lab/Alert";
import { useMe, MeContext } from "../../hooks/useMe";
import { useCompanies, CompanyContext } from "../../hooks/useCompanies";
import { useRoomLists, RoomListsContext } from "../../hooks/useRoomLists";
import { useTeamLists, TeamListsContext } from "../../hooks/useTeamLists";
import { useChatRooms, ChatRoomsContext } from "../../hooks/useChatRooms";
import { useConnections, ConnectionsContext } from "../../hooks/useConnections";
import ChatSocket from "../ChatSocket";

interface ChatWidgetProps {
  className?: Object;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    position: "fixed",
    bottom: 0,
    right: 0,
    height: 600,
    width: "fit-content",
  },
  alert: {
    width: "500px",
    margin: "5px auto",
    textAlign: "center",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100000,
  },
});

interface ChatWidgetProps { }

/**
 * ChatWidget component
 * @param {ChatWidgetProps} props Properties
 * @description ChatWidget component consists of ChatList, ChatRoom and GroupModal Components
 */
const ChatWidget: React.FC<ChatWidgetProps> = () => {
  // States
  const companyContext = useCompanies();
  const meContext = useMe();
  const chatRoomsContext = useChatRooms();
  const connectionsContext = useConnections();
  // connection status - 1 = connected, 0 = disconnected, reconnecting, -1 = completely disconnected
  const [connectionStatus, setConnectionStatus] = useState<number>(1);
  const { selectedCompany } = companyContext;
  const { chatRooms } = chatRoomsContext;

  let selectedCompanyLocal = localStorage.getItem("selectedCompany");
  let selectedCompanyId = selectedCompanyLocal && selectedCompanyLocal !== 'undefined'
    ? JSON.parse(selectedCompanyLocal).id
    : selectedCompany
      ? selectedCompany.id
      : null;
  const roomListsContext = useRoomLists(selectedCompanyId);
  const teamListsContext = useTeamLists(selectedCompanyId);

  // Styles
  const classes = useStyles();

  return (
    <MeContext.Provider value={meContext}>
      <CompanyContext.Provider value={companyContext}>
        <RoomListsContext.Provider value={roomListsContext}>
          <ChatRoomsContext.Provider value={chatRoomsContext}>
            <ConnectionsContext.Provider value={connectionsContext}>
              <ChatSocket
                connectionStatus={connectionStatus}
                setConnectionStatus={setConnectionStatus}
              />
              {connectionStatus === 0 && (
                <Alert
                  className={classes.alert}
                  variant="filled"
                  severity="error"
                >
                  You are offline, reconnecting...
                </Alert>
              )}
              {connectionStatus === -1 && (
                <Alert
                  className={classes.alert}
                  variant="filled"
                  severity="error"
                >
                  Please make sure you are connected to internet and refresh the
                  page.
                </Alert>
              )}
              {chatRoomsContext.chatRooms
                .filter((chatRoom) => {
                  return chatRoom.visible;
                })
                .map((chatRoom, index) => (
                  <ChatRoom
                    index={index}
                    key={index}
                    roomId={chatRoom.roomId}
                    connectionStatus={connectionStatus}
                  />
                ))}
              <TeamListsContext.Provider value={teamListsContext}>
                <div data-testid="chat-widget" className={classes.root}>
                  <ChatList connectionStatus={connectionStatus} />
                  {chatRooms.filter((chatRoom) => chatRoom.groupModalOpened)
                    .length > 0 && (
                      <GroupModal connectionStatus={connectionStatus} />
                    )}
                </div>
              </TeamListsContext.Provider>
            </ConnectionsContext.Provider>
          </ChatRoomsContext.Provider>
        </RoomListsContext.Provider>
      </CompanyContext.Provider>
    </MeContext.Provider>
  );
};

export default ChatWidget;
