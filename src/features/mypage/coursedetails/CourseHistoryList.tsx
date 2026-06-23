"use client";

import { useState } from "react";
import Link from "next/link";
import ReviewModal from "@/features/classroom/review/ReviewModal";
import LatestDiagnosisBanner from "./LatestDiagnosisBanner";
import { useMyCourses } from "./useMyCourses";
import { MyCourse } from "./types";

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.ceil((totalSeconds % 3600) / 60);

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;

  return `${hours}시간 ${minutes}분`;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ko-KR");
};

const getStudyHref = (course: MyCourse) => {
  if (!course.continentCode) {
    return `/classroom/${course.continentCode}/${course.countryId}/lecture/${course.courseId}/study`;
  }

  return (
    `/classroom/${course.continentCode}/${course.countryId}/lecture/${course.courseId}/study`
  );
};

export default function CourseHistoryList() {
  const {
    courses,
    latestDiagnosis,
    isLoading,
    errorMessage,
    markReviewWritten,
  } = useMyCourses();

  const [reviewCourse, setReviewCourse] = useState<MyCourse | null>(null);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white px-6 py-10 text-center text-sm text-[#8A9BB0] shadow-sm">
        수강 강좌를 불러오는 중입니다.
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg bg-white px-6 py-10 text-center shadow-sm">
        <h2 className="font-bold text-[#0A1628]">
          수강 강좌를 불러올 수 없습니다
        </h2>

        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <LatestDiagnosisBanner diagnosis={latestDiagnosis} />

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#439A97]">
                MY JOURNEY
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#0A1628]">
                나의 여행 학습
              </h2>
            </div>

            <span className="text-xs text-[#8A9BB0]">
              총 {courses.length}개 강의
            </span>
          </div>

          {courses.length === 0 ? (
            <div className="rounded-lg bg-white px-6 py-10 text-center shadow-sm">
              <span className="text-3xl">🧳</span>

              <h3 className="mt-3 font-bold text-[#0A1628]">
                아직 수강 중인 강의가 없습니다
              </h3>

              <Link
                href="/classroom"
                className="mt-4 inline-flex h-9 items-center rounded-lg bg-[#439A97] px-4 text-xs font-bold text-white"
              >
                여행 강의 둘러보기
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {courses.map((course) => {
                const progress = Math.min(
                  Math.max(course.progressRate, 0),
                  100
                );

                const completed = course.learningStatus === "COMPLETED";
                const studyHref = getStudyHref(course);

                return (
                  <li key={course.courseId}>
                    <article className="overflow-hidden rounded-lg border border-[#E6ECF2] bg-white shadow-sm">
                      <div className="grid grid-cols-[140px_1fr] items-stretch">
                        {/* 이미지: 카드 높이에 맞춰 꽉 차게 */}
                        <div className="relative h-full min-h-[150px] bg-[#DCEFED]">
                          {course.thumbnailUrl ? (
                            <img
                              src={course.thumbnailUrl}
                              alt={course.title}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#5E9F9B]">
                              <span className="text-3xl">🌏</span>

                              <span className="mt-1 max-w-[100px] truncate text-[10px] font-bold">
                                {course.countryName}
                              </span>
                            </div>
                          )}

                          <span className="absolute left-2 top-2 max-w-[110px] truncate rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#357A78]">
                            {course.countryName}
                          </span>
                        </div>

                        {/* 내용 */}
                        <div className="min-w-0 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    completed
                                      ? "bg-[#EAF8F1] text-[#2F8C59]"
                                      : "bg-[#EAF3FF] text-[#4779A8]"
                                  }`}
                                >
                                  {completed ? "수료 완료" : "여행 중"}
                                </span>

                                {course.quizSubmitted ? (
                                  <span className="rounded-full bg-[#FFF4DF] px-2 py-0.5 text-[10px] font-bold text-[#A56B16]">
                                    퀴즈 제출
                                  </span>
                                ) : null}
                              </div>

                              <h3 className="mt-2 truncate text-[15px] font-bold text-[#0A1628]">
                                {course.title}
                              </h3>

                              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#8A9BB0]">
                                <span>
                                  총 {formatDuration(course.totalDurationSeconds)}
                                </span>

                                <span>
                                  평점 {course.averageRating.toFixed(1)}
                                </span>
                              </div>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-2">
                              <strong className="text-sm font-extrabold text-[#2F9E6F]">
                                {progress}%
                              </strong>

                              <Link
                                href={studyHref}
                                className="flex h-8 items-center rounded-lg bg-[#439A97] px-3 text-[11px] font-bold text-white"
                              >
                                {completed ? "복습하기" : "이어 듣기"}
                              </Link>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="h-1.5 overflow-hidden rounded-full bg-[#E7ECF3]">
                              <div
                                className="h-full rounded-full bg-[#439A97]"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />
                            </div>

                            <div className="mt-1.5 flex justify-between text-[11px] text-[#8A9BB0]">
                              <span>
                                {course.completedChapterCount}/
                                {course.totalChapterCount} 챕터
                              </span>

                              <span>
                                이용 만료 {formatDate(course.accessExpiresAt)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {course.certificateAvailable ? (
                              <Link
                                href={`/mypage/coursedetails/${course.courseId}/certificate`}
                                className="flex h-8 items-center rounded-lg border border-[#8AB9B7] bg-white px-3 text-[11px] font-bold text-[#439A97]"
                              >
                                수료증 보기
                              </Link>
                            ) : null}

                            {completed && !course.reviewWritten ? (
                              <button
                                type="button"
                                onClick={() => setReviewCourse(course)}
                                className="h-8 rounded-lg border border-[#D9A752] bg-[#FFF9EC] px-3 text-[11px] font-bold text-[#A56B16]"
                              >
                                후기 작성
                              </button>
                            ) : null}

                            {course.reviewWritten ? (
                              <span className="flex h-8 items-center px-1 text-[11px] font-bold text-[#2F8C59]">
                                후기 작성 완료
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <ReviewModal
        open={reviewCourse !== null}
        courseId={reviewCourse ? String(reviewCourse.courseId) : ""}
        onClose={() => setReviewCourse(null)}
        onSuccess={(review) => {
          markReviewWritten(review.courseId);
          setReviewCourse(null);
        }}
      />
    </>
  );
}