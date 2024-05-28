export interface Participants {
  id: number;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string;
  isOnline: boolean;
}

export interface LastMessage {
  id: number;
  userID: number;
  messageType: number | undefined;
  message: string;
  sentAt: string | Date;
  readBy: number | undefined;
}

export interface NewRoom {
  id: number;
  name: string;
  imageUrl: string;
  roomType: number;
  participants: Array<Participants>;
  lastMessage: LastMessage;
  unreadCount: number;
  readBy: Array<number>;
  errMessage: string;
}

export interface NewMessage {
  messageType: number;
  visibleFor?: null;
  lastEditAt?: null;
  id: number;
  roomID?: number;
  userID: number;
  trackingID?: string;
  message: string;
  sentAt?: string;
  receivedAt?: string;
}

export interface CreateRoom {
  name?: string | undefined;
  imageUrl?: string | undefined;
  participants?: Array<number | undefined>;
  roomType?: number;
  message?: string | undefined;
}

export interface EditRoomParticipants {
  id?: number;
  action?: string;
}

export interface EditRoom {
  name?: string | undefined;
  imageUrl?: string | undefined;
  message?: string | undefined;
  participants?: Array<EditRoomParticipants>;
}

export interface CreateMessage {
  message?: string;
  trackingID?: string;
  sentAt?: Date;
}
