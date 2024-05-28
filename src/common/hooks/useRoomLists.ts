import { useState, createContext, useEffect } from "react";

import {
  CompanyRoomList,
  RoomListResponse,
  UseRoomLists,
} from "../../types/types";
import { getRooms } from "../services/rooms";

export const useRoomLists = (activeCompanyId: number | null) => {
  let [companyRoomLists, setCompanyRoomLists] = useState<CompanyRoomList[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loadingNextPage, setLoadingNextPage] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const activeRoomList =
    companyRoomLists.find((room) => room.companyId === activeCompanyId) || null;

  const updateCompanyRoomLists = (companyRoomList: CompanyRoomList) => {
    const updatedCompanyRoomLists = companyRoomLists.map((roomList) => {
      if (roomList.companyId === companyRoomList?.companyId) {
        return companyRoomList;
      } else {
        return roomList;
      }
    });

    setCompanyRoomLists(updatedCompanyRoomLists);
  };

  useEffect(() => {
    if (!activeRoomList) {
      setLoadingList(true);
      getRooms(activeCompanyId, 0).then((data: RoomListResponse | null) => {
        if (data) {
          setCompanyRoomLists([... companyRoomLists, {
            companyId: activeCompanyId,
            rooms: data.data,
            page: data.page,
            size: data.size,
            searchTerm: null,
            hasMore: data.totalPages > data.page,
          }]);

          setLoadingList(false);
        }
      });
    } else {
      let updatedRoomsList = companyRoomLists.find(
        (c) => c.companyId === activeCompanyId
      );
      if (updatedRoomsList) {
        setLoadingList(true);
        getRooms(activeCompanyId, 0).then((data: RoomListResponse | null) => {
          if (data && updatedRoomsList) {
            updatedRoomsList.companyId = activeCompanyId;
            updatedRoomsList.rooms = data.data;
            updatedRoomsList.page = data.page;
            updatedRoomsList.size = data.size;
            updatedRoomsList.searchTerm = null;
            updatedRoomsList.hasMore = data.totalPages > data.page;

            setLoadingList(false);
          }
        });
      }
      companyRoomLists.map((company) => {
        return company.companyId === activeCompanyId
          ? updatedRoomsList
          : company;
      });
    }
    // eslint-disable-next-line
  }, [activeCompanyId]);

  useEffect(() => {
    if (activeRoomList && activeRoomList.searchTerm !== null) {
      setLoadingList(true);
      getRooms(activeCompanyId, 0, searchTerm).then(
        (data: RoomListResponse | null) => {
          if (data) {
            activeRoomList.rooms = data.data;
            activeRoomList.page = data.page;
            activeRoomList.size = data.size;
            activeRoomList.hasMore = data.totalPages > data.page;

            setLoadingList(false);

            updateCompanyRoomLists(activeRoomList);
          }
        }
      );
    }
    // eslint-disable-next-line
  }, [activeRoomList, searchTerm]);

  const updateActiveRooms = () => {
    if (!activeRoomList) {
      setLoadingList(true);
      getRooms(activeCompanyId, 0).then((data: RoomListResponse | null) => {
        if (data) {
          setCompanyRoomLists([...companyRoomLists, {
            companyId: activeCompanyId,
            rooms: data.data,
            page: data.page,
            size: data.size,
            searchTerm: null,
            hasMore: data.totalPages > data.page,
          }]);

          setLoadingList(false);
        }
      });
    } else {
      let updatedRoomsList = companyRoomLists.find(
        (c) => c.companyId === activeCompanyId
      );
      if (updatedRoomsList) {
        setLoadingList(true);
        getRooms(activeCompanyId, 0).then((data: RoomListResponse | null) => {
          if (data && updatedRoomsList) {
            updatedRoomsList.companyId = activeCompanyId;
            updatedRoomsList.rooms = data.data;
            updatedRoomsList.page = data.page;
            updatedRoomsList.size = data.size;
            updatedRoomsList.searchTerm = null;
            updatedRoomsList.hasMore = data.totalPages > data.page;

            setLoadingList(false);
          }
        });
      }
      companyRoomLists.map((company) => {
        return company.companyId === activeCompanyId
          ? updatedRoomsList
          : company;
      });
    }
  };

  const loadNextPage = () => {
    let companyRoomList = companyRoomLists.find(
      (roomList) => roomList.companyId === activeCompanyId
    );
    if (companyRoomList) {
      setLoadingNextPage(true);
      getRooms(
        activeCompanyId,
        companyRoomList?.rooms.length,
        companyRoomList.searchTerm || ""
      ).then((data: RoomListResponse | null) => {
        if (data) {
          companyRoomList = {
            companyId: companyRoomList?.companyId || null,
            rooms: [...(companyRoomList?.rooms || []), ...data.data],
            page: data.page,
            size: data.size,
            searchTerm: companyRoomList?.searchTerm || null,
            hasMore: data.data.length > 0,
          };

          setLoadingNextPage(false);
          updateCompanyRoomLists(companyRoomList);
        }
      });
    }
  };

  const setRoomListSearchTerm = (search: string) => {
    setSearchTerm(search);
    const companyRoomList = companyRoomLists.find(
      (roomList) => roomList.companyId === activeCompanyId
    );

    if (companyRoomList) {
      companyRoomList.searchTerm = search;
      updateCompanyRoomLists(companyRoomList);
    }
  };

  const getRoomItemById = (roomId: number) => {
    for (let i = 0; i < companyRoomLists.length; i++) {
      if (companyRoomLists[i].rooms) {
        const room = companyRoomLists[i].rooms.find((r) => r.id === roomId);
        if (room) {
          return room;
        }
      }
    }

    return null;
  };

  return {
    companyRoomLists,
    activeRoomList,
    loadingList,
    searchTerm,
    setSearchTerm,
    setLoadingList,
    loadingNextPage,
    setCompanyRoomLists,
    updateCompanyRoomLists,
    setRoomListSearchTerm,
    loadNextPage,
    getRoomItemById,
    updateActiveRooms,
  };
};

export const RoomListsContext = createContext({} as UseRoomLists);
