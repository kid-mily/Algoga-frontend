import Image from "next/image";
import type { RecommendedCourse } from "../evaluationResult.types";
import { formatPrice, getCourseLevelStyle } from "../utils/evaluationResult.util";

interface RecommendedCourseListProps {
    levelName: string;
    courses: RecommendedCourse[];
    selectedCourseId: number | null;
    isLoading: boolean;
    onSingleCourseClick: (course: RecommendedCourse) => void;
    onPackageClick: (course: RecommendedCourse) => void;
}

export default function RecommendedCourseList({
    levelName,
    courses,
    selectedCourseId,
    isLoading,
    onSingleCourseClick,
    onPackageClick,
}: RecommendedCourseListProps) {
    return (
        <section className="mt-8">
        <div className="mb-4">
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#439A97]">
            RECOMMENDED CLASS
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-[#0A1628]">
            {levelName} 레벨 추천 강의
            </h2>

            <p className="mt-1 text-sm text-[#8A9BB0]">
            진단 결과와 같은 레벨의 강의를 보여드려요.
            </p>
        </div>

        {isLoading ? (
            <div className="rounded-[24px] border border-[#E1EAF0] bg-white px-6 py-12 text-center text-sm font-bold text-[#8A9BB0] shadow-sm">
            추천 강의를 불러오는 중입니다.
            </div>
        ) : courses.length === 0 ? (
            <div className="rounded-[24px] border border-[#E1EAF0] bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-bold text-[#0A1628]">
                현재 추천 가능한 강의가 없습니다.
            </p>

            <p className="mt-2 text-xs text-[#8A9BB0]">
                전체 강의 목록에서 원하는 강의를 선택해보세요.
            </p>
            </div>
        ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
                const purchased = course.enrolled || course.paid;
                const selected = selectedCourseId === course.courseId;
                const courseLevelStyle = getCourseLevelStyle(course.level);

                return (
                <li
                    key={course.courseId}
                    className={`overflow-hidden rounded-[26px] border bg-white shadow-sm transition ${
                    selected
                        ? "border-[#439A97] ring-2 ring-[#439A97]/20"
                        : "border-[#E1EAF0]"
                    }`}
                >
                    <button
                    type="button"
                    onClick={() => onSingleCourseClick(course)}
                    className="group block w-full text-left"
                    >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF2F5]">
                        {course.thumbnailUrl ? (
                        <Image
                            src={course.thumbnailUrl}
                            alt={course.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-300 group-hover:scale-105"
                        />
                        ) : (
                        <div className="flex h-full items-center justify-center text-sm font-bold text-[#7C8A9A]">
                            여행 이미지 없음
                        </div>
                        )}

                        <span
                        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold shadow-sm ${courseLevelStyle.background} ${courseLevelStyle.text}`}
                        >
                        {course.levelName}
                        </span>

                        {purchased ? (
                        <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#439A97] shadow-sm">
                            수강 중
                        </span>
                        ) : null}
                    </div>

                    <div className="p-4">
                        <h3 className="line-clamp-2 min-h-[40px] text-sm font-extrabold leading-5 text-[#0A1628]">
                        {course.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8A9BB0]">
                        {course.description}
                        </p>

                        <div className="mt-4 border-t border-[#EEF2F6] pt-4">
                        <strong className="text-sm font-extrabold text-[#0A1628]">
                            {formatPrice(course.price)}
                        </strong>
                        </div>
                    </div>
                    </button>

                    <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                    <button
                        type="button"
                        onClick={() => onSingleCourseClick(course)}
                        className="flex min-h-11 items-center justify-center rounded-2xl border border-[#DCE5F0] bg-white px-3 text-xs font-extrabold text-[#243247] transition hover:bg-[#F8FAFC]"
                    >
                        강의 선택
                    </button>

                    <button
                        type="button"
                        onClick={() => onPackageClick(course)}
                        className="flex min-h-11 items-center justify-center rounded-2xl bg-[#439A97] px-3 text-xs font-extrabold text-white transition hover:bg-[#377F7C]"
                    >
                        패키지 선택
                    </button>
                    </div>
                </li>
                );
            })}
            </ul>
        )}
        </section>
    );
}