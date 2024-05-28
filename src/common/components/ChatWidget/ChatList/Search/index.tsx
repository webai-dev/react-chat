import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import SearchIcon from "@material-ui/icons/Search";

import { RoomListsContext } from "../../../../hooks/useRoomLists";
import { TeamListsContext } from "../../../../hooks/useTeamLists";

export const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "80px",
    backgroundColor: "#fff",
    paddingLeft: "30px",
    alignItems: "center",
    color: "#BCBCCB",
    fontSize: "13px",
  },
  textField: {
    border: "none",
    backgroundColor: "transparent",
    color: "#4D4F5C",
    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
});

interface SearchProps {
  isTeamList?: boolean | undefined
}

/**
 * Search component
 * @param {{ SearchProps }} props Properties
 * @description Search component consists of a search icon and a text field for search value
 */
const Search: React.FC<SearchProps> = ({isTeamList}) => {
  // Styles
  const classes = useStyles();
  const [term, setTerm] = useState("");
  const { activeRoomList, setRoomListSearchTerm } =
    useContext(RoomListsContext);
  const { activeTeamList, setTeamListSearchTerm } =
    useContext(TeamListsContext);
  useEffect(() => {
    if (activeRoomList || activeTeamList) {
      setTerm(activeRoomList?.searchTerm || "");
    }
  }, [activeRoomList, activeTeamList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleEnter = (target: React.KeyboardEvent) => {
    if (target.key === "Enter") {
      isTeamList ? setTeamListSearchTerm(term) : setRoomListSearchTerm(term);
    }
  };

  return (
    <div data-testid="search" className={classes.root}>
      <SearchIcon />
      <input
        type="text"
        placeholder="Search name..."
        value={term}
        className={classes.textField}
        onChange={handleChange}
        onKeyPress={handleEnter}
      />
    </div>
  );
};

export default Search;
