"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import CourseLearningSidebar from "@/features/classroom/learning/components/CourseLearningSidebar";
import { useCourseCompletionStatus } from "@/features/classroom/completion/hooks/useCourseCompletionStatus";
import { useLectureStudy } from "../hooks/useLectureStudy";
import StudyVideoPlayer from "./StudyVideoPlayer";
import StudyChapterInfo from "./StudyChapterInfo";

const getParam = (
  value: string | string[] | undefined
) => {
  if (!value) return "";

  return decodeURIComponent(
    Array.isArray(value) ? value[0] : value
  );
};

export default function LectureStudyClient() {
  const params = useParams();

  const continentCode = getParam(
    params.continentCode
  );
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);

  const study = useLectureStudy(courseId);

  const completion =
    useCourseCompletionStatus(courseId);

  const lectureHref =
    `/classroom/${continentCode}/${countryId}/lecture/${courseId}`;
  const studyHref = `${lectureHref}/study`;
  const quizHref = `${lectureHref}/quiz`;
  const quizResultHref =
    `${quizHref}/complete`;
  const qnaHref = `${lectureHref}/qna`;
  const certificateHref =
    `/mypage/coursedetails/${courseId}/certificate`;

  if (study.isLoading) {
    return (
      <main className="flex h-[calc(100dvh-64px)] items-center justify-center bg-[#F5F7FB]">
        <p className="text-sm text-[#8A9BB0]">
          강의 정보를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  if (study.errorMessage || !study.course) {
    return (
      <main className="flex h-[calc(100dvh-64px)] items-center justify-center bg-[#F5F7FB]">
        <section className="rounded-[20px] bg-white p-6 text-center shadow-sm">
          <h1 className="font-bold text-[#0A1628]">
            강의를 불러올 수 없습니다
          </h1>

          <p className="mt-2 text-sm text-red-500">
            {study.errorMessage}
          </p>

          <Link
            href={lectureHref}
            className="mt-4 inline-flex rounded-[14px] bg-[#5E9F9B] px-4 py-2.5 text-sm font-bold text-white"
          >
            강의 상세로 돌아가기
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100dvh-64px)] overflow-hidden bg-[#F5F7FB]">
      <CourseLearningSidebar
        courseTitle={study.course.title}
        chapters={study.chapters}
        selectedChapterId={
          study.selectedChapter?.chapterId
        }
        quizAvailable={
          study.course.quizAvailable === true
        }
        courseCompleted={
          completion.isCompleted
        }
        mode="study"
        lectureHref={lectureHref}
        studyHref={studyHref}
        quizHref={quizHref}
        quizResultHref={quizResultHref}
        certificateHref={certificateHref}
        qnaHref={qnaHref}
        onChapterSelect={
          study.handleChapterSelect
        }
      />

      <section className="min-w-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-[940px]">
          {completion.isCompleted ? (
            <div className="mb-3 flex items-center justify-between rounded-[18px] border border-[#BDE4CA] bg-[#EFFAF2] px-5 py-3">
              <div>
                <strong className="text-sm text-[#367C47]">
                  수료 완료 · 복습 가능
                </strong>

                <p className="mt-1 text-xs text-[#667085]">
                  수료한 강의입니다. 모든 챕터를 자유롭게 복습할 수 있습니다.
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={quizResultHref}
                  className="flex h-9 items-center rounded-[12px] border border-[#8AB9B7] bg-white px-4 text-xs font-bold text-[#5E9F9B]"
                >
                  퀴즈 결과
                </Link>

                <Link
                  href={certificateHref}
                  className="flex h-9 items-center rounded-[12px] bg-[#5E9F9B] px-4 text-xs font-bold text-white"
                >
                  수료증 보기
                </Link>
              </div>
            </div>
          ) : null}

          <StudyVideoPlayer
            videoRef={study.videoRef}
            selectedChapter={
              study.selectedChapter
            }
            isPlaying={study.isPlaying}
            setIsPlaying={study.setIsPlaying}
            reportProgress={
              study.reportProgress
            }
            handleVideoEnded={
              study.handleVideoEnded
            }
          />

          <StudyChapterInfo
            selectedChapter={
              study.selectedChapter
            }
          />
        </div>
      </section>
    </main>
  );
}