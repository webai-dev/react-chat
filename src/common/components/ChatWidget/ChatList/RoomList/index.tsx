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
import RoomListItem from "./RoomListItem";
import { RoomListsContext } from "../../../../hooks/useRoomLists";
import { CompanyContext } from "../../../../hooks/useCompanies";
import { getRooms } from "../../../../services/rooms";
import { RoomListResponse } from "../../../../../types/types";
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

interface RoomListProps {
  connectionStatus: number;
}

/**
 * RoomList component
 * @param {{ RoomListProps }} props Properties
 * @description RoomList component consists of a list of RoomListItem components
 */
const RoomsList: React.FC<RoomListProps> = ({ connectionStatus = 1 }) => {
  const classes = useStyles();
  const [selectedRoomId, setSelectedRoomId] = useState(-1);
  const { selectedCompany } = useContext(CompanyContext);
  const {
    activeRoomList,
    loadNextPage,
    loadingList,
    loadingNextPage,
    companyRoomLists,
    setLoadingList,
  } = useContext(RoomListsContext);
  const containerRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (connectionStatus === 1 && selectedCompany) {
      if (!activeRoomList) {
        setLoadingList(true);
        getRooms(selectedCompany.id, 0).then(
          (data: RoomListResponse | null) => {
            if (data) {
              companyRoomLists.push({
                companyId: selectedCompany.id,
                rooms: data.data,
                page: data.page,
                size: data.size,
                searchTerm: null,
                hasMore: data.totalPages > data.page,
              });

              setLoadingList(false);
            }
          }
        );
      } else {
        let updatedRoomsList = companyRoomLists.find(
          (c) => c.companyId === selectedCompany.id
        );
        if (updatedRoomsList) {
          setLoadingList(true);
          getRooms(selectedCompany.id, 0).then(
            (data: RoomListResponse | null) => {
              if (data && updatedRoomsList) {
                updatedRoomsList.companyId = selectedCompany.id;
                updatedRoomsList.rooms = data.data;
                updatedRoomsList.page = data.page;
                updatedRoomsList.size = data.size;
                updatedRoomsList.searchTerm = null;
                updatedRoomsList.hasMore = data.totalPages > data.page;

                setLoadingList(false);
              }
            }
          );
        }
        companyRoomLists.map((company) => {
          return company.companyId === selectedCompany.id
            ? updatedRoomsList
            : company;
        });
      }

      // updateActiveRooms();
    }
    // eslint-disable-next-line
  }, [connectionStatus]);

  // Infinite scrolling code
  const observer = useRef<IntersectionObserver>();
  const lastRoomElementRef = useCallback(
    (node) => {
      if (loadingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && activeRoomList?.hasMore) {
          loadNextPage();
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingNextPage, activeRoomList?.hasMore, loadNextPage]
  );

  return (
    <div data-testid="room-list" className={classes.root} ref={containerRef}>
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
          {activeRoomList?.rooms &&
            activeRoomList?.rooms.map((room, index) => (
              <div
                key={index}
                ref={
                  activeRoomList?.rooms.length === index + 1
                    ? lastRoomElementRef
                    : null
                }
              >
                <RoomListItem
                  connectionStatus={connectionStatus}
                  room={room}
                  selectedRoomId={selectedRoomId}
                  onClick={() => setSelectedRoomId(room.id)}
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

export default RoomsList;
