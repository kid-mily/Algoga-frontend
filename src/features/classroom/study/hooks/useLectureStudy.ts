"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { isChapterCompleted, loadLectureStudy, saveChapterProgress, sortChapters } from "../actions";
import { ChapterProgress, CourseStudyChapter, CourseStudyDetail } from "../types";

export function useLectureStudy(courseId: string) {
    const router = useRouter();

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const lastReportedSecondsRef = useRef(0);

    const [course, setCourse] = useState<CourseStudyDetail | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<CourseStudyChapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const chapters = useMemo(() => {
        return sortChapters(course?.chapters ?? []);
    }, [course]);

    const selectedChapterIndex = useMemo(() => {
        return chapters.findIndex((c) => c.chapterId === selectedChapter?.chapterId);
    }, [chapters, selectedChapter]);

    const totalProgress = useMemo(() => {
        if (chapters.length === 0) return 0;
        const sum = chapters.reduce((total, c) => total + (c.progressRate ?? 0), 0);
        return Math.round(sum / chapters.length);
    }, [chapters]);

    const canOpenChapter = (chapterIndex: number) => {
        if (chapterIndex === 0) return true;

        const chapter = chapters[chapterIndex];
        if (chapter?.locked) return false;

        const previousChapter = chapters[chapterIndex - 1];
        return previousChapter ? isChapterCompleted(previousChapter) : false;
    };

    const selectChapter = (chapter: CourseStudyChapter) => {
        setSelectedChapter(chapter);
        setIsPlaying(false);
        lastReportedSecondsRef.current = chapter.watchedSeconds ?? 0;
    };

    const moveToNextChapter = () => {
        if (selectedChapterIndex < 0) return;

        const nextChapterIndex = selectedChapterIndex + 1;
        const nextChapter = chapters[nextChapterIndex];

        if (nextChapter && canOpenChapter(nextChapterIndex)) {
        selectChapter(nextChapter);
        }
    };

    useEffect(() => {
        if (!courseId) return;

        const controller = new AbortController();

        const fetchCourse = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const { course: fetchedCourse, firstChapter } = await loadLectureStudy(
            courseId,
            controller.signal
            );

            setCourse(fetchedCourse);
            setSelectedChapter(firstChapter);
            lastReportedSecondsRef.current = firstChapter?.watchedSeconds ?? 0;
        } catch (error) {
            if (controller.signal.aborted) return;

            console.error("[study] 강의 학습 정보 조회 실패:", error);

            if (error instanceof ApiRequestError && error.status === 401) {
            router.replace("/auth/login");
            return;
            }

            setErrorMessage(
            error instanceof Error ? error.message : "강의 정보를 불러오지 못했습니다."
            );
        } finally {
            if (!controller.signal.aborted) {
            setIsLoading(false);
            }
        }
        };

        fetchCourse();

        return () => {
        controller.abort();
        };
    }, [courseId, router]);

    const reportProgress = async (watchedSeconds: number, force = false) => {
        if (!selectedChapter || !courseId) return null;

        const seconds = Math.floor(watchedSeconds);
        const diff = seconds - lastReportedSecondsRef.current;

        // timeupdate에서는 10초 단위 저장, pause/ended에서는 강제 저장
        if (!force && diff < 10) return null;

        lastReportedSecondsRef.current = seconds;

        try {
        const progress = await saveChapterProgress(
            courseId,
            selectedChapter.chapterId,
            seconds
        );

        setCourse((prev) => {
            if (!prev) return prev;

            return {
            ...prev,
            chapters: prev.chapters.map((c) =>
                c.chapterId === selectedChapter.chapterId
                ? {
                    ...c,
                    watchedSeconds: progress.watchedSeconds,
                    progressRate: progress.progressRate,
                    completed: progress.completed,
                    }
                : c
            ),
            };
        });

        setSelectedChapter((prev) =>
            prev && prev.chapterId === selectedChapter.chapterId
            ? {
                ...prev,
                watchedSeconds: progress.watchedSeconds,
                progressRate: progress.progressRate,
                completed: progress.completed,
                }
            : prev
        );

        return progress;
        } catch (error) {
        console.error("[study] 진도 업데이트 실패:", error);
        return null;
        }
    };

    const handleChapterSelect = async (chapter: CourseStudyChapter, chapterIndex: number) => {
        if (!canOpenChapter(chapterIndex)) return;
        if (selectedChapter?.chapterId === chapter.chapterId) return;

        const currentTime = videoRef.current?.currentTime;

        // 챕터를 바꾸기 전에 현재 챕터의 마지막 시청 위치를 강제 보존
        if (typeof currentTime === "number" && Number.isFinite(currentTime)) {
        await reportProgress(currentTime, true);
        }

        selectChapter(chapter);
    };

    const handleVideoEnded = async (currentTime: number) => {
        setIsPlaying(false);

        // 비디오가 끝나면 진도를 강제 저장하고 완료 판정 시 다음으로 자동 이동
        const progress: ChapterProgress | null = await reportProgress(currentTime, true);
        if (progress?.completed) {
        moveToNextChapter();
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