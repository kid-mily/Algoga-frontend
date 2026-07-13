import type { Friend } from "./friend.types";

// 디자인 확인용 더미 친구 목록 (실제 API 연동 없음)
export const DUMMY_FRIENDS: Friend[] = [
  {
    friendId: 1,
    nickname: "김여행",
    userId: "travel_kim",
    profileImageUrl: null,
    isFavorite: true,
  },
  {
    friendId: 2,
    nickname: "박세계",
    userId: "world_park",
    profileImageUrl: null,
    isFavorite: false,
  },
  {
    friendId: 3,
    nickname: "이지도",
    userId: "map_lee",
    profileImageUrl: null,
    isFavorite: true,
  },
  {
    friendId: 4,
    nickname: "최유럽",
    userId: "euro_choi",
    profileImageUrl: null,
    isFavorite: false,
  },
  {
    friendId: 5,
    nickname: "정아시아",
    userId: "asia_jung",
    profileImageUrl: null,
    isFavorite: false,
  },
  {
    friendId: 6,
    nickname: "한오세아니아",
    userId: "oceania_han",
    profileImageUrl: null,
    isFavorite: false,
  },
];
