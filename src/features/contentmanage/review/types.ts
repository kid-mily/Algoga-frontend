export type ReviewLevel = "초급" | "중급" | "고급";

export type AdminReview = {
  id: number;
  courseId: number;
  level: ReviewLevel;
  packageName: string;
  rating: number;
  user: string;
  userId: string;
  content: string;
  completedAt: string;
  reviewedAt: string;
  hidden: boolean;
};

export const reviewScoreFilters = ["전체", "5점", "4점", "3점", "2점", "1점"];
