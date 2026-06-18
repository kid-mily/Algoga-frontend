import Image from "next/image";
import { AdminCourse } from "@/features/contentmanage/lecture/types";
import { reviewScoreFilters } from "../types";

type ReviewToolbarProps = {
  courses: AdminCourse[];
  selectedCourseId: number | null;
  searchKeyword: string;
  selectedScore: string;
  onSelectedCourseChange: (courseId: number | null) => void;
  onSearchKeywordChange: (value: string) => void;
  onSelectedScoreChange: (value: string) => void;
};

export default function ReviewToolbar({
  courses,
  selectedCourseId,
  searchKeyword,
  selectedScore,
  onSelectedCourseChange,
  onSearchKeywordChange,
  onSelectedScoreChange,
}: ReviewToolbarProps) {
  return (
    <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="후기 검색 및 필터"
        className="flex items-center gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex h-[44px] min-w-0 flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
          <Image
            src="/images/search.svg"
            alt=""
            aria-hidden="true"
            width={18}
            height={18}
          />
          <label htmlFor="review-search" className="sr-only">
            강의명 또는 학생 이름 검색
          </label>
          <input
            id="review-search"
            type="search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="강의명 또는 학생 이름 검색..."
            className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        <label htmlFor="review-course" className="sr-only">
          강의 선택
        </label>
        <select
          id="review-course"
          value={selectedCourseId ?? ""}
          onChange={(event) =>
            onSelectedCourseChange(event.target.value ? Number(event.target.value) : null)
          }
          className="h-[44px] min-w-[220px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-semibold text-[#344054] outline-none"
        >
          {courses.length === 0 ? (
            <option value="">강의 없음</option>
          ) : (
            courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title}
              </option>
            ))
          )}
        </select>

        <div
          role="group"
          aria-label="평점 필터"
          className="flex shrink-0 items-center gap-2 whitespace-nowrap"
        >
          <span className="text-[14px] font-semibold text-[#344054]">
            평점
          </span>

          {reviewScoreFilters.map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onSelectedScoreChange(score)}
              className={`h-[36px] rounded-full border px-4 text-[14px] font-semibold ${
                score === selectedScore
                  ? "border-[#639E9B] bg-[#639E9B] text-white"
                  : "border-[#E4E7EC] bg-white text-[#344054]"
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
