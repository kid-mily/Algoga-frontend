"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LectureSideBar from "@/features/classroom/components/LectureSideBar";
import type {
  ChapterItem,
  VideoItem,
} from "@/features/classroom/components/types";
import type { CourseQuizSubmitResult } from "@/features/services/courseQuiz.service";
import {
  CourseStudyChapter,
  getCourseStudyDetail,
} from "@/features/services/courseStudy.service";

const getParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0분";
  return `${Math.ceil(seconds / 60)}분`;
};

const toSidebarChapters = (chapters: CourseStudyChapter[]): ChapterItem[] => {
  return chapters
    .slice()
    .sort((a, b) => a.chapterOrder - b.chapterOrder)
    .map((chapter) => ({
      chapterId: chapter.chapterId,
      chapterTitle: chapter.title,
      chapterNumber: `챕터 ${chapter.chapterOrder}`,
      progressRate: chapter.progressRate ?? 0,
      completed: chapter.completed ?? false,
      videos: [
        {
          videoId: chapter.chapterId,
          chapterId: chapter.chapterId,
          title: chapter.title,
          videoUrl: chapter.videoUrl,
          description: chapter.description ?? "",
          duration: formatDuration(chapter.durationSeconds),
        },
      ],
    }));
};

export default function QuizCompletePage() {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParam(params.continentCode);
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);

  const [courseTitle, setCourseTitle] = useState("");
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [result, setResult] = useState<CourseQuizSubmitResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchPageData = async () => {
      try {
        const storedResult = sessionStorage.getItem(`quiz-result-${courseId}`);

        if (storedResult) {
          setResult(JSON.parse(storedResult));
        }

        const studyDetail = await getCourseStudyDetail(courseId);

        setCourseTitle(studyDetail.title);
        setChapters(toSidebarChapters(studyDetail.chapters ?? []));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [courseId]);

  const handleVideoSelect = (_video: VideoItem) => {
    router.push(
      `/classroom/${continentCode}/${countryId}/lecture/${courseId}/study`
    );
  };

  const handleClose = () => {
    router.push(
      `/classroom/${continentCode}/${countryId}/lecture/${courseId}/study`
    );
  };

  const handleWrongAnswers = () => {
    router.push(
      `/classroom/${continentCode}/${countryId}/lecture/${courseId}/quiz`
    );
  };

  if (isLoading) {
    return (
      <main className="grid min-h-screen grid-cols-[340px_1fr] bg-[#F5F7FB]">
        <div />
        <section className="flex items-center justify-center">
          <p className="text-sm text-[#8A9BB0]">
            퀴즈 결과를 불러오는 중입니다.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen grid-cols-[340px_1fr] bg-[#F5F7FB]">
      <LectureSideBar
        courseTitle={courseTitle}
        chapters={chapters}
        onVideoSelect={handleVideoSelect}
      />

      <section className="px-10 py-8">
        <div className="mx-auto max-w-[1120px]">
          <article className="rounded-[22px] bg-white px-7 py-6 shadow-sm">
            <h1 className="text-xl font-bold text-[#0A1628]">퀴즈</h1>

            <p className="mt-3 text-[15px] leading-7 text-[#8A9BB0]">
              출발 전 정보를 다시 한번 점검해 보세요.
              <br />
              학습 내용을 바탕으로 퀴즈가 출제됩니다.
            </p>
          </article>

          <article className="mt-7 flex min-h-[520px] items-center justify-center rounded-[24px] bg-white px-20 py-10 shadow-sm">
            {!result ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#0A1628]">
                  퀴즈 결과를 찾을 수 없습니다
                </h2>

                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 h-14 rounded-[16px] bg-[#6D9F9B] px-8 text-sm font-bold text-white"
                >
                  강의로 돌아가기
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF1F1] text-5xl">
                  🏅
                </div>

                <h2 className="mt-7 text-3xl font-bold text-[#0A1628]">
                  퀴즈 완료!
                </h2>

                <p className="mt-3 text-[16px] text-[#8A9BB0]">
                  다시 한번 강의를 복습해보세요.
                </p>

                <div className="mt-8 w-[480px] rounded-[22px] bg-[#F5F7FB] px-8 py-7">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                    <div>
                      <p className="text-sm font-bold text-[#A1AEC0]">
                        맞힌 문제
                      </p>
                      <p className="mt-2 text-5xl font-bold text-[#6D9F9B]">
                        {result.correctCount}
                      </p>
                    </div>

                    <div className="h-14 w-px bg-[#E1E7EF]" />

                    <div>
                      <p className="text-sm font-bold text-[#A1AEC0]">
                        전체 문제
                      </p>
                      <p className="mt-2 text-5xl font-bold text-[#0A1628]">
                        {result.totalCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 border-t border-[#E1E7EF] pt-6">
                    <p className="text-sm font-bold text-[#A1AEC0]">정답률</p>

                    <div className="mt-5 flex items-center gap-4">
                      <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#E7ECF3]">
                        <div
                          className="h-full rounded-full bg-[#DF5555]"
                          style={{ width: `${result.score}%` }}
                        />
                      </div>

                      <span className="text-2xl font-bold text-[#DF5555]">
                        {result.score}%
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-8 h-16 w-[480px] rounded-[18px] bg-[#6D9F9B] text-[17px] font-bold text-white"
                >
                  수강 후기 작성하기
                </button>
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}