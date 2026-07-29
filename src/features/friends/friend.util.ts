import type { Friend } from "./friend.types";

// 닉네임/개인 코드로 친구를 필터링한다 (FriendList/FriendPanel 검색창에서 공용으로 사용)
export function filterFriendsByKeyword(
  friends: Friend[],
  keyword: string
): Friend[] {
  const normalized = keyword.trim().toLowerCase();

  if (!normalized) return friends;

  return friends.filter(
    (friend) =>
      friend.nickname.toLowerCase().includes(normalized) ||
      friend.personalCode.toLowerCase().includes(normalized)
  );
}
