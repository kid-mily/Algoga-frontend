import { useMemo, useState } from "react";
import { getErrorMessage } from "@/features/common/utils/getErrorMessage";
import type { AdminCourseRecord, CourseCountry, LectureFilters, LectureModalState } from "../types";
import { filterLectures, getCountryOptions, withCountryNames } from "../utils/lectureFilters";

type UseLectureManageStateOptions = {
  lectures: AdminCourseRecord[];
  countries: CourseCountry[];
  removeLecture: (courseId: number) => Promise<void>;
  itemsPerPage?: number;
};

const initialFilters: LectureFilters = {
  status: "all",
  keyword: "",
  country: "all",
};

export const useLectureManageState = ({
  lectures,
  countries,
  removeLecture,
  itemsPerPage = 10,
}: UseLectureManageStateOptions) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<LectureFilters>(initialFilters);
  const [actionError, setActionError] = useState("");
  const [modal, setModal] = useState<LectureModalState>({ type: null });

  const lecturesWithCountryName = useMemo(
    () => withCountryNames(lectures, countries),
    [lectures, countries]
  );

  const countryOptions = useMemo(() => getCountryOptions(countries), [countries]);

  const filteredLectures = useMemo(
    () =>
      filterLectures(lecturesWithCountryName, {
        searchKeyword: filters.keyword,
        countryFilter: filters.country,
        statusFilter: filters.status,
      }),
    [lecturesWithCountryName, filters]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLectures.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLectures = filteredLectures.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const updateFilter = (key: keyof LectureFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const closeModal = () => {
    setModal({ type: null });
  };

  const openDeleteModal = (courseId: number) => {
    setModal({ type: "delete", courseId });
  };

  const openStudentModal = (course: { id: number; title: string }) => {
    setModal({ type: "students", course });
  };

  const handleDeleteConfirm = async () => {
    if (modal.type !== "delete") return;

    try {
      setActionError("");
      await removeLecture(modal.courseId);
      setModal({ type: "complete" });
    } catch (error: unknown) {
      closeModal();
      setActionError(getErrorMessage(error, "강의 삭제에 실패했습니다."));
    }
  };

  return {
    actionError,
    countryOptions,
    currentLectures,
    currentPage,
    filteredLectures,
    filters,
    modal,
    totalPages,
    closeModal,
    handleDeleteConfirm,
    openDeleteModal,
    openStudentModal,
    setCurrentPage,
    updateFilter,
  };
};
