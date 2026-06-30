import type { RefObject } from "react";
import type { ChapterProgress, CourseStudyChapter } from "../types";

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  selectedChapter: CourseStudyChapter | null;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  reportProgress: (
    watchedSeconds: number,
    force?: boolean
  ) => Promise<ChapterProgress | null>;
  handleVideoEnded: (currentTime: number) => void;
}

export default function StudyVideoPlayer({
  videoRef,
  selectedChapter,
  isPlaying,
  setIsPlaying,
  reportProgress,
  handleVideoEnded,
}: Props) {
  return (
    <article className="mx-auto w-full max-w-[860px] overflow-hidden rounded-2xl border border-[#DDE8EF] bg-[#101820] shadow-[0_12px_32px_rgba(55,88,110,0.12)]">
      <div className="relative aspect-video w-full bg-black">
        {selectedChapter?.videoUrl ? (
          <>
            <video
              ref={videoRef}
              key={selectedChapter.chapterId}
              src={selectedChapter.videoUrl}
              controls
              className="h-full w-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={(event) => {
                setIsPlaying(false);
                void reportProgress(event.currentTarget.currentTime, true);
              }}
              onTimeUpdate={(event) => {
                void reportProgress(event.currentTarget.currentTime);
              }}
              onEnded={(event) =>
                handleVideoEnded(event.currentTarget.currentTime)
              }
            />

            <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-[#439A97]/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              챕터 {selectedChapter.chapterOrder}. {selectedChapter.title}
            </div>

            {!isPlaying ? (
              <button
                type="button"
                aria-label="영상 재생"
                onClick={() => void videoRef.current?.play()}
                className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-[#439A97]/90 text-white shadow-lg transition hover:scale-105 hover:bg-[#357F7C]"
              >
                <span aria-hidden="true" className="ml-0.5 text-lg leading-none">
                  ▶
                </span>
              </button>
            ) : null}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#E9EEF5]">
            <p className="text-sm font-medium text-[#8A9BB0]">
              재생할 영상이 없습니다.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
