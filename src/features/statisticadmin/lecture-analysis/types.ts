export type CourseEnrollmentStatistic = {
  courseId: number;
  courseTitle: string;
  studentCount: number;
  averageProgressRate: number;
  completionRate: number;
  averageLearningHours: number;
};

export type CourseEnrollmentPage = {
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  content: CourseEnrollmentStatistic[];
};
