export type ReviewLevel = "초급" | "중급" | "고급";

export type AdminReview = {
  id: number;
  level: ReviewLevel;
  packageName: string;
  rating: number;
  user: string;
  userId: string;
  content: string;
  completedAt: string;
  reviewedAt: string;
};

export const reviewScoreFilters = ["전체", "5점", "4점", "3점", "2점", "1점"];

export const mockReviews: AdminReview[] = [
  {
    id: 1,
    level: "중급",
    packageName: "도쿄 완전 정복 패키지",
    rating: 5.0,
    user: "김여행",
    userId: "U001",
    content:
      "정말 알찬 강의였습니다. 도쿄 여행 준비에 큰 도움이 됐어요. 특히 현지 교통 이용법이 매우 유용했습니다.",
    completedAt: "2024.06.05",
    reviewedAt: "2024.06.08",
  },
  {
    id: 2,
    level: "중급",
    packageName: "도쿄 완전 정복 패키지",
    rating: 4.0,
    user: "이튼튼",
    userId: "U002",
    content:
      "내용이 알차고 강사님 설명이 친절해요. 다음에 고급 과정도 수강할 예정입니다.",
    completedAt: "2024.06.04",
    reviewedAt: "2024.06.07",
  },
  {
    id: 3,
    level: "고급",
    packageName: "파리 럭셔리 투어",
    rating: 5.0,
    user: "박트래블",
    userId: "U003",
    content:
      "파리 여행을 준비하면서 이 강의 덕분에 완벽한 일정을 짤 수 있었어요. 숙소 선택 팁이 특히 좋았습니다.",
    completedAt: "2024.06.03",
    reviewedAt: "2024.06.06",
  },
  {
    id: 4,
    level: "초급",
    packageName: "뉴욕 자유여행",
    rating: 3.0,
    user: "최글로벌",
    userId: "U004",
    content:
      "기초적인 내용 위주라 아쉬웠지만, 처음 해외여행 준비하는 분들께는 좋을 것 같아요.",
    completedAt: "2024.06.01",
    reviewedAt: "2024.06.05",
  },
  {
    id: 5,
    level: "고급",
    packageName: "런던 프리미엄",
    rating: 5.0,
    user: "정월드",
    userId: "U005",
    content:
      "런던 여행의 모든 것이 담겨 있는 느낌이에요. 박물관 예약 방법이나 현지 팁들이 정말 실용적이었습니다.",
    completedAt: "2024.05.30",
    reviewedAt: "2024.06.04",
  },
];
