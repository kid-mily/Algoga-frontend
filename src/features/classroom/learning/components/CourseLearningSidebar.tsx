"use client";

import Link from "next/link";
import type { LearningSidebarProps } from "../types";
import {
    areAllChaptersCompleted,
    canOpenChapter,
    formatChapterDuration,
    getTotalProgress,
    sortChapters,
} from "../actions";

export default function CourseLearningSidebar({
    courseTitle,
    chapters,
    selectedChapterId,
    quizAvailable,
    quizSubmitted = false,
    courseCompleted = false,
    mode,
    lectureHref,
    quizHref,
    quizResultHref,
    certificateHref,
    qnaHref,
    onChapterSelect,
}: LearningSidebarProps) {

    // 데이터 가공 및 상태 판정
    const orderedChapters = sortChapters(chapters);
    const totalProgress = Math.min(Math.max(getTotalProgress(orderedChapters), 0), 100);
    const allChaptersCompleted = areAllChaptersCompleted(orderedChapters);
    const quizUnlocked = quizAvailable && allChaptersCompleted;

    // 💡 스타일 추출: 버튼 활성화/비활성화 상태에 따른 스타일
    const getButtonStyles = (isActive: boolean) => {
        const base = "flex w-full items-start gap-3 rounded-[18px] border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40";
        const state = isActive
        ? "border-[#6D9F9B] bg-[#EFF7FF] shadow-sm"
        : "border-transparent hover:bg-[#F6FAFD]";
        return `${base} ${state}`;
    };

    // 💡 스타일 추출: 배지 컬러 분기 처리
    const getBadgeStyles = (isChapterCompleted: boolean, isActive: boolean) => {
        const base = "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold";
        if (isChapterCompleted) return `${base} bg-[#2F9E6F] text-white`;
        if (isActive) return `${base} bg-[#DDEFF0] text-[#5E9F9B]`;
        return `${base} bg-[#F0F3F6] text-[#9AA8B8]`;
    };

    return (
        <aside className="flex min-h-[calc(100dvh-64px)] w-[280px] shrink-0 flex-col border-r border-[#E6ECF2] bg-white">
        {/* 강의 정보 헤더 */}
        <header className="shrink-0 bg-[#EFF6FF] px-4 pb-5 pt-4">
            <Link href={lectureHref} className="text-xs font-semibold text-[#6B9DCC]">
            &lt; 클래스룸으로
            </Link>

            <div className="mt-3 flex items-start justify-between gap-2">
            <h1 className="line-clamp-2 min-w-0 text-lg font-bold text-[#0A1628]">
                {courseTitle}
            </h1>
            {courseCompleted && (
                <span className="shrink-0 rounded-full bg-[#DFF5E7] px-2.5 py-1 text-[10px] font-bold text-[#2F8C59]">
                수료 완료
                </span>
            )}
            </div>

            {courseCompleted && (
            <p className="mt-2 text-xs leading-5 text-[#5E7D79]">
                수료한 강의입니다. 자유롭게 복습할 수 있습니다.
            </p>
            )}

            <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-[#8A9BB0]">전체 진도</span>
            <strong className="text-[#2F9E6F]">{totalProgress}%</strong>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#D8EAF7]">
            <div
                className="h-full rounded-full bg-[#2F9E6F]"
                style={{ width: `${totalProgress}%` }}
            />
            </div>
        </header>

        {/* 챕터 및 퀴즈 목록 */}
        <nav className="flex-1 px-3 py-2">
            <ol className="space-y-2">
            {orderedChapters.map((chapter, index) => {
                const isActive = mode === "study" && selectedChapterId === chapter.chapterId;
                const isOpen = courseCompleted || canOpenChapter(orderedChapters, index);

                return (
                <li key={chapter.chapterId}>
                    <button
                    type="button"
                    disabled={!isOpen}
                    onClick={() => onChapterSelect?.(chapter, index)}
                    className={getButtonStyles(isActive)}
                    >
                    <span className={getBadgeStyles(!!chapter.completed, isActive)}>
                        {chapter.completed ? "✓" : index + 1}
                    </span>

                    <span className="min-w-0 flex-1">
                        <strong className="block truncate text-sm text-[#243247]">
                        챕터 {chapter.chapterOrder}. {chapter.title}
                        </strong>

                        <span className="mt-1.5 flex items-center justify-between text-xs text-[#A1AEC0]">
                        <span>{formatChapterDuration(chapter.durationSeconds)}</span>
                        {isOpen ? (
                            <strong className="text-[#2F9E6F]">{chapter.progressRate ?? 0}%</strong>
                        ) : (
                            <span>잠금</span>
                        )}
                        </span>
                    </span>
                    </button>
                </li>
                );
            })}

            {/* 퀴즈 메뉴 분기 영역 */}
            <li>
                {quizSubmitted || courseCompleted ? (
                <Link
                    href={quizResultHref}
                    className={`flex items-center gap-3 rounded-[18px] border px-4 py-2 transition ${
                    mode === "complete" ? "border-[#6D9F9B] bg-[#EFF7FF] shadow-sm" : "border-transparent hover:bg-[#F6FAFD]"
                    }`}
                >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2F9E6F] text-xs font-bold text-white">✓</span>
                    <span className="min-w-0">
                    <strong className="block text-sm text-[#243247]">퀴즈 결과 보기</strong>
                    <small className="block truncate text-[#8A9BB0]">제출한 답과 해설 확인</small>
                    </span>
                </Link>
                ) : quizUnlocked ? (
                <Link
                    href={quizHref}
                    className={`flex items-center gap-3 rounded-[18px] border px-4 py-2 transition ${
                    mode === "quiz" ? "border-[#6D9F9B] bg-[#EFF7FF] shadow-sm" : "border-transparent hover:bg-[#F6FAFD]"
                    }`}
                >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2F9E6F] text-xs font-bold text-white">
                    {orderedChapters.length + 1}
                    </span>
                    <strong className="text-sm text-[#243247]">퀴즈 풀기</strong>
                </Link>
                ) : (
                <div className="flex items-center gap-3 rounded-[18px] px-4 py-3 opacity-40">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0F3F6] text-xs font-bold">
                    {orderedChapters.length + 1}
                    </span>
                    <span>
                    <strong className="block text-sm">퀴즈 풀기</strong>
                    <small className="text-[#8A9BB0]">모든 챕터 완료 후 응시</small>
                    </span>
                </div>
                )}
            </li>
            </ol>
        </nav>

        {/* 하단 고정 영역 (Q&A) */}
            <div className="shrink-0 border-t border-[#E6ECF2]"></div>

        <div className="shrink-0 p-3">
            <Link
            href={qnaHref}
            className="flex h-11 items-center justify-center rounded-2xl border-2 border-[#6D9F9B] bg-white text-xs font-bold text-[#5E9F9B] transition hover:bg-[#F0FAFA]"
            >
            Q&A 등록/조회
            </Link>
        </div>
    </aside>
    );
}
