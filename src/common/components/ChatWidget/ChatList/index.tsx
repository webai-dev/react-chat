import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ChatListHeader from "./ChatListHeader";
import Search from "./Search";
import RoomList from "./RoomList";
import TeamList from "./TeamList";
import ConnectionList from "./ConnectionList";

import { CompanyContext } from "../../../hooks/useCompanies";
import { useState } from "react";

const useStyles = makeStyles({
  accordion: {
    borderRadius: "0 !important",
    position: "absolute",
    bottom: 0,
    right: 0,
    boxShadow: "0px 3px 6px #00000029",
    width: 370,
  },
  accordionDetails: {
    height: 540,
    padding: 0,
  },
  accordionExpanded: {
    margin: "0 !important",
  },
  accordionSummary: {
    padding: 0,
    minHeight: "initial !important",
    backgroundColor: "#3870A0",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  accordionSummaryContent: {
    margin: "0 !important",
  },
  expandIcon: {
    color: "#ffffff",
    transform: "rotate(180deg)",
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

interface ChatListProps {
  connectionStatus?: number;
}

/**
 * ChatList component
 * @param {ChatListProps} props Properties
 * @description ChatList component consists of ChatListHeader, Search, and Rooms/Team List components
 */
const ChatList: React.FC<ChatListProps> = ({ connectionStatus = 1 }) => {
  // Styles
  const classes = useStyles();

  const { selectedCompany } = useContext(CompanyContext);
  let chatListExpanded = localStorage.getItem("chatListExpanded");
  const [listExpanded, setListExpanded] = useState(
    chatListExpanded ? JSON.parse(chatListExpanded) : false
  );

  return (
    <div data-testid="chat-list">
      <Accordion
        expanded={listExpanded}
        classes={{
          root: classes.accordion,
          expanded: classes.accordionExpanded,
        }}
        onChange={(event: React.ChangeEvent<{}>, expand: boolean) => {
          localStorage.setItem("chatListExpanded", JSON.stringify(expand));
          setListExpanded(expand);
        }}
      >
        <AccordionSummary
          classes={{
            root: classes.accordionSummary,
            content: classes.accordionSummaryContent,
          }}
          expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
        >
          <ChatListHeader />
        </AccordionSummary>

        <AccordionDetails className={classes.accordionDetails}>
          <Box
            width="100%"
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            <Search />
            <Box
              height={410}
              overflow="auto"
              data-testid="team-list"
            >
              <RoomList connectionStatus={connectionStatus} />
            </Box>
            {selectedCompany && selectedCompany.name === "Connections" && (
              <ConnectionList connectionStatus={connectionStatus} />
            )}
            {selectedCompany && selectedCompany.name !== "Connections" && (
              <TeamList connectionStatus={connectionStatus} />
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ChatList;
