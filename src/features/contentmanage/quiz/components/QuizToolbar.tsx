import Link from "next/link";
import { MAX_QUIZ_COUNT, QuizToolbarProps } from "../types";

export default function QuizToolbar({
  searchKeyword,
  selectedLecture,
  courses,
  createHref = "/contentadmin/quiz/new",
  selectedCourseQuizCount,
  onSearchKeywordChange,
  onSelectedLectureChange,
}: QuizToolbarProps) {
  const isMaxReached =
    selectedLecture !== "all" &&
    typeof selectedCourseQuizCount === "number" &&
    selectedCourseQuizCount >= MAX_QUIZ_COUNT;

  return (
    <form
      role="search"
      aria-label="퀴즈 검색 및 필터"
      className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="flex h-[42px] min-w-0 flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/search.svg"
              alt="검색"
              aria-hidden="true"
              className="h-[16px] w-[16px]"
            />
            <label htmlFor="quiz-search" className="sr-only">
              퀴즈 문제 검색
            </label>
            <input
              id="quiz-search"
              type="search"
              value={searchKeyword}
              onChange={(event) => onSearchKeywordChange(event.target.value)}
              placeholder="문제 내용 검색"
              className="ml-2 min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
            />
          </div>

          <label htmlFor="quiz-lecture-filter" className="sr-only">
            강의별 퀴즈 필터
          </label>
          <select
            id="quiz-lecture-filter"
            value={selectedLecture}
            onChange={(event) => onSelectedLectureChange(event.target.value)}
            className="h-[42px] w-[220px] rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
          >
            <option value="all">전체 강의</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {selectedLecture !== "all" && typeof selectedCourseQuizCount === "number" && (
            <span className="text-[13px] font-semibold text-[#667085]">
              퀴즈 {selectedCourseQuizCount} / {MAX_QUIZ_COUNT}
            </span>
          )}

          {isMaxReached ? (
            <span
              className="flex h-[42px] cursor-not-allowed items-center rounded-[12px] bg-[#CFE5E4] px-5 text-[14px] font-semibold text-white"
              title={`퀴즈는 강의당 최대 ${MAX_QUIZ_COUNT}개까지 등록할 수 있습니다.`}
            >
              + 퀴즈 등록
            </span>
          ) : (
            <Link
              href={createHref}
              className="flex h-[42px] items-center rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white transition hover:opacity-90"
            >
              + 퀴즈 등록
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
