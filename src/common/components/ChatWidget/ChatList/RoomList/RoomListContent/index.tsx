import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
} from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ConnectionListItem from "../ConnectionListItem";
import { ConnectionsContext } from "../../../../../hooks/useConnections";
import { ConnectionItem } from "../../../../../../types/types";

export const useStyles = makeStyles({
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

interface RoomListContentProps {
  modalItem?: boolean;
  selectedMembers?: number[];
  setSelectedMembers?: React.Dispatch<React.SetStateAction<number[]>>;
  connectionStatus?: number;
}

/**
 * RoomList component
 * @param {{ RoomListContentProps }} props Properties
 * @description RoomList component consists of a list of RoomListItem components
 */
const RoomsListContent: React.FC<RoomListContentProps> = ({
  modalItem = false,
  selectedMembers = [],
  setSelectedMembers = () => undefined,
  connectionStatus = 1,
}) => {
  const classes = useStyles();

  const {
    connectionList,
    hasMore,
    loadNextPage,
    loadingList,
    loadingNextPage,
  } = useContext(ConnectionsContext);
  const containerRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [modalRoomList, setModalRoomList] = useState<Array<ConnectionItem>>();

  useEffect(() => {
    let modalRooms: Array<ConnectionItem> = [];
    connectionList.forEach((room) => {
      if (connectionList) {
        modalRooms.push(room);
      }
    });
    setModalRoomList(modalRooms);
  }, [connectionList]);
  // Infinite scrolling code
  const observer = useRef<IntersectionObserver>();
  const lastConnectionElementRef = useCallback(
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
      data-testid="room-list-content"
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
          {modalRoomList &&
            modalRoomList.map((connection, index) => (
              <div
                key={index}
                ref={
                  connectionList.length === index + 1
                    ? lastConnectionElementRef
                    : null
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

export default RoomsListContent;
