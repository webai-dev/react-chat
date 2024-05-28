import React, { useState, useContext, useEffect } from "react";
import { Container, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SearchIcon from "@material-ui/icons/Search";
import { TeamListsContext } from "../../../../hooks/useTeamLists";
import { ConnectionsContext } from "../../../../hooks/useConnections";

// Global styles
export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "760px",
    height: "70px",
    paddingLeft: "56px",
    margin: "0 35px",
  },
  inputBox: {
    outline: "none",
    width: "512px",
    height: "58px",
    border: "none",
    color: "#4D4F5C",
    paddingLeft: "16px",
    paddingRight: "16px",
    fontSize: "13px",
    fontFamily: "Roboto",
    fontWeight: 400,
    "&::placeholder": {
      fontSize: "13px",
      fontFamily: "Roboto",
      fontWeight: "400",
      color: "#4D4F5C",
    },
  },
  searchIcon: {
    cursor: "pointer",
    color: "#BCBCCB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

/**
 * ModalSearch component
 * @description ModalSearch component consists of a Search Bar
 */
const ModalSearch: React.FC<{}> = () => {
  // Default styling
  const classes = useStyles();
  const [term, setTerm] = useState("");

  const { activeTeamList, setTeamListSearchTerm } =
    useContext(TeamListsContext);

  const { setConnectionListSearchTerm } = useContext(ConnectionsContext);
  useEffect(() => {
    if (activeTeamList) {
      setTerm(activeTeamList?.searchTerm || "");
    }
  }, [activeTeamList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleEnter = (target: React.KeyboardEvent) => {
    if (target.key === "Enter") {
      setConnectionListSearchTerm(term);
      setTeamListSearchTerm(term);
    }
  };

  return (
    <>
      <Container data-testid="modal-search" className={classes.root}>
        <Box className={classes.searchIcon} height={16}>
          <SearchIcon />
        </Box>
        <input
          className={classes.inputBox}
          type="text"
          placeholder="Search name..."
          onChange={handleChange}
          onKeyPress={handleEnter}
        />
      </Container>
    </>
  );
};

export default ModalSearch;
