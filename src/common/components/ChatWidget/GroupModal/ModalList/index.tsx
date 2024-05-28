import React, { useContext } from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import TeamListContent from "../../ChatList/TeamList/TeamListContent";
import RoomListContent from "../../ChatList/RoomList/RoomListContent";
import { CompanyContext } from "../../../../hooks/useCompanies";
import { ChatRoomsContext } from "../../../../hooks/useChatRooms";

// Global styles
export const useStyles = makeStyles({
  root: {
    justifyContent: "center",
    position: "relative",
    alignItems: "center",
    height: "570px",
    padding: 0,
    paddingLeft: "65px",
    "& .MuiContainer": {
      overflowY: "auto",
    },
  },
});

interface ModalListProps {
  selectedMembers: number[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<number[]>>;
  connectionStatus: number;
}

/**
 * ModalList component
 * @param {{
 * }} props Properties
 * @description ModalList component consists of a list of ModelListItem components
 */
const ModalList: React.FC<ModalListProps> = ({
  selectedMembers = [],
  setSelectedMembers = () => undefined,
  connectionStatus = 1,
}) => {
  // Styles
  const classes = useStyles();
  const { chatRooms } = useContext(ChatRoomsContext);
  const chatRoom = chatRooms && chatRooms.find((room) => room.groupModalOpened);
  const { selectedCompany } = useContext(CompanyContext);

  return (
    <>
      <Container data-testid="modal-list" className={classes.root}>
        {selectedCompany?.name && selectedCompany.name === "Connections" ? (
          <RoomListContent
            modalItem
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
            connectionStatus={connectionStatus}
          />
        ) : (
          <TeamListContent
            modalItem
            companyId={chatRoom ? chatRoom.companyId : null}
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
            connectionStatus={connectionStatus}
          />
        )}
      </Container>
    </>
  );
};

export default ModalList;
