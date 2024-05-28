import React, { useRef, useCallback, useContext } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ConnectionListItem from "../ConnectionListItem";

import { ConnectionsContext } from "../../../../../hooks/useConnections";

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
    maxHeight: "calc(100% - 140px)",

    "&:before": {
      backgroundColor: "transparent",
    },

    "& .MuiCollapse-container": {
      overflow: "auto",
    },
  },
  accordionDetails: {
    padding: 0,
    height: 411,
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
  companyId: number | null;
  modalItem?: boolean;
  selectedMembers?: number[];
  setSelectedMembers?: React.Dispatch<React.SetStateAction<number[]>>;
  connectionStatus?: number;
}

/**
 * TeamList component
 * @param {{ TeamListProps }} props Properties
 * @description TeamList component consists of a list of TeamListItem components
 */
const ConnectionListContent: React.FC<ConnectionListProps> = ({
  modalItem = false,
  selectedMembers = [],
  setSelectedMembers = () => undefined,
  connectionStatus = 1,
}) => {
  const classes = useStyles();
  const { connectionList, loadNextPage, loadingList, loadingNextPage, hasMore } =
    useContext(ConnectionsContext);
  const containerRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  // Infinite scrolling code
  const observer = useRef<IntersectionObserver>();
  const lastTeamElementRef = useCallback(
    (node) => {
      if (loadingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadNextPage();
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingNextPage, hasMore, loadNextPage]
  );

  return (
    <div
      data-testid="team-list-content"
      className={classes.root}
      ref={containerRef}
    >
      {loadingList ? (
        <Box
          display="flex"
          height={410}
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      ) : (
        <span>
          {connectionList?.map((connection, index) => (
            <div
              key={index}
              ref={
                connectionList?.length === index + 1 ? lastTeamElementRef : null
              }
            >
              <ConnectionListItem
                connectionStatus={connectionStatus}
                connection={connection}
                modalItem={modalItem}
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
              />
            </div>
          ))}

          {loadingNextPage && (
            <Box
              display="flex"
              flex={1}
              height={90}
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Box>
          )}
        </span>
      )}
    </div>
  );
};

export default ConnectionListContent;
