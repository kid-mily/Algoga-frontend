import Image from "next/image";
import { RecommendedCourse } from "../evaluationResult.types";
import { OtherLevelCourseGroup } from "../hooks/useEvaluationResult";
import { formatPrice, getCourseLevelStyle, LEVEL_STYLES } from "../utils/evaluationResult.util";

interface RecommendedCourseListProps {
  levelName: string;
  courses: RecommendedCourse[];
  otherLevelGroups: OtherLevelCourseGroup[];
  selectedCourseId: number | null;
  isLoading: boolean;
  onSingleCourseClick: (course: RecommendedCourse) => void;
  onPackageClick: (course: RecommendedCourse) => void;
}

interface CourseCardProps {
  course: RecommendedCourse;
  selected: boolean;
  onSingleCourseClick: (course: RecommendedCourse) => void;
  onPackageClick: (course: RecommendedCourse) => void;
}

// 클래스룸 강의 카드(LectureCard)와 같은 톤의 카드 - 등급 강조 바 + COURSE 라벨 + 동일한 폰트 사이즈
function CourseCard({
  course,
  selected,
  onSingleCourseClick,
  onPackageClick,
}: CourseCardProps) {
  const purchased = Boolean(course.enrolled || course.paid);
  const courseLevelStyle = getCourseLevelStyle(course.level) ?? LEVEL_STYLES.BEGINNER;
  const levelLabel = course.levelName || courseLevelStyle.label;
  const description =
    course.description ||
    `${course.countryName ?? "여행지"} 학습을 위한 추천 강의입니다.`;

  return (
    <li
      className={`relative overflow-hidden rounded-2xl border bg-white shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(55,88,110,0.12)] ${
        selected
          ? "border-[#439A97] ring-2 ring-[#439A97]/20"
          : "border-[#E1EAF0] hover:border-[#B7DAD7]"
      }`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${courseLevelStyle.accent}`} />

      <div className="group block w-full text-left">
        <div className="relative h-[125px] overflow-hidden bg-[#EAF2F5]">
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
              강의 이미지 없음
            </div>
          )}

          <span
            className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-extrabold shadow-sm ${courseLevelStyle.background} ${courseLevelStyle.text}`}
          >
            {levelLabel}
          </span>

          {purchased ? (
            <span className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#439A97] shadow-sm">
              수강 중
            </span>
          ) : null}
        </div>

        <div className="px-5 py-4 pl-6">
          <span className="text-[9px] font-bold tracking-[0.16em] text-[#A0AEC0]">
            COURSE
          </span>

          <h3 className="mt-2 line-clamp-2 min-h-[48px] text-base font-extrabold leading-6 text-[#0A1628]">
            {course.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#718096]">
            {description}
          </p>

          {typeof course.price === "number" ? (
            <div className="mt-3 border-t border-dashed border-[#D6E0E8] pt-3">
              <strong className={`text-sm font-extrabold ${courseLevelStyle.text}`}>
                {formatPrice(course.price)}
              </strong>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 pb-4 pl-6">
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
}

export default function RecommendedCourseList({
  levelName,
  courses,
  otherLevelGroups,
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
          {levelName} 맞춤 추천 강의
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
          {courses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              selected={selectedCourseId === course.courseId}
              onSingleCourseClick={onSingleCourseClick}
              onPackageClick={onPackageClick}
            />
          ))}
        </ul>
      )}

      {/* 내 등급을 제외한 나머지 등급 강의도 등급별 섹션으로 모두 펼쳐서 보여준다 */}
      {otherLevelGroups.map((group) => {
        const groupStyle = LEVEL_STYLES[group.level] ?? LEVEL_STYLES.BEGINNER;

        return (
          <div key={group.level} className="mt-10">
            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-[#0A1628]">
                {groupStyle.label} 강의
              </h3>
              <p className="mt-1 text-sm text-[#8A9BB0]">
                다른 레벨의 강의도 함께 둘러보세요.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.courses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  course={course}
                  selected={selectedCourseId === course.courseId}
                  onSingleCourseClick={onSingleCourseClick}
                  onPackageClick={onPackageClick}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
