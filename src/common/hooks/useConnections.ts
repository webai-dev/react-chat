import { useState, createContext, useEffect } from "react";

import {
  ConnectionItem,
  ConnectionListResponse,
  UseConnections,
} from "../../types/types";
import { getConnections } from "../services/rooms";

export const useConnections = () => {
  let [connectionList, setConnectionList] = useState<ConnectionItem[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loadingNextPage, setLoadingNextPage] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    if (connectionList) {
      setLoadingList(true);
      getConnections(1, searchTerm).then(
        (data: ConnectionListResponse | null) => {
          if (data) {
            setConnectionList(data.data);
            setPage(data.page);
            setHasMore(data.totalPages > data.page);
            setLoadingList(false);
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (connectionList) {
      setLoadingList(true);
      getConnections(1, searchTerm).then(
        (data: ConnectionListResponse | null) => {
          if (data) {
            setConnectionList(data.data);
            setPage(data.page);
            setHasMore(data.totalPages > data.page);
            setLoadingList(false);
          }
        }
      );
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const loadNextPage = () => {
    if (connectionList) {
      setLoadingNextPage(true);
      getConnections(page + 1, searchTerm || "").then(
        (data: ConnectionListResponse | null) => {
          if (data) {
            setPage(data.page);
            setHasMore(data.totalPages > data.page);
            let newConnectionsList = [...connectionList, ...data.data];
            setConnectionList(newConnectionsList);
            setLoadingNextPage(false);
          }
        }
      );
    }
  };

  const setConnectionListSearchTerm = (search: string) => {
    setSearchTerm(search);
  };

  const getConnectionItemById = (connectionId: number) => {
    for (let i = 0; i < connectionList.length; i++) {
      const connection = connectionList.find((c) => c.id === connectionId);

      if (connection) {
        return connection;
      }
    }

    return null;
  };

  return {
    connectionList,
    setConnectionList,
    searchTerm,
    setSearchTerm,
    hasMore,
    loadingList,
    loadingNextPage,
    loadNextPage,
    setConnectionListSearchTerm,
    getConnectionItemById,
  };
};

export const ConnectionsContext = createContext({} as UseConnections);
