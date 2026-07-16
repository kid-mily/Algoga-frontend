import { api, type ApiResult, unwrapData } from "@/lib/api";
import type { Friend } from "./friend.types";

type FriendResponse = {
  relationId: number;
  userId: number;
  nickname: string;
  personalCode: string;
  profileImageUrl: string | null;
  isFavorite: boolean;
  isOnline: boolean;
};

const normalizeFriend = (
  friend: FriendResponse
): Friend => ({
  relationId: friend.relationId,
  userId: friend.userId,
  nickname: friend.nickname,
  personalCode: friend.personalCode,
  profileImageUrl:
    friend.profileImageUrl || null,
  isFavorite: friend.isFavorite,
  isOnline: friend.isOnline,
});

const getFriendList = (response: ApiResult<FriendResponse[]>): Friend[] => {
  const friends = unwrapData(response);

  if (!Array.isArray(friends)) return [];

  return friends.map(normalizeFriend).filter((friend) => friend.userId > 0);
};

export const getFriends = async (
  signal?: AbortSignal
): Promise<Friend[]> => {
  const response = await api.get<ApiResult<FriendResponse[]>>("/api/v1/friends", {
    signal,
    suppressGlobalError: true,
  });

  return getFriendList(response).filter((friend) => friend.relationId > 0);
};

export const searchUserByCode = async (code: string): Promise<Friend> => {
  const response = await api.get<ApiResult<FriendResponse>>("/api/v1/users/search", {
    params: { code },
    suppressGlobalError: true,
  });

  return normalizeFriend(unwrapData(response));
};

export const sendFriendRequest = async (targetUserCode: string): Promise<void> => {
  await api.post<ApiResult<null>>(
    "/api/v1/friends/requests",
    { targetUserCode },
    { suppressGlobalError: true }
  );
};

export const getReceivedFriendRequests = async (
  signal?: AbortSignal
): Promise<Friend[]> => {
  const response = await api.get<ApiResult<FriendResponse[]>>(
    "/api/v1/friends/requests/received",
    { signal, suppressGlobalError: true }
  );

  return getFriendList(response).filter((friend) => friend.relationId > 0);
};

export const acceptFriendRequest = async (requestId: number): Promise<void> => {
  await api.patch<ApiResult<null>>(
    `/api/v1/friends/requests/${requestId}/accept`,
    undefined,
    { suppressGlobalError: true }
  );
};

export const rejectFriendRequest = async (requestId: number): Promise<void> => {
  await api.patch<ApiResult<null>>(
    `/api/v1/friends/requests/${requestId}/reject`,
    undefined,
    { suppressGlobalError: true }
  );
};

export const deleteFriend = async (relationId: number): Promise<void> => {
  await api.delete<ApiResult<null>>(`/api/v1/friends/${relationId}`, {
    suppressGlobalError: true,
  });
};

export const getBlockedUsers = async (signal?: AbortSignal): Promise<Friend[]> => {
  const response = await api.get<ApiResult<FriendResponse[]>>("/api/v1/friends/blocks", {
    signal,
    suppressGlobalError: true,
  });

  return getFriendList(response);
};

export const blockUser = async (targetUserCode: string): Promise<void> => {
  await api.post<ApiResult<null>>(
    "/api/v1/friends/blocks",
    { targetUserCode },
    { suppressGlobalError: true }
  );
};

export const unblockUser = async (targetUserCode: string): Promise<void> => {
  await api.delete<ApiResult<null>>(
    `/api/v1/friends/blocks/${encodeURIComponent(targetUserCode)}`,
    { suppressGlobalError: true }
  );
};

export const toggleFriendFavorite = async (
  relationId: number
): Promise<void> => {
  await api.patch<ApiResult<null>>(`/api/v1/friends/${relationId}/favorite`, undefined, {
      suppressGlobalError: true,
    }
  );
};
