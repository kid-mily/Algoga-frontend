// 친구 목록 패널에서 사용하는 타입 모음

export interface Friend {
  friendId: number;
  nickname: string;
  userId: string;
  profileImageUrl?: string | null;
  isFavorite: boolean;
}

export type FriendFilter = "all" | "favorite";
