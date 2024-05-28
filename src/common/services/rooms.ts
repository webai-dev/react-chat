import axios, { Canceler } from "axios";
import {
  RoomListResponse,
  RoomDetail,
  ConnectionListResponse,
} from "../../types/types";

let cancel: Canceler;

const getRooms = async (
  companyId: number | null,
  offset: number = 0,
  searchTerm = "",
  pageSize: number = 10
): Promise<RoomListResponse | null> => {
  let url = "/api/v1/chat/connections/rooms";

  if (companyId) {
    url = `/api/v1/chat/companies/${companyId}/rooms`;
  }

  try {
    // if (cancel !== undefined) cancel();
    const res = await axios({
      method: "GET",
      url,
      params: {
        offset: offset,
        size: pageSize,
        searchTerm,
      },
      // cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });

    return res.data;
  } catch (err) {
    // Error Handling
    // if (axios.isCancel(err)) return err;
    return null;
  }
};

const getConnections = async (
  pageNumber: number = 0,
  searchTerm = "",
  pageSize: number = 10
): Promise<ConnectionListResponse | null> => {
  let url = "/api/v1/chat/connections";

  try {
    const res = await axios({
      method: "GET",
      url,
      params: {
        page: pageNumber,
        size: pageSize,
        searchTerm,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });

    return res.data;
  } catch (err) {
    // Error Handling
    if (axios.isCancel(err)) return err;
    return null;
  }
};

const getRoomDetail = async (
  companyId: number | null,
  roomId: number
): Promise<RoomDetail | null> => {
  let url = "/api/v1/chat/connections/rooms";

  if (companyId) {
    url = `/api/v1/chat/companies/${companyId}/rooms`;
  }

  url += `/${roomId}`;

  try {
    // if (cancel !== undefined) cancel();
    const res = await axios({
      method: "GET",
      url,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });

    return res.data;
  } catch (err) {
    // Error Handling
    if (axios.isCancel(err)) return err;
    return null;
  }
};

export { getRooms, getRoomDetail, getConnections };
