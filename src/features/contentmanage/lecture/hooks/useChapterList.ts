import { useCallback, useEffect, useState } from "react";
import { deleteChapterAction, getChapterListAction } from "../actions";
import type { AdminChapter } from "../types";

export const useChapterList = (lectureId: number) => {
  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  const fetchChapters = useCallback(async () => {
    await Promise.resolve();

    if (!lectureId) {
      setChapters([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getChapterListAction(lectureId);
      setChapters(data);
    } catch {
      setErrorMessage("챕터 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [lectureId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchChapters();
  }, [fetchChapters]);

  const openDeleteConfirm = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setOpenDeleteModal(true);
  };

  const closeDeleteConfirm = () => {
    setOpenDeleteModal(false);
    setSelectedChapterId(null);
  };

  const closeDeleteComplete = () => {
    setOpenDeleteCompleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedChapterId) return;

    try {
      setErrorMessage("");
      await deleteChapterAction(lectureId, selectedChapterId);
      setChapters((prev) =>
        prev.filter((chapter) => chapter.chapterId !== selectedChapterId)
      );
      setOpenDeleteModal(false);
      setOpenDeleteCompleteModal(true);
      setSelectedChapterId(null);
    } catch (error: unknown) {
      setOpenDeleteModal(false);
      setErrorMessage(
        error instanceof Error ? error.message : "챕터 삭제에 실패했습니다."
      );
    }
  };

  return {
    chapters,
    errorMessage,
    isLoading,
    openDeleteCompleteModal,
    openDeleteModal,
    closeDeleteComplete,
    closeDeleteConfirm,
    handleDeleteConfirm,
    openDeleteConfirm,
  };
};
