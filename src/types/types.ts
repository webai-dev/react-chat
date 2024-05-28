export interface ActiveUser {
  id: number;
  firstName: string;
  lastName: string;
  isOnline?: boolean;
  profilePhotoUrl?: string;
  lastReadMessageID?: number;
  companyMembership: Array<CompanyMembership>;
}

export interface ChatMessage {
  id: number;
  message: string;
  messageType: number;
  readBy?: number;
  sentAt: string;
  trackingID?: string;
  user: ActiveUser;
  reactions?: { [propName: string]: string };
  userReactions?: Array<string>;
  check?: "sent" | "received" | "failed" | "none";
  new?: boolean;
}

export interface ChatRoom {
  roomId: number;
  companyId: number | null;
  focused?: boolean;
  visible?: boolean;
  expanded?: boolean;
  groupModalOpened?: boolean;
  initialized?: boolean;
  loadingPrev?: boolean;
  loadingNext?: boolean;
  prevHasMore?: boolean;
  nextHasMore?: boolean;
  messages: ChatMessage[];
  readBy?: Array<number | null>;
  participants?: ActiveUser[];
  roomType?: number;
  scrollPosition?: number;
  scrollAtBottom?: boolean;
  newMessageFromMe?: boolean;
  newMessageFromOther?: boolean;
}

export interface Company {
  id: null | number;
  name: string;
  unreadCount: number;
}

export interface CompanyMembership {
  category?: string;
  jobTitle?: string;
}

export interface CompanyRoomList {
  companyId: number | null;
  rooms: RoomItem[];
  page: number;
  size: number;
  searchTerm: string | null;
  hasMore: boolean;
  initialized?: boolean;
  selectedRoomId?: number;
}

export interface CompanyTeamList {
  companyId: number | null;
  teams: TeamItem[];
  page: number;
  size: number;
  searchTerm: string | null;
  hasMore: boolean;
  initialized?: boolean;
  selectedRoomId?: number;
}

export interface ConnectionList {
  connections: ConnectionItem[];
  page: number;
  size: number;
  searchTerm: string | null;
  hasMore: boolean;
  initialized?: boolean;
  selectedCompanyId?: number;
}

export interface ConnectionItem {
  id: number;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string;
  isOnline: boolean;
}

export interface MessageBodyData {
  id?: number;
  userID?: number;
  roomID?: number;
  companyID?: number;
  message?: string;
  isOnline?: boolean;
  messageType?: number;
  sentAt?: string;
  readBy?: number;
  user: ActiveUser;
  property?: string;
}

export interface MessageReadUpdate {
  operation?: string;
  property?: string;
  value?: Array<number | null>;
}

export interface MessageReactionUpdate {
  operation?: string;
  property?: string;
  value?: { [propName: string]: string };
}

export interface MessageBodyObject {
  id: number;
  type: string;
}

export interface MessageBody {
  data?: MessageBodyData;
  object?: MessageBodyObject;
  operation?: string;
}

export interface MessageReadBody {
  data?: MessageReadUpdate[];
  object?: MessageBodyObject;
  operation?: string;
}

export interface MessageReactionBody {
  data?: MessageReactionUpdate[];
  object?: MessageBodyObject;
  operation?: string;
}

export interface MessageContext {
  company: { companyID: null | number };
  room: { roomID: null | number };
}

export interface SocketMessage {
  id: number;
  body?: MessageBody;
  context?: MessageContext;
  message: string;
  type: string;
  sentAt: Date;
  time: Date;
  right: boolean;
  userID: number;
}

export interface SocketUpdateMessage {
  id: number;
  body?: MessageReadBody;
  message: string;
  type: string;
  sentAt: Date;
  time: Date;
  right: boolean;
  userID: number;
}

export interface SocketReactionMessage {
  body?: MessageReactionBody;
  type: string;
}
export interface Me {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  profilePhotoUrl?: string | undefined | null;
  numberOfConnections?: number;
  uniqueId?: string;
  profileCategory?: UserProfileCategory;
}

export interface RoomDetail {
  id: number;
  imageUrl?: string;
  lastMessage?: ChatMessage | undefined | null;
  name: string;
  participants: ActiveUser[];
  readBy: number[];
  roomType: number;
  unreadCount: number;
  creator: Me | null;
  teamID: number | null;
}

export interface RoomItem {
  id: number;
  imageUrl?: string;
  lastActiveUsers: ActiveUser[];
  lastMessage?: ChatMessage | undefined | null;
  lastReadMessageID: number | null;
  name: string;
  roomType: number;
  unreadCount: number;
}

export interface RoomListResponse {
  data: RoomItem[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface TeamItem {
  id: number;
  companyID: number;
  flags: number;
  isDefaultTeam?: boolean;
  isTeamMember?: boolean;
  manager: ActiveUser;
  managerUserID: number;
  members: TeamMember[];
  name: string;
  ownerID: number | null;
  teamMembersCount: number;
  chatRoomID: number | null;
}

export interface TeamListResponse {
  data: TeamItem[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface ConnectionListResponse {
  data: ConnectionItem[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface TeamMember {
  id: number;
  invitedByUserID: number;
  memberUser: ActiveUser;
  memberUserID: number;
  teamID: number;
}

export interface UseChatRooms {
  chatRooms: ChatRoom[];
  activeRoomId: number;
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
  setActiveRoomId: React.Dispatch<React.SetStateAction<number>>;
  addChatRoom: (roomId: number, companyId: number | null) => void;
  addChatRooms: (roomIds: Array<number[]>, companyId: number | null) => void;
  hideChatRoom: (roomId: number, companyId: number | null) => void;
  expandChatRoom: (
    roomId: number,
    companyId: number | null,
    expanded: boolean
  ) => void;
  hideAllRoom: (companyId: number | null) => void;
  updateChatRooms: (chatRoom: ChatRoom) => void;
  loadPrevPage: (roomId: number) => Promise<ChatMessage[]>;
  loadNextPage: (roomId: number) => Promise<ChatMessage[]>;
  initializeChatRoom: (roomId: number) => Promise<void>;
  setLoadingPrev: (chatRoom: ChatRoom, loading: boolean) => void;
  setLoadingNext: (chatRoom: ChatRoom, loading: boolean) => void;
  removeFailedMessage: (roomId: number, trackingID: string) => void;
}

export interface UseCompany {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  selectedCompany: Company | null;
  setSelectedCompany: React.Dispatch<React.SetStateAction<Company | null>>;
}

export interface UseMe {
  me: Me | null;
  setMe: React.Dispatch<React.SetStateAction<Me | null>>;
}

export interface UserProfileCategory {
  id?: number;
  profileCategoryName?: string;
}

export interface UseRoomLists {
  companyRoomLists: CompanyRoomList[];
  activeRoomList: CompanyRoomList | null;
  loadingList: boolean;
  setLoadingList: React.Dispatch<React.SetStateAction<boolean>>;
  loadingNextPage: boolean;
  updateCompanyRoomLists: (companyRoomList: CompanyRoomList) => void;
  setCompanyRoomLists: React.Dispatch<React.SetStateAction<CompanyRoomList[]>>;
  loadNextPage: () => void;
  updateActiveRooms: () => void;
  setRoomListSearchTerm: (searchTerm: string) => void;
  getRoomItemById: (roomId: number) => RoomItem | null;
}

export interface UseTeamLists {
  companyTeamLists: CompanyTeamList[];
  activeTeamList: CompanyTeamList | null;
  loadingList: boolean;
  loadingNextPage: boolean;
  setCompanyTeamLists: React.Dispatch<React.SetStateAction<CompanyTeamList[]>>;
  loadNextPage: () => void;
  setTeamListSearchTerm: (searchTerm: string) => void;
  getTeamItemById: (teamId: number) => TeamItem | null;
}

export interface UseConnections {
  connectionList: ConnectionItem[];
  searchTerm: string;
  loadingList: boolean;
  loadingNextPage: boolean;
  hasMore: boolean;
  setConnectionList: React.Dispatch<React.SetStateAction<ConnectionItem[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  loadNextPage: () => void;
  setConnectionListSearchTerm: (searchTerm: string) => void;
  getConnectionItemById: (teamId: number) => ConnectionItem | null;
}

export interface Emojis {
  name: string;
  count?: number;
  userName?: Array<string>;
}

export interface ReactionUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  isOnline?: boolean;
  profilePhotoUrl?: string;
}

export interface Reaction {
  reaction: string;
}
