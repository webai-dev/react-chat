import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Company } from "../../../../../types/types";

import { ChatRoomsContext } from "../../../../hooks/useChatRooms";
import { CompanyContext } from "../../../../hooks/useCompanies";
import { RoomListsContext } from "../../../../hooks/useRoomLists";

const useStyles = makeStyles({
  root: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    height: "60px",
    padding: "10px 14px",
    backgroundColor: "#3870A0",
    color: "#ffffff",
  },
  badge: {
    backgroundColor: "#ffffff",
    color: "#665678",
    right: -10,
  },
  badgeAll: {
    backgroundColor: "#ffffff",
    color: "#665678",
    right: 12,
    top: -6,
  },
  companyItem: {
    padding: "12px 0 12px 38px",
  },
  dropdownContainer: {
    background: "#3870A0",
    width: "250px",
    color: "#fff",
    padding: 0,
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    margin: 0,
    top: 60,
    left: 0,
    cursor: "pointer",
    zIndex: 1000,
  },
});

interface ChatListHeaderProps {}

/**
 * ChatListHeader component
 * @param {ChatListHeaderProps} props Properties
 * @description ChatListHeader component consists of dropdown for switching between companies and connections
 */
const ChatListHeader: React.FC<ChatListHeaderProps> = () => {
  // States
  const [showDropdown, setShowDropdown] = useState(false);
  const { companies, selectedCompany, setSelectedCompany } =
    useContext(CompanyContext);
  const { companyRoomLists } = useContext(RoomListsContext);
  const { addChatRooms, hideAllRoom } = useContext(ChatRoomsContext);

  // Styles
  const classes = useStyles();

  //Event Handlers
  const handleClickDropdownItem = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    company: Company
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
    if (selectedCompany && company.id !== selectedCompany?.id) {
      // localStorage.setItem("chatRooms", JSON.stringify([]));

      if (selectedCompany) {
        hideAllRoom(selectedCompany.id);
      }
      hideAllRoom(company.id);
      setSelectedCompany(company);
      
      if (company) {
        localStorage.setItem("selectedCompany", JSON.stringify(company));
      }
      const item = localStorage.getItem("chatRooms");
      if (item) {
        let roomsList = JSON.parse(item);

        if (company && company.id) {
          let companyRooms = companyRoomLists.find(
            (c) => c.companyId === company.id
          );
          let roomIds = roomsList[company.id.toString()];
          if (companyRooms) {
            let rooms = companyRooms.rooms.map((r) => r.id);
            if (
              roomsList[company.id.toString()] &&
              roomsList[company.id.toString()].filter(
                (r: number[]) => r && rooms.includes(r[0])
              )
            ) {
              roomIds = roomsList[company.id.toString()].filter(
                (r: number[]) => r && rooms.includes(r[0])
              );
            }
          }

          addChatRooms(roomIds ? roomIds : [], company.id);
        } else if (company && company.id === null) {
          let companyRooms = companyRoomLists.find(
            (c) => c.companyId === company.id
          );
          let roomIds = roomsList["-1"];
          if (companyRooms) {
            let rooms = companyRooms.rooms.map((r) => r.id);
            if (
              roomsList["-1"] &&
              roomsList["-1"].filter((r: number[]) => r && rooms.includes(r[0]))
            ) {
              roomIds = roomsList["-1"].filter(
                (r: number[]) => r && rooms.includes(r[0])
              );
            }
          }

          addChatRooms(roomIds ? roomIds : [], company.id);
        }
      }
    }
  };

  const handleClickCompany = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const totalUnreadCount =
    companies && companies.length > 1
      ? companies
          .map((company) => company.unreadCount)
          .reduce((a, b) => a + b, 0)
      : companies && companies[0]
      ? companies[0].unreadCount
      : 0;

  return (
    <div 
      data-testid="chat-list-header" 
      className={classes.root} 
      onClick={(e) => {
        handleClickCompany(e);
      }}
    >
      <Badge
        classes={{ badge: classes.badgeAll }}
        badgeContent={totalUnreadCount}
        color="primary"
      >
        <FilterListIcon />
      </Badge>

      <Typography>
        {selectedCompany ? selectedCompany.name : ""}
      </Typography>
      {showDropdown && (
        <Container className={classes.dropdownContainer}>
          {companies && companies.length > 1
            ? companies.map((company, index) => (
                <Typography
                  className={classes.companyItem}
                  onClick={(e) => handleClickDropdownItem(e, company)}
                  key={index}
                >
                  <Badge
                    classes={{ badge: classes.badge }}
                    badgeContent={company.unreadCount}
                    color="primary"
                  >
                    {company.name}
                  </Badge>
                </Typography>
              ))
            : ""}
        </Container>
      )}
    </div>
  );
};

export default ChatListHeader;
