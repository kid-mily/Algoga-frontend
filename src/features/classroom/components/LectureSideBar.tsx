"use client";

import { useParams } from "next/navigation";
import SubHeader from "../../contentmanage/common/SubHeader";
import { ChapterItem, VideoItem } from "./types";

interface LectureSideBarProps {
  chapters: ChapterItem[];
  currentVideoId?: number;
  onVideoSelect: (video: VideoItem) => void;
  courseTitle?: string;
  courseDescription?: string;
  backHref?: string;
  backText?: string;
}

const getParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function LectureSideBar({
  chapters,
  currentVideoId,
  onVideoSelect,
  courseTitle = "강의",
  courseDescription = "여행에 필요한 지식을 수강하세요.",
  backHref,
  backText = "클래스룸으로",
}: LectureSideBarProps) {
  const params = useParams();

  const continentCode = getParam(params.continentCode);
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);

  const resolvedBackHref =
    backHref || `/classroom/${continentCode}/${countryId}/lecture/${courseId}`;

  const totalChapters = chapters.length;

  const averageProgress =
    totalChapters > 0
      ? Math.round(
          chapters.reduce(
            (acc, chapter) => acc + (chapter.progressRate || 0),
            0
          ) / totalChapters
        )
      : 0;

  const totalVideosCount = chapters.reduce(
    (acc, chapter) => acc + (chapter.videos?.length || 0),
    0
  );

  return (
    <div className="z-10 flex min-h-screen w-80 flex-col justify-between border-r border-gray-200 bg-white">
      <div className="bg-[#EEF5FF] p-5">
        <div>
          <SubHeader
            backHref={resolvedBackHref}
            backText={backText}
            title={courseTitle}
            description={courseDescription}
          />

          <p className="mb-5 mt-1 text-sm font-medium text-gray-400">
            총 {totalVideosCount}개 강의
          </p>
        </div>

        <div className="mt-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="mb-1 text-gray-500">전체 진도</span>
            <span className="text-[#439A97]">{averageProgress}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#439A97] transition-all duration-500 ease-out"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100vh-280px)] flex-1 overflow-y-auto p-5 pt-3">
        <p className="mb-3 pl-1 text-xs font-bold text-gray-400">강의 목차</p>

        {chapters.map((chapter, chapterIndex) => {
          return (chapter.videos || []).map((video) => {
            const isActive = video.videoId === currentVideoId;

            return (
              <button
                key={video.videoId}
                type="button"
                onClick={() => onVideoSelect(video)}
                className={`mb-3 flex w-full cursor-pointer flex-col gap-1 rounded-xl border p-3 text-left text-xs transition-colors ${
                  isActive
                    ? "border-cyan-800 bg-[#EBF5F5] text-[#439A97]"
                    : "border-transparent bg-white text-[#4A5568] hover:bg-gray-50"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isActive ? "text-[#439A97]" : "text-gray-400"
                    }`}
                  >
                    {chapter.chapterNumber ||
                      `챕터 ${String(chapterIndex + 1).padStart(2, "0")}`}
                  </span>

                  {chapter.completed && (
                    <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-600">
                      완료
                    </span>
                  )}
                </div>

                <div className="mt-0.5 flex w-full items-start justify-between gap-2">
                  <span
                    className={`flex-1 text-left font-semibold leading-relaxed ${
                      isActive ? "text-[#357A78]" : "text-gray-700"
                    }`}
                  >
                    {video.title}
                  </span>

                  <span className="whitespace-nowrap pt-0.5 text-[10px] font-medium text-gray-400">
                    {video.duration || "재생 시간 없음"}
                  </span>
                </div>
              </button>
            );
          });
        })}
      </div>

      <div className="border-t border-gray-100 bg-white p-5 pt-4">
        <button
          type="button"
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#439A97] text-sm font-bold text-white transition-colors hover:bg-[#357A78]"
        >
          퀴즈 풀기
        </button>
      </div>
    </div>
  );
}