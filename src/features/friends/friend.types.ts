export interface Friend {
  relationId: number;
  userId: number;
  nickname: string;
  personalCode: string;
  profileImageUrl: string | null;
  isFavorite: boolean;
  isOnline: boolean;
}

export type FriendFilter = "all" | "favorite";

export interface FriendSearchResult {
  userId: number;
  nickname: string;
  personalCode: string;
  profileImageUrl: string | null;
  isOnline: boolean;
  requestAvailable: boolean;
  unavailableMessage: string | null;
}