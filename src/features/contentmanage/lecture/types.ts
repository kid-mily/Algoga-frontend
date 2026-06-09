import type { ReactNode } from "react";

export interface AdminCourse {
  courseId: number;
  countryId: number;
  managerId?: number;
  title: string;
  description?: string;
  price?: number;
  mileage?: number;
  thumbnailUrl?: string | null;
  fileUrls?: string[];
  level?: string;
  levelName?: string;
  status?: string;
  countryName?: string;
  isPublic?: boolean;
  studentCount?: number;
  chapterCount?: number;
  createdAt?: string;
}

export type AdminCourseRecord = AdminCourse & {
  id?: number;
  course_id?: number;
  country_id?: number;
  country_name?: string;
  thumbnail_url?: string;
  is_public?: boolean | string;
  public?: boolean | string;
};

export interface CourseCountry {
  countryId: number;
  countryName: string;
  countryCode?: string;
  continentCode?: string;
  continentName?: string;
}

export interface CreateAdminCoursePayload {
  countryId: number;
  title: string;
  description: string;
  price: number;
  mileage?: number;
  level: string;
  status?: string;
  thumbnail: File;
  files?: File[];
}

export interface AdminChapter {
  chapterId: number;
  courseId?: number;
  title: string;
  description?: string;
  durationSeconds: number;
  chapterOrder: number;
  videoUrl?: string;
}

export type AdminChapterRecord = AdminChapter & {
  id?: number;
};

export interface CreateAdminChapterPayload {
  courseId: number;
  title: string;
  description: string;
  durationSeconds: number;
  chapterOrder: number;
  video: File;
}

export interface Student {
  userId: number;
  userName: string;
  email: string;
  enrolledAt: string;
}

export type UpdateLecturePayload = {
  countryId: number;
  title: string;
  description: string;
  price: number;
  mileage?: number;
  level: string;
  status: string;
  thumbnail?: File;
  files?: File[];
};

export type UpdateChapterPayload = {
  title: string;
  description: string;
  durationSeconds: number;
  chapterOrder: number;
  video?: File | null;
};

export type LectureFilterParams = {
  searchKeyword: string;
  countryFilter: string;
  statusFilter: string;
};

export type ChapterFormMode = "create" | "edit";

export interface ChapterFormData {
  id: number;
  title: string;
  description: string;
  duration: string;
  video: File | null;
  preview: string;
}

export type ChapterSubmitPayload = {
  title: string;
  description: string;
  duration: string;
  video: File;
};

export interface ChapterFormProps {
  mode?: ChapterFormMode;
  initialChapter?: ChapterFormData;
  onClose?: () => void;
  onSubmit?: (data: ChapterSubmitPayload) => Promise<boolean> | boolean | void;
}

export interface ChapterItemErrors {
  title?: string;
  description?: string;
  video?: string;
}

export interface ChapterItemProps {
  id: number;
  title: string;
  description: string;
  video: File | null;
  preview: string;
  errors?: ChapterItemErrors;
  onRemove: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onVideoUpload: (file: File) => void;
}

export interface ChapterListProps {
  lectureId: number;
  hideEdit?: boolean;
}

export interface ChapterCardProps {
  id: number;
  duration: string;
  title: string;
  description: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export type CreateChapterClientProps = {
  lectureId: number;
};

export type EditChapterClientProps = {
  lectureId: number;
  chapterId: number;
};

export interface LectureCardProps {
  thumbnail?: string | null;
  country?: string | null;
  title?: string | null;
  description?: string | null;
  price?: string | number | null;
  isPublic?: boolean;
  onChapterManage?: () => void;
  onUsersClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export type LectureCreateStepIndicatorProps = {
  step: 1 | 2;
};

export type EditLectureClientProps = {
  lectureId: number;
};

export type EditLecturePayload = {
  title: string;
  description: string;
  price: string;
  mileage?: string;
  isPublic: string;
  status?: string;
};

export interface LectureChapterDraft {
  id: number;
  title: string;
  description: string;
  video: File | null;
  preview: string;
  durationSeconds: number;
}

export interface LectureChapterFormProps {
  courseId: number;
  onPrev: () => void;
  onSubmit: () => void;
}

export type ChapterErrors = ChapterItemErrors;

export interface LectureFormProps {
  onNext?: (courseId: number) => void;
}

export interface CourseFormData {
  countryId: string;
  title: string;
  description: string;
  price: string;
  mileage: string;
  level: string;
  isPublic: string;
}

export type LectureRow = AdminCourseRecord;

export type LectureTableProps = {
  lectures: LectureRow[];
  totalCount: number;
  onChapterManage: (courseId: number) => void;
  onUsersClick: (course: { id: number; title: string }) => void;
  onEditClick: (courseId: number) => void;
  onDeleteClick: (courseId: number) => void;
  children?: ReactNode;
};

export type LecturePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type LectureToolbarProps = {
  searchKeyword: string;
  countryFilter: string;
  statusFilter: string;
  countryOptions: string[];
  onSearchKeywordChange: (value: string) => void;
  onCountryFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
};

export interface LectureUpdateFormProps {
  initialData: {
    country: string;
    title: string;
    description: string;
    price: string;
    mileage: string;
    isPublic?: string;
  };
  onSubmit?: (
    data: EditLecturePayload,
    thumbnailFile?: File,
    attachmentFiles?: File[]
  ) => void | Promise<boolean> | boolean;
}

export type StudentRow = {
  id: number;
  name: string;
  lecture: string;
  email: string;
  status: "complete" | "progress";
  progress: number;
  quizComplete: boolean;
  reviewWritten: boolean;
  createdAt: string;
};

export interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  courseId: number | null;
  courseTitle?: string;
}

export interface StudentItemProps extends StudentRow {
  checked: boolean;
  onCheck: () => void;
}
