import { useEffect, useMemo, useState } from "react";
import { getCourseStudents } from "@/features/services/adminStudent.service";
import type { Student, StudentRow } from "../types";

const formatStudentDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value.slice(0, 10) || "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const mapStudentToRow = (
  student: Student,
  fallbackCourseTitle: string
): StudentRow => ({
  id: student.userId,
  name: student.userName || student.name || "이름 없음",
  lecture: student.courseTitle || fallbackCourseTitle,
  email: student.email,
  status:
    student.learningStatus === "COMPLETED" ||
    student.status === "COMPLETED" ||
    student.status === "complete" ||
    student.progressRate === 100 ||
    student.progress === 100
      ? "complete"
      : "progress",
  progress: Math.min(
    100,
    Math.max(0, student.progressRate ?? student.progress ?? 0)
  ),
  quizComplete:
    student.quizSubmitted ??
    student.quizCompleted ??
    student.quizComplete ??
    false,
  reviewWritten: student.reviewCreated ?? student.reviewWritten ?? false,
  createdAt: formatStudentDate(student.completedAt),
});

export const useCourseStudents = ({
  open,
  courseId,
  courseTitle,
  onClose,
}: {
  open: boolean;
  courseId: number | null;
  courseTitle: string;
  onClose: () => void;
}) => {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchStudents = async () => {
      if (!courseId) return;
      try {
        setIsLoading(true);
        setApiError("");
        const data = await getCourseStudents(courseId, controller.signal);
        if (controller.signal.aborted) return;
        const mappedData = data.map((student) =>
          mapStudentToRow(student, courseTitle)
        );
        setStudents(mappedData);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : "수강생 목록을 불러오지 못했습니다.";
        setApiError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    if (open && courseId) {
      void fetchStudents();
    }

    return () => {
      controller.abort();
    };
  }, [open, courseId, courseTitle]);

  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return students;

    return students.filter((student) =>
      [student.name, student.email]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [searchKeyword, students]);

  const handleClose = () => {
    setStudents([]);
    setSelectedIds([]);
    setApiError("");
    setSearchKeyword("");
    onClose();
  };

  const handleSelectAll = () => {
    const allFilteredSelected =
      filteredStudents.length > 0 &&
      filteredStudents.every((student) => selectedIds.includes(student.id));

    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((student) => student.id));
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelectedIds = () => {
    setSelectedIds([]);
  };

  return {
    apiError,
    filteredStudents,
    isLoading,
    searchKeyword,
    selectedIds,
    students,
    clearSelectedIds,
    handleClose,
    handleSelect,
    handleSelectAll,
    setSearchKeyword,
  };
};
