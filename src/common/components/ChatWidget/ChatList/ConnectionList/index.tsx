import React, { useContext } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Box from "@material-ui/core/Box";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { makeStyles } from "@material-ui/styles";
import ConnectionListContent from "./ConnectionListContent";

import { CompanyContext } from "../../../../hooks/useCompanies";
import Search from "../Search";

export const useStyles = makeStyles({
  accordion: {
    borderRadius: "0 !important",
    display: "flex",
    flexDirection: "column-reverse",
    position: "absolute",
    bottom: 0,
    right: 0,
    boxShadow: "0px 3px 6px #00000029",
    width: 370,
    maxHeight: "100%",

    "&:before": {
      backgroundColor: "transparent",
    },

    "& .MuiCollapse-container": {
      overflow: "auto",
    },
  },
  accordionDetails: {
    padding: 0,
    height: 491,
  },
  accordionIcon: {
    position: "absolute",
    color: "#fff",
    right: 12,
  },
  accordionSummary: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "center",
    padding: 0,
    minHeight: "initial !important",
    borderTop: "1px solid rgba(0, 0, 0, 0.2)",
  },
  accordionSummaryContent: {
    margin: "0 !important",
    flexGrow: 0,
  },
  root: {
    flex: 1,
    overflow: "auto",
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

interface ConnectionListProps {
  connectionStatus: number;
}

/**
 * TeamList component
 * @param {{ TeamListProps }} props Properties
 * @description TeamList component consists of a list of TeamListItem components
 */
const ConnectionList: React.FC<ConnectionListProps> = ({ connectionStatus = 1 }) => {
  const classes = useStyles();
  const { selectedCompany } = useContext(CompanyContext);

  return (
    <Accordion data-testid="team-list" className={classes.accordion}>
      <AccordionSummary
        classes={{
          root: classes.accordionSummary,
          content: classes.accordionSummaryContent,
        }}
        expandIcon={<ArrowUpwardIcon />}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={30}
          style={{ cursor: "pointer" }}
        >
          <Box marginLeft="0.25rem">Connections</Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <Box width="100%" overflow="auto" display="flex" flexDirection="column">
          <Search />
          <ConnectionListContent
            connectionStatus={connectionStatus}
            companyId={selectedCompany && selectedCompany.id}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ConnectionList;
