"use client";

import { useEffect, useMemo, useState } from "react";
import type { RefObject } from "react";
import {
  Maximize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  RotateCcw as Replay,
  Volume2,
  VolumeX,
} from "lucide-react";
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

const normalizeSeconds = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;

  // 서버에서 밀리초 단위로 내려오는 경우 방어
  // 예: 180000 → 180초
  if (seconds > 10000) {
    return seconds / 1000;
  }

  return seconds;
};

const formatTime = (seconds: number) => {
  const safeSeconds = normalizeSeconds(seconds);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const restSeconds = Math.floor(safeSeconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      restSeconds
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(restSeconds).padStart(2, "0")}`;
};

export default function StudyVideoPlayer({
  videoRef,
  selectedChapter,
  isPlaying,
  setIsPlaying,
  reportProgress,
  handleVideoEnded,
}: Props) {
  const [currentTime, setCurrentTime] = useState(
    normalizeSeconds(selectedChapter?.watchedSeconds ?? 0)
  );
  const [duration, setDuration] = useState(
    normalizeSeconds(selectedChapter?.durationSeconds ?? 0)
  );
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const progressPercent = useMemo(() => {
    if (!duration) return 0;

    return Math.min(Math.max((currentTime / duration) * 100, 0), 100);
  }, [currentTime, duration]);

  useEffect(() => {
    setCurrentTime(normalizeSeconds(selectedChapter?.watchedSeconds ?? 0));
    setDuration(normalizeSeconds(selectedChapter?.durationSeconds ?? 0));
    setIsPlaying(false);
    setIsEnded(false);
  }, [
    selectedChapter?.chapterId,
    selectedChapter?.durationSeconds,
    setIsPlaying,
  ]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      if (video.ended || isEnded) {
        video.currentTime = 0;
        setCurrentTime(0);
        setIsEnded(false);
      }

      await video.play();
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
    void reportProgress(video.currentTime, true);
  };

  const handleVideoClick = () => {
    void togglePlay();
  };

  const handleReplay = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    setIsEnded(false);

    await video.play();
    setIsPlaying(true);
  };

  const seekBy = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const maxDuration = duration || video.duration || 0;

    const nextTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      maxDuration
    );

    video.currentTime = nextTime;
    setCurrentTime(nextTime);

    if (nextTime < maxDuration) {
      setIsEnded(false);
    }
  };

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    const maxDuration = duration || video.duration || 0;
    const nextTime = Math.min(Math.max(value, 0), maxDuration);

    video.currentTime = nextTime;
    setCurrentTime(nextTime);

    if (nextTime < maxDuration) {
      setIsEnded(false);
    }
  };

  const handleVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    video.muted = value === 0;

    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;

    setIsMuted(nextMuted);
  };

  const handleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    await video.requestFullscreen();
  };

  if (!selectedChapter?.videoUrl) {
    return (
      <article className="mx-auto w-full max-w-[820px] overflow-hidden rounded-2xl border border-[#DDE8EF] bg-black shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
        <div className="flex aspect-video w-full items-center justify-center bg-[#0F172A]">
          <p className="text-sm font-medium text-white/60">
            재생할 영상이 없습니다.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="mx-auto w-full max-w-[820px] overflow-hidden rounded-2xl border border-[#DDE8EF] bg-black shadow-[0_16px_40px_rgba(15,23,42,0.22)]">
      <div
        className="group relative aspect-video w-full cursor-pointer bg-black"
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          key={selectedChapter.chapterId}
          src={selectedChapter.videoUrl}
          className="h-full w-full object-contain"
          playsInline
          preload="metadata"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;

            const watchedSeconds = normalizeSeconds(
              selectedChapter.watchedSeconds ?? 0
            );

            const nextDuration = Number.isFinite(video.duration)
              ? video.duration
              : normalizeSeconds(selectedChapter.durationSeconds ?? 0);

            setDuration(nextDuration);

            video.volume = volume;
            video.muted = isMuted;
            video.playbackRate = 1;

            if (
              watchedSeconds > 0 &&
              nextDuration > 0 &&
              watchedSeconds < nextDuration
            ) {
              video.currentTime = watchedSeconds;
              setCurrentTime(watchedSeconds);
              setIsEnded(false);
            } else if (watchedSeconds >= nextDuration && nextDuration > 0) {
              video.currentTime = nextDuration;
              setCurrentTime(nextDuration);
              setIsEnded(true);
            } else {
              setCurrentTime(0);
              setIsEnded(false);
            }
          }}
          onPlay={() => {
            setIsPlaying(true);
            setIsEnded(false);
          }}
          onPause={(event) => {
            setIsPlaying(false);

            if (!event.currentTarget.ended) {
              void reportProgress(event.currentTarget.currentTime, true);
            }
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            const nextTime = video.currentTime;

            setCurrentTime(nextTime);
            void reportProgress(nextTime);
          }}
          onEnded={(event) => {
            const video = event.currentTarget;

            const endTime = Number.isFinite(video.duration)
              ? video.duration
              : video.currentTime;

            setIsPlaying(false);
            setIsEnded(true);
            setCurrentTime(endTime);
            handleVideoEnded(endTime);
          }}
        />

        <div className="pointer-events-none absolute left-0 top-0 w-full bg-gradient-to-b from-black/70 to-transparent px-4 py-4">
          <p className="line-clamp-1 text-sm font-semibold text-white">
            챕터 {selectedChapter.chapterOrder}. {selectedChapter.title}
          </p>
        </div>

        {!isPlaying ? (
          <button
            type="button"
            aria-label={isEnded ? "영상 다시 보기" : "영상 재생"}
            onClick={(event) => {
              event.stopPropagation();

              if (isEnded) {
                void handleReplay();
                return;
              }

              void togglePlay();
            }}
            className="absolute left-1/2 top-1/2 flex h-16 min-w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 px-5 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-[#439A97]"
          >
            {isEnded ? (
              <span className="flex items-center gap-2 text-sm font-bold">
                <Replay size={18} />
                다시 보기
              </span>
            ) : (
              <Play size={32} className="ml-1" fill="currentColor" />
            )}
          </button>
        ) : null}

        <div
          onClick={(event) => event.stopPropagation()}
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-10 opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
        >
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || currentTime)}
            onChange={(event) => handleSeek(Number(event.target.value))}
            aria-label="영상 재생 위치"
            className="
              mb-3 h-1.5 w-full cursor-pointer appearance-none rounded-full
              [&::-webkit-slider-runnable-track]:h-1.5
              [&::-webkit-slider-runnable-track]:rounded-full
              [&::-webkit-slider-thumb]:-mt-[5px]
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:bg-[#439A97]
              [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(67,154,151,0.25)]
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-white
              [&::-moz-range-thumb]:bg-[#439A97]
            "
            style={{
              background: `linear-gradient(to right, #439A97 ${progressPercent}%, rgba(255,255,255,0.28) ${progressPercent}%)`,
            }}
          />

          <div className="flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => seekBy(-10)}
                aria-label="10초 뒤로"
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/15"
              >
                <RotateCcw size={18} />
              </button>

              <button
                type="button"
                onClick={() => void togglePlay()}
                aria-label={isPlaying ? "일시정지" : "재생"}
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
              >
                {isPlaying ? (
                  <Pause size={22} fill="currentColor" />
                ) : (
                  <Play size={22} className="ml-0.5" fill="currentColor" />
                )}
              </button>

              <button
                type="button"
                onClick={() => seekBy(10)}
                aria-label="10초 앞으로"
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/15"
              >
                <RotateCw size={18} />
              </button>

              <span className="ml-1 text-xs font-medium text-white/90">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "음소거 해제" : "음소거"}
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/15"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(event) =>
                  handleVolumeChange(Number(event.target.value))
                }
                aria-label="볼륨"
                className="
                  hidden h-1 w-16 cursor-pointer appearance-none rounded-full
                  bg-white/35
                  sm:block
                  [&::-webkit-slider-runnable-track]:h-1
                  [&::-webkit-slider-runnable-track]:rounded-full
                  [&::-webkit-slider-thumb]:-mt-[4px]
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-moz-range-thumb]:h-3
                  [&::-moz-range-thumb]:w-3
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:bg-white
                "
              />

              <button
                type="button"
                onClick={() => void handleFullscreen()}
                aria-label="전체화면"
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/15"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}