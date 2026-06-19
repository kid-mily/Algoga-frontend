import Link from "next/link";
import { CourseStudyChapter, CourseStudyDetail } from "../types";
import { formatDuration, isChapterCompleted } from "../actions";

interface Props {
    course: CourseStudyDetail;
    chapters: CourseStudyChapter[];
    selectedChapter: CourseStudyChapter | null;
    totalProgress: number;
    continentCode: string;
    countryId: string;
    courseId: string;
    canOpenChapter: (chapterIndex: number) => boolean;
    onChapterSelect: (chapter: CourseStudyChapter, chapterIndex: number) => void;
}

export default function StudySidebar({
    course,
    chapters,
    selectedChapter,
    totalProgress,
    continentCode,
    countryId,
    courseId,
    canOpenChapter,
    onChapterSelect,
}: Props) {
    
    const getButtonStyles = (isActive: boolean) => {
        const base = "flex w-full items-start gap-3 rounded-[22px] border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-45";
        const state = isActive
        ? "border-[#6D9F9B] bg-[#EFF7FF] shadow-sm"
        : "border-transparent bg-white hover:bg-[#F6FAFD]";
        return `${base} ${state}`;
    };

    const getBadgeStyles = (isCompleted: boolean, isActive: boolean) => {
        const base = "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold";
        let state = "bg-[#F0F3F6] text-[#B6C2CF]"; 
        
        if (isCompleted) state = "bg-[#6D9F9B] text-white";
        else if (isActive) state = "bg-[#DDEFF0] text-[#5E9F9B]";
        
        return `${base} ${state}`;
    };

    return (
        <aside className="sticky top-0 flex h-screen flex-col border-r border-[#E8EEF5] bg-white">
        {/* 상단 헤더 영역 */}
        <header className="bg-[#EFF6FF] px-5 pb-6 pt-7">
            <Link
            href={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
            className="text-sm font-semibold text-[#6B9DCC]"
            >
            &lt; 클래스룸으로
            </Link>

            <h1 className="mt-5 line-clamp-2 text-[20px] font-bold text-[#0A1628]">
            {course.title}
            </h1>

            <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-[#8A9BB0]">전체 진도</span>
                <span className="font-bold text-[#5E9F9B]">{totalProgress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#D8EAF7]">
                <div
                className="h-full rounded-full bg-[#6D9F9B]"
                style={{ width: `${totalProgress}%` }}
                />
            </div>
            </div>
        </header>

        {/* 중간 챕터 및 퀴즈 리스트 영역 */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ol className="space-y-3">
            {/* 1. 챕터 리스트 렌더링 */}
            {chapters.map((chapter, index) => {
                const isActive = selectedChapter?.chapterId === chapter.chapterId;
                const isCompleted = isChapterCompleted(chapter);
                const isOpen = canOpenChapter(index);
                const progress = chapter.progressRate ?? 0;

                return (
                <li key={chapter.chapterId}>
                    <button
                    type="button"
                    disabled={!isOpen}
                    onClick={() => onChapterSelect(chapter, index)}
                    className={getButtonStyles(isActive)}
                    >
                    {/* 왼쪽 순번 배지 (완료 시 체크마크) */}
                    <span className={getBadgeStyles(isCompleted, isActive)}>
                        {isCompleted ? "✓" : index + 1}
                    </span>

                    {/* 우측 텍스트 정보 */}
                    <span className="min-w-0 flex-1">
                        <strong
                        className={`block truncate text-[15px] font-bold ${
                            isActive ? "text-[#5E9F9B]" : "text-[#243247]"
                        }`}
                        >
                        챕터 {chapter.chapterOrder}. {chapter.title}
                        </strong>

                        <span className="mt-2 flex items-center justify-between text-xs text-[#A1AEC0]">
                        <span>{formatDuration(chapter.durationSeconds)}</span>

                        {/* 진도율 및 잠금 상태 표시 */}
                        {!isOpen && <span>잠금</span>}
                        {isOpen && progress > 0 && (
                            <span className="font-bold text-[#5E9F9B]">{progress}%</span>
                        )}
                        </span>
                    </span>
                    </button>
                </li>
                );
            })}

            {/* 2. 퀴즈 활성화 시 표시되는 링크 아이템 */}
            {course.quizAvailable && (
                <li>
                <Link
                    href={`/classroom/${continentCode}/${countryId}/lecture/${courseId}/quiz`}
                    className="flex w-full items-start gap-3 rounded-[22px] border border-transparent bg-white px-4 py-4 text-left text-[#243247] transition hover:bg-[#F6FAFD]"
                >
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0F3F6] text-xs font-bold text-[#B6C2CF]">
                    {chapters.length + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                    <strong className="block text-[15px] font-bold text-[#243247]">
                        퀴즈 풀기
                    </strong>
                    <span className="mt-2 block text-xs text-[#A1AEC0]">
                        단원 마무리 테스트
                    </span>
                    </span>
                </Link>
                </li>
            )}
            </ol>
        </nav>

        {/* 하단 Q&A 바로가기 영역 */}
        <div className="border-t border-[#E8EEF5] p-4">
            <Link
            href={`/classroom/${continentCode}/${countryId}/lecture/${courseId}/qna`}
            className="flex h-14 items-center justify-center rounded-[18px] border-2 border-[#8AB9B7] bg-white text-[15px] font-bold text-[#6D9F9B] transition hover:bg-[#F0FAFA]"
            >
            Q&A 등록/조회
            </Link>
        </div>
        </aside>
    );
}