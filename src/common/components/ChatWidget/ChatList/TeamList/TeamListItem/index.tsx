import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeopleIcon from "@material-ui/icons/People";
import NullableImage from "../../../_Common/NullableImage";
import { TeamItem, TeamMember } from "../../../../../../types/types";
import { CompanyContext } from "../../../../../hooks/useCompanies";
import { ChatRoomsContext } from "../../../../../hooks/useChatRooms";
import Chat from "../../../../../services/chat";
// import { createTeamChat } from "../../../../../services/teams";

// Global styles
export const useStyles = makeStyles({
  accordion: {
    margin: "0 0 -2px 0 !important",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "0 !important",
  },
  accordionDetails: {
    padding: 0,
  },
  accordionSummary: {
    padding: "16px 32px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
  },
  iconContainer: {
    paddingLeft: "10px",
    paddingRight: "5px",
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
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  root: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    padding: "16px 22px 13px",
    cursor: "pointer",
    backgroundColor: (selected) => (selected ? "#4F8DCB1A" : "white"),
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

interface TeamListItemProps {
  modalItem?: boolean;
  team: TeamItem;
  selectedMembers?: number[];
  setSelectedMembers?: React.Dispatch<React.SetStateAction<number[]>>;
  connectionStatus: number;
}

/**
 * TeamListItem component
 * @param {TeamListItemProps} props Properties
 * @description TeamListItem component consists of data for one user/group in Chat Room
 */
const TeamListItem: React.FC<TeamListItemProps> = ({
  modalItem = false,
  team = {
    id: 0,
    name: "",
    members: [],
    chatRoomID: 0,
  },
  selectedMembers = [],
  setSelectedMembers = () => undefined,
  connectionStatus = 1,
}) => {
  const { name, members } = team;
  const [selectedMemberId, setSelectedMemberId] = useState(-1);
  const classes = useStyles();
  const { addChatRoom } = useContext(ChatRoomsContext);
  const { selectedCompany } = useContext(CompanyContext);
  const { checkDirectChat } = Chat;

  const handleClickMember = async (id: number, userID: number) => {
    if (!modalItem) {
      setSelectedMemberId(id);

      const response = await checkDirectChat(
        selectedCompany && selectedCompany.id,
        userID
      );
      if (response) {
        if (Object.keys(response).length === 0) {
        } else {
          addChatRoom(response.id, selectedCompany && selectedCompany.id);
        }
      }
    }
  };
  const handleClickTeamChat = async (id: number, chatRoomID: number | null) => {
    if (chatRoomID) {
      addChatRoom(chatRoomID, selectedCompany && selectedCompany.id);
    } else {
      // const response = await createTeamChat(
      //   selectedCompany && selectedCompany.id,
      //   id
      // );

      // if (response) {
      //   if (Object.keys(response).length === 0) {
      //     console.log("Empty response");
      //   } else {
      //     console.log(response);
      //     addChatRoom(response.id, selectedCompany && selectedCompany.id);
      //   }
      // }
    }
  };

  return (
    <Accordion data-testid="team-list-item" className={classes.accordion}>
      <AccordionSummary
        className={classes.accordionSummary}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>
          <span>
            <span>{name}</span>
          </span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <Box width="100%">
          {!modalItem && team.isTeamMember && (
            <div
              data-testid="room-list-item"
              className={classes.root}
              style={{
                backgroundColor: selectedMemberId === 0 ? "#4F8DCB1A" : "white",
              }}
              onClick={() => handleClickTeamChat(team.id, team.chatRoomID)}
            >
              <div className={classes.iconContainer}>
                <PeopleIcon fontSize="large" />
              </div>
              <div className={classes.info}>
                <div className={classes.name}>Chat with the team</div>
                <div className={classes.occupation}></div>
              </div>
            </div>
          )}

          {members &&
            members.map((member: TeamMember, index: number) => (
              <div
                data-testid="room-list-item"
                className={classes.root}
                style={{
                  backgroundColor:
                    selectedMemberId === member.id ? "#4F8DCB1A" : "white",
                }}
                onClick={() =>
                  handleClickMember(member.id, member.memberUserID)
                }
                key={index}
              >
                {modalItem && (
                  <Checkbox
                    color="default"
                    checked={
                      selectedMembers.filter((id) => id === member.memberUserID)
                        .length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers([
                          ...selectedMembers,
                          member.memberUserID,
                        ]);
                      } else {
                        let updatedMembers = selectedMembers.filter(
                          (id) => id !== member.memberUserID
                        );
                        setSelectedMembers(updatedMembers);
                      }
                    }}
                    inputProps={{ "aria-label": "checkbox with default color" }}
                  />
                )}

                <NullableImage
                  src={
                    member.memberUser ? member.memberUser.profilePhotoUrl : ""
                  }
                  className={classes.photo}
                />
                <div className={classes.info}>
                  <div className={classes.name}>
                    {member.memberUser ? member.memberUser.firstName : ""}{" "}
                    {member.memberUser ? member.memberUser.lastName : ""}
                  </div>
                  <div className={classes.occupation}>
                    {(member.memberUser
                      ? member.memberUser.companyMembership
                      : []
                    )
                      .map((memberShip) => memberShip.jobTitle)
                      .join(", ")}
                  </div>
                </div>
              </div>
            ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default TeamListItem;
