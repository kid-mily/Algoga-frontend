import type { CourseStudyChapter } from "@/features/services/courseStudy.service";

export const sortChapters = (chapters: CourseStudyChapter[]) =>
    [...chapters].sort((a, b) => a.chapterOrder - b.chapterOrder);

export const areAllChaptersCompleted = (
    chapters: CourseStudyChapter[]
) =>
    chapters.length > 0 &&
    chapters.every((chapter) => chapter.completed === true);

export const getTotalProgress = (
    chapters: CourseStudyChapter[]
) => {
    if (chapters.length === 0) return 0;

    const total = chapters.reduce(
        (sum, chapter) => sum + (chapter.progressRate ?? 0),
        0
    );
    
    return Math.round(total / chapters.length);
};

export const canOpenChapter = (
    chapters: CourseStudyChapter[],
    index: number
) => {
    if (index === 0) return !chapters[index]?.locked;
    
    return (
        !chapters[index]?.locked &&
        chapters[index - 1]?.completed === true
    );
};

export const formatChapterDuration = (seconds?: number) =>
    `${Math.ceil((seconds ?? 0) / 60)}분`;