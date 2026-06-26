import type { AdminCourse } from "@/features/contentmanage/lecture/types";
import { reviewScoreFilters } from "../types";

type ReviewToolbarProps = {
  courses: AdminCourse[];
  selectedCourseId: number | null;
  selectedScore: string;
  onSelectedCourseChange: (courseId: number | null) => void;
  onSelectedScoreChange: (value: string) => void;
};

export default function ReviewToolbar({
  courses,
  selectedCourseId,
  selectedScore,
  onSelectedCourseChange,
  onSelectedScoreChange,
}: ReviewToolbarProps) {
  return (
    <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        aria-label="후기 필터"
        className="flex flex-wrap items-center gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="review-course" className="sr-only">
          강의 선택
        </label>
        <select
          id="review-course"
          value={selectedCourseId ?? ""}
          onChange={(event) =>
            onSelectedCourseChange(event.target.value ? Number(event.target.value) : null)
          }
          className="h-[44px] min-w-[240px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-semibold text-[#344054] outline-none focus-visible:border-[#639E9B] focus-visible:ring-2 focus-visible:ring-[#D7EDEA]"
        >
          <option value="">전체 후기</option>
          {courses.length === 0 ? (
            <option value="" disabled>
              강의 없음
            </option>
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
