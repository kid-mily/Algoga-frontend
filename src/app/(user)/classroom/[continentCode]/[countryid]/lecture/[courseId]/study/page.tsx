"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "@/lib/cookie";
import {
  CourseStudyChapter,
  CourseStudyDetail,
  getCourseStudyDetail,
  updateChapterProgress,
} from "@/features/services/courseStudy.service";

const getParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function LectureStudyPage() {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParam(params.continentCode);
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastReportedSecondsRef = useRef(0);

  const [course, setCourse] = useState<CourseStudyDetail | null>(null);
  const [selectedChapter, setSelectedChapter] =
    useState<CourseStudyChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const chapters = useMemo(() => {
    return [...(course?.chapters ?? [])].sort(
      (a, b) => a.chapterOrder - b.chapterOrder
    );
  }, [course]);

  useEffect(() => {
    const token = getCookie("accessToken");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (!courseId) return;

    const controller = new AbortController();

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getCourseStudyDetail(courseId, controller.signal);

        setCourse(data);
        setSelectedChapter(data.chapters?.[0] ?? null);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "강의 정보를 불러오지 못했습니다.";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();

    return () => {
      controller.abort();
    };
  }, [courseId, router]);

  const reportProgress = async (watchedSeconds: number, force = false) => {
    if (!selectedChapter || !courseId) return;

    const seconds = Math.floor(watchedSeconds);
    const diff = seconds - lastReportedSecondsRef.current;

    if (!force && diff < 10) return;

    lastReportedSecondsRef.current = seconds;

    try {
      const progress = await updateChapterProgress(
        courseId,
        selectedChapter.chapterId,
        seconds
      );

      setCourse((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          chapters: prev.chapters.map((chapter) =>
            chapter.chapterId === selectedChapter.chapterId
              ? {
                  ...chapter,
                  watchedSeconds: progress.watchedSeconds,
                  progressRate: progress.progressRate,
                  completed: progress.completed,
                }
              : chapter
          ),
        };
      });
    } catch (error) {
      console.error("진도율 업데이트 실패:", error);
    }
  };

  const handleChapterSelect = (chapter: CourseStudyChapter) => {
    setSelectedChapter(chapter);
    lastReportedSecondsRef.current = chapter.watchedSeconds ?? 0;
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <p className="text-sm text-gray-500">강의 정보를 불러오는 중입니다.</p>
      </main>
    );
  }

  if (errorMessage || !course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-4">
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-[#0A1628]">
            강의를 불러올 수 없습니다
          </h1>
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          <Link
            href={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
            className="mt-5 inline-flex rounded-xl bg-[#439A97] px-5 py-3 text-sm font-semibold text-white"
          >
            강의 상세로 돌아가기
          </Link>
        </section>
      </main>
    );
  }

  if (!course.isPaid || !course.isEnrolled) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-4">
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-[#0A1628]">
            수강 권한이 없습니다
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            결제 또는 수강 신청 후 강의를 볼 수 있습니다.
          </p>
          <Link
            href={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
            className="mt-5 inline-flex rounded-xl bg-[#439A97] px-5 py-3 text-sm font-semibold text-white"
          >
            강의 상세로 이동
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen grid-cols-[320px_1fr] bg-[#f5f6f8]">
      <aside className="flex min-h-screen flex-col border-r border-gray-200 bg-white">
        <header className="border-b border-gray-100 bg-[#EEF5FF] p-5">
          <Link
            href={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
            className="text-sm font-semibold text-[#439A97]"
          >
            강의 상세로 돌아가기
          </Link>

          <h1 className="mt-4 text-xl font-bold text-[#0A1628]">
            {course.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            총 {chapters.length}개 챕터
          </p>
        </header>

        <nav aria-label="강의 목차" className="flex-1 overflow-y-auto p-5">
          <ol className="space-y-3">
            {chapters.map((chapter) => {
              const isActive =
                selectedChapter?.chapterId === chapter.chapterId;

              return (
                <li key={chapter.chapterId}>
                  <button
                    type="button"
                    onClick={() => handleChapterSelect(chapter)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      isActive
                        ? "border-[#439A97] bg-[#EBF5F5]"
                        : "border-transparent bg-white hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-400">
                      {String(chapter.chapterOrder).padStart(2, "0")}
                    </span>

                    <strong className="mt-1 block text-sm text-[#0A1628]">
                      {chapter.title}
                    </strong>

                    <span className="mt-2 block text-xs text-gray-400">
                      진도율 {chapter.progressRate ?? 0}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      <section className="flex max-h-screen flex-col gap-6 overflow-y-auto p-8">
        <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {selectedChapter?.videoUrl ? (
            <video
              ref={videoRef}
              key={selectedChapter.chapterId}
              src={selectedChapter.videoUrl}
              controls
              className="aspect-video w-full bg-black"
              onTimeUpdate={(event) =>
                reportProgress(event.currentTarget.currentTime)
              }
              onPause={(event) =>
                reportProgress(event.currentTarget.currentTime, true)
              }
              onEnded={(event) =>
                reportProgress(event.currentTarget.currentTime, true)
              }
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-gray-100">
              <p className="text-sm text-gray-500">
                재생할 영상이 없습니다.
              </p>
            </div>
          )}
        </article>

        <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <header>
            <p className="text-sm font-semibold text-[#439A97]">
              {selectedChapter
                ? `${selectedChapter.chapterOrder}강`
                : "챕터 선택"}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#0A1628]">
              {selectedChapter?.title ?? "챕터를 선택해주세요"}
            </h2>
          </header>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            영상을 시청하면 자동으로 진도율이 저장됩니다.
          </p>
        </article>
      </section>
    </main>
  );
}