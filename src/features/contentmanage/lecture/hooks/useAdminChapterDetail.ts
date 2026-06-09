"use client";

import { useEffect, useState } from "react";

import { AdminChapter } from "../types";
import { getChapterListAction } from "../actions";

export function useAdminChapterDetail(lectureId: number, chapterId: number) {
  const [chapter, setChapter] = useState<AdminChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setIsLoading(true);
        setError("");

        const chapters = await getChapterListAction(lectureId);
        const target = chapters.find(
          (item) => (item.chapterId || (item as any).id) === chapterId
        );

        if (!target) {
          setChapter(null);
          setError("Chapter not found.");
          return;
        }

        setChapter(target);
      } catch (error: any) {
        setError(error.message || "Failed to load chapter.");
      } finally {
        setIsLoading(false);
      }
    };

    if (lectureId && chapterId) {
      fetchChapter();
    }
  }, [lectureId, chapterId]);

  return { chapter, isLoading, error };
}
