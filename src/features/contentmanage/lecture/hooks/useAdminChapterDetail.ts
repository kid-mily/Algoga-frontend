"use client";

import { useEffect, useState } from "react";

import { getChapterListAction } from "../actions";
import { AdminChapterRecord } from "../types";

export function useAdminChapterDetail(lectureId: number, chapterId: number) {
  const [chapter, setChapter] = useState<AdminChapterRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setIsLoading(true);
        setError("");

        const chapters = await getChapterListAction(lectureId);
        const target =
          chapters.find((item: AdminChapterRecord) => {
            const currentChapterId = item.chapterId || item.id;
            return Number(currentChapterId) === Number(chapterId);
          }) ?? null;

        if (!target) {
          setChapter(null);
          setError("챕터를 찾을 수 없습니다.");
          return;
        }

        setChapter(target);
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : "챕터를 불러오지 못했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (lectureId && chapterId) {
      void fetchChapter();
    }
  }, [lectureId, chapterId]);

  return { chapter, isLoading, error };
}
