import type { CourseStudyChapter } from "@/features/services/courseStudy.service";

export type LearningMode =
    | "study"
    | "quiz"
    | "complete";

export interface LearningSidebarProps {
    courseTitle: string;
    chapters: CourseStudyChapter[];
    selectedChapterId?: number;
    quizAvailable: boolean;
    courseCompleted?: boolean;
    mode: LearningMode;
    lectureHref: string;
    studyHref: string;
    quizHref: string;
    quizResultHref: string;
    certificateHref: string;
    qnaHref: string;
    onChapterSelect?: (
        chapter: CourseStudyChapter,
        chapterIndex: number
    ) => void;
}