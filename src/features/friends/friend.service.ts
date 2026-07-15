import { api, ApiResult, unwrapData } from "@/lib/api";
import { Friend } from "./friend.types";

type FriendResponse = {
  relationId: number;
  userId: number;
  nickname: string;
  personalCode: string;
  profileImageUrl: string | null;
  isFavorite: boolean;
  isOnline: boolean;
};

const normalizeFriend = (friend: FriendResponse): Friend => ({
  relationId: friend.relationId,
  userId: friend.userId,
  nickname: friend.nickname,
  personalCode: friend.personalCode,
  profileImageUrl: friend.profileImageUrl || null,
  isFavorite: friend.isFavorite,
  isOnline: friend.isOnline,
});

export const getFriends = async (
  signal?: AbortSignal
): Promise<Friend[]> => {
  const response = await api.get<ApiResult<FriendResponse[]>>(
    "/api/v1/friends",
    {
      signal,
      suppressGlobalError: true,
    }
  );

  const friends = unwrapData(response);

  if (!Array.isArray(friends)) {
    return [];
  }

  return friends
    .map(normalizeFriend)
    .filter((friend) => friend.relationId > 0 && friend.userId > 0);
};