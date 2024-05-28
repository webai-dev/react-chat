import axios, { Canceler } from "axios";
import {
  NewRoom,
  NewMessage,
  CreateRoom,
  CreateMessage,
  EditRoom,
} from "../../types";
import { ChatMessage, Reaction, ReactionUser } from "../../types/types";

let cancel: Canceler;

export const getMessages = async (
  roomId: number,
  companyId: number | null,
  context?: string,
  messageId?: number,
  direction?: string
): Promise<ChatMessage[] | null> => {
  const url =
    companyId !== null
      ? `/api/v1/chat/companies/${companyId}/rooms/${roomId}/messages`
      : `/api/v1/chat/connections/rooms/${roomId}/messages`;

  try {
    // if (cancel !== undefined) cancel();
    const res = await axios({
      method: "GET",
      url,
      params: {
        context,
        messageID: messageId,
        direction,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });

    return res.data.messages;
  } catch (err) {
    console.log(cancel);
    if (axios.isCancel(err)) return err;
    return null;
  }
};

/** @param {number} companyId */
/** @param {CreateRoom} data */
/** @param {number} page */
/** @param {number} size */
/** @description Create a chat room with user's data */
const createRoom = async (
  companyId: number | null,
  data: CreateRoom = {}
): Promise<NewRoom | null> => {
  try {
    const url = companyId ? `/api/v1/chat/companies/${companyId}/rooms` : `/api/v1/chat/connections/rooms`;
    const resp = await axios.post(url, data);

    return resp.data;
  } catch (err) {
    // Error Handling
    console.error(err);
    return {...err, errMessage: err.response.data.message};
  }
};

/** @param {number} companyId */
/** @param {number} roomId */
/** @param {EditRoom} data */
/** @description Edit Room with participant's data*/
const editRoom = async (
  companyId: number | null,
  roomId: number | undefined,
  data: EditRoom = {}
): Promise<NewRoom> => {
  try {
    const url = companyId ? `/api/v1/chat/companies/${companyId}/rooms/${roomId}` : `/api/v1/chat/connections/rooms/${roomId}`;
    const resp = await axios.patch(url, data);

    return resp.data;
  } catch (err) {
    // Error Handling
    console.error(err);
    return {...err, errMessage: err.response.data.message}
  }
};

/** @param {number} companyId */
/** @param {number} roomId */
/** @param {number} page */
/** @param {number} size */
/** @param {CreateMessage} data */
/** @description Create new message in chat room with room id */
const sendMessage = async (
  companyId: number | null,
  roomId: number | undefined,
  data: CreateMessage = {},
  again: boolean = false
): Promise<NewMessage | null> => {
  let url =
    companyId !== null
      ? `/api/v1/chat/companies/${companyId}/rooms/${roomId}/messages`
      : `/api/v1/chat/connections/rooms/${roomId}/messages`;
  try {
    if (!again) {
      // const resp = await axios.post(url, data);
      const resp = await axios({
        method: "post",
        url,
        data,
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      });
      return resp.data;
    } else {
      return null;
    }
  } catch (err) {
    // Error Handling
    console.error(err);
    if (axios.isCancel(err)) return err;
    return null;
  }
};

/** @param {number} companyId */
/** @param {number} userId */
/** @description Get the direct chat room with userId */
const checkDirectChat = async (
  companyId: number | null,
  userId: number | undefined
): Promise<NewRoom | null> => {
  try {
    const resp = await axios.get(
      `/api/v1/chat/companies/${companyId}/users/${userId}`
    );
    return resp.data;
  } catch (err) {
    // Error Handling
    console.error(err);
    return null;
  }
};

/** @param {number} userId */
/** @description Get the direct chat room with userId */
const checkDirectChatConnection = async (
  userId: number | undefined
): Promise<NewRoom | {}> => {
  try {
    const resp = await axios.get(`/api/v1/chat/connections/users/${userId}`);

    return resp.data;
  } catch (err) {
    // Error Handling
    console.error(err);
    return {};
  }
};

/** @param {number} companyId */
/** @param {number} roomId */
/** @description Mark a room as read */
const markAsRead = async (
  companyId: number | null,
  roomId: number | undefined
): Promise<void> => {
  let url =
    companyId !== null
      ? `/api/v1/chat/companies/${companyId}/rooms/${roomId}/markAsRead`
      : `/api/v1/chat/connections/rooms/${roomId}/markAsRead`;
  try {
    await axios.post(url, {});
  } catch (err) {
    // Error Handling
    console.error(err);
  }
};

/** @param {number} companyId */
/** @param {number} roomId */
/** @param {number} messageId */
/** @description Mark a room as read */
const markMessageAsRead = async (
  companyId: number | null,
  roomId: number | undefined,
  messageId: number | undefined
): Promise<void> => {
  let url =
    companyId !== null
      ? `/api/v1/chat/companies/${companyId}/rooms/${roomId}/messages/${messageId}/markAsRead`
      : `/api/v1/chat/connections/rooms/${roomId}/messages/${messageId}/markAsRead`;
  try {
    await axios.post(url, {});
  } catch (err) {
    // Error Handling
    console.error(err);
  }
};

/** @param {number} companyId */
/** @param {number} roomId */
/** @param {number} messageId */
/** @param {Reaction} reaction */
/** @description Mark a room as read */
const addReaction = async (
  companyId: number | null,
  roomId: number | undefined,
  messageId: number | undefined,
  reaction: Reaction | {}
): Promise<void> => {
  let url =
    companyId !== null
      ? `/api/v1/chat/companies/${companyId}/rooms/${roomId}/messages/${messageId}/react`
      : `/api/v1/chat/connections/rooms/${roomId}/messages/${messageId}/react`;
  try {
    await axios.post(url, reaction);
  } catch (err) {
    // Error Handling
    console.error(err);
  }
};

/** @param {number} companyId */
/** @param {number} roomId */
/** @param {number} messageId */
/** @param {Reaction} reaction */
/** @description Mark a room as read */
const removeReaction = async (
  companyId: number | null,
  roomId: number | undefined,
  messageId: number | undefined,
  reaction: Reaction | {}
): Promise<void> => {
  let url =
    companyId !== null
      ? `/api/v1/chat/companies/${companyId}/rooms/${roomId}/messages/${messageId}/react`
      : `/api/v1/chat/connections/rooms/${roomId}/messages/${messageId}/react`;
  try {
    await axios.delete(url, { data: reaction });
  } catch (err) {
    // Error Handling
    console.error(err);
  }
};

/** @param {number} companyId */
/** @param {number} roomId */
/** @param {number} messageId */
/** @param {string} reaction */
/** @description Mark a room as read */
const reactionUser = async (
  companyId: number | null,
  roomId: number | undefined,
  messageId: number | undefined,
  reaction: string
): Promise<Array<ReactionUser> | []> => {
  let url =
    companyId !== null
      ? `/api/v1/chat/companies/${companyId}/rooms/${roomId}/messages/${messageId}/reactBy/${reaction}`
      : `/api/v1/chat/connections/rooms/${roomId}/messages/${messageId}/reactBy/${reaction}`;
  try {
    let user = await axios.get(url);

    return user.data;
  } catch (err) {
    // Error Handling

    console.error(err);
    return [];
  }
};

const chat = {
  createRoom,
  sendMessage,
  checkDirectChat,
  editRoom,
  getMessages,
  markAsRead,
  markMessageAsRead,
  checkDirectChatConnection,
  addReaction,
  removeReaction,
  reactionUser,
};

export default chat;
