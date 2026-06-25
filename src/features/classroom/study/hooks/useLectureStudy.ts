"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { isChapterCompleted, loadLectureStudy, saveChapterProgress, sortChapters } from "../actions";
import type { ChapterProgress, CourseStudyChapter, CourseStudyDetail } from "../types";

export function useLectureStudy(
    courseId: string,
) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const lastReportedSecondsRef = useRef(0);
    const [course, setCourse] = useState<CourseStudyDetail | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<CourseStudyChapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const chapters = useMemo(() => {
        return sortChapters(
        course?.chapters ?? [],
        );
    }, [course]);

    const serverCourseProgress = course?.courseProgressRate;

    const totalProgress = useMemo(() => {
        if (
            typeof serverCourseProgress === "number"
        ) {
            return Math.min(
                Math.max(Math.round(serverCourseProgress), 0,), 100);
        }

        if (chapters.length === 0) {
            return 0;
        }

        const sum = chapters.reduce(
            (total, chapter) =>
                total + (chapter.progressRate ?? 0), 0);

            return Math.round(
                sum / chapters.length,
            );
        }, [
            chapters,
            serverCourseProgress,
        ]);

        const canOpenChapter = (chapterIndex: number) => {
            if (chapterIndex === 0) {
            return true;
        }

        const chapter = chapters[chapterIndex];

        if (chapter?.locked) {
            return false;
        }

        const previousChapter = chapters[chapterIndex - 1];

        return previousChapter
        ? isChapterCompleted(
            previousChapter,
        )
        : false;
    };

    const selectChapter = (
        chapter: CourseStudyChapter,
    ) => {
        setSelectedChapter(chapter);
        setIsPlaying(false);

        lastReportedSecondsRef.current = chapter.watchedSeconds ?? 0;
    };

    const moveToNextChapter = async (progress: ChapterProgress) => {
        if (!progress.nextChapterUnlocked || progress.nextChapterId === null) {
            return;
        }

        try {
            const {
            course: refreshedCourse,
            } = await loadLectureStudy(courseId);

            const refreshedChapters = sortChapters(refreshedCourse.chapters ?? []);
            const nextChapter = refreshedChapters.find(
            (chapter) => chapter.chapterId === progress.nextChapterId
            );

            setCourse({
            ...refreshedCourse,
            chapters: refreshedChapters,
            });

            if (!nextChapter) return;

            selectChapter(nextChapter);
        } catch (error) {
            console.error("[study] 다음 챕터 정보 갱신 실패:", error);

            const nextChapter = chapters.find(
            (chapter) => chapter.chapterId === progress.nextChapterId
            );

            if (!nextChapter) return;

            selectChapter({
            ...nextChapter,
            locked: false,
            });
        }
        };
        
        useEffect(() => {
        if (!courseId) return;

        const controller = new AbortController();

        const fetchCourse = async () => {
            try {
                setIsLoading(true);
                setErrorMessage("");

                const {
                    course: fetchedCourse,
                    firstChapter,
                } = await loadLectureStudy(
                    courseId,
                    controller.signal,
                );

                if (
                    controller.signal.aborted
                ) {
                    return;
                }

                setCourse(fetchedCourse);
                setSelectedChapter(
                    firstChapter,
                );

                lastReportedSecondsRef.current = firstChapter?.watchedSeconds ?? 0;
            } catch (error) {
                if (
                    controller.signal.aborted
                ) {
                    return;
                }

                console.error("[study] 강의 학습 정보 조회 실패:", error);

                if (
                    error instanceof
                        ApiRequestError &&
                    error.status === 401
                ) {
                    router.replace("/auth/login");
                    return;
                }

                setErrorMessage(
                    error instanceof Error
                    ? error.message
                    : "강의 정보를 불러오지 못했습니다.",
                );
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setIsLoading(false);
                }
            }
        };

        void fetchCourse();

        return () => {
            controller.abort();
        };
    }, [courseId, router]);

    const reportProgress = async (
        watchedSeconds: number,
        force = false,
    ): Promise<ChapterProgress | null> => {
        if (
            !selectedChapter || !courseId
        ) {
            return null;
        }

        const seconds = Math.floor(watchedSeconds);

        const difference = seconds - lastReportedSecondsRef.current;

        // timeupdate에서는 10초 단위,
        // pause/ended에서는 강제 저장
        if (
            !force &&
            difference < 10
        ) {
            return null;
        }

        lastReportedSecondsRef.current = seconds;

        try {
        const progress =
            await saveChapterProgress(
                courseId,
                selectedChapter.chapterId,
                seconds,
            );

        setCourse(
            (previousCourse) => {
                if (!previousCourse) {
                    return previousCourse;
                }

            return {
                ...previousCourse,

                // 백엔드가 계산한 전체 진도율
                courseProgressRate: progress.courseProgressRate,

                // 백엔드가 판단한 퀴즈 활성화
                quizAvailable: progress.quizAvailable,

                chapters: previousCourse.chapters.map(
                    (chapter) => {
                    // 현재 챕터 갱신
                    if (
                        chapter.chapterId === selectedChapter.chapterId
                    ) {
                        return {
                            ...chapter,
                            watchedSeconds: progress.watchedSeconds,
                            progressRate: progress.progressRate,
                            completed: progress.completed,
                        };
                    }

                    // 다음 챕터 잠금 해제
                    if (
                        progress.nextChapterUnlocked &&
                        progress.nextChapterId ===
                        chapter.chapterId
                    ) {
                        return {
                            ...chapter,
                            locked: false,
                        };
                    }

                    return chapter;
                    },
                ),
            };
            },
        );

        setSelectedChapter(
            (previousChapter) =>
            previousChapter &&
            previousChapter.chapterId ===
                selectedChapter.chapterId
                ? {
                    ...previousChapter,
                    watchedSeconds:
                    progress.watchedSeconds,
                    progressRate:
                    progress.progressRate,
                    completed:
                    progress.completed,
                }
                : previousChapter,
        );

        return progress;
        } catch (error) {
        console.error(
            "[study] 진도 업데이트 실패:",
            error,
        );

        return null;
        }
    };

    const handleChapterSelect =
        async (
        chapter: CourseStudyChapter,
        chapterIndex: number,
        ) => {
        if (
            !canOpenChapter(
            chapterIndex,
            )
        ) {
            return;
        }

        if (
            selectedChapter?.chapterId ===
            chapter.chapterId
        ) {
            return;
        }

        const currentTime =
            videoRef.current?.currentTime;

        if (
            typeof currentTime ===
            "number" &&
            Number.isFinite(currentTime)
        ) {
            await reportProgress(
            currentTime,
            true,
            );
        }

        selectChapter(chapter);
        };

    const handleVideoEnded = async (currentTime: number) => {
        setIsPlaying(false);

        const progress = await reportProgress(currentTime, true);

        if (progress?.completed && progress.nextChapterUnlocked) {
            await moveToNextChapter(progress);
        }
    };

    return {
        videoRef,
        course,
        chapters,
        selectedChapter,
        isLoading,
        isPlaying,
        errorMessage,
        totalProgress,
        canOpenChapter,
        setIsPlaying,
        reportProgress,
        handleChapterSelect,
        handleVideoEnded,
    };
}
