"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import Modal from "@/features/common/Modal";
import CompleteModal from "@/features/common/CompleteModal";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import AdminLoadingState from "@/features/common/AdminLoadingState";

import StudentForm from "./StudentForm";
import LectureToolbar from "./LectureToolbar";
import LectureTable from "./LectureTable";
import LecturePagination from "./LecturePagination";

import { useAdminLectureList } from "../hooks/useAdminLectureList";
import {
  filterLectures,
  getCountryOptions,
  withCountryNames,
} from "../utils/lectureFilters";

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  return error instanceof Error ? error.message || fallbackMessage : fallbackMessage;
};

export default function LectureManageClient() {
  const router = useRouter();
  const { lectures, countries, isLoading, fetchError, removeLecture } =
    useAdminLectureList();

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [actionError, setActionError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [targetCourseForStudent, setTargetCourseForStudent] =
    useState<{ id: number; title: string } | null>(null);

  const itemsPerPage = 10;

  const lecturesWithCountryName = useMemo(
    () => withCountryNames(lectures, countries),
    [lectures, countries]
  );

  const countryOptions = useMemo(
    () => getCountryOptions(lecturesWithCountryName),
    [lecturesWithCountryName]
  );

  const filteredLectures = useMemo(
    () =>
      filterLectures(lecturesWithCountryName, {
        searchKeyword,
        countryFilter,
        statusFilter,
      }),
    [lecturesWithCountryName, searchKeyword, countryFilter, statusFilter]
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

  const resetPage = () => {
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourseId) return;

    try {
      setActionError("");
      await removeLecture(selectedCourseId);
      setDeleteModalOpen(false);
      setCompleteModalOpen(true);
      setSelectedCourseId(null);
    } catch (error: unknown) {
      setDeleteModalOpen(false);
      setActionError(getErrorMessage(error, "강의 삭제에 실패했습니다."));
    }
  };

  return (
    <main className="w-full" aria-labelledby="lecture-management-title">
      <section aria-labelledby="lecture-management-title">
        <SimpleSubHeader
          title="강의 관리"
          description="국가별 강의 콘텐츠를 등록하고 관리합니다."
        />
      </section>

      {isLoading && <AdminLoadingState text="강의를 불러오는 중..." />}
      {!isLoading && fetchError && <AdminErrorBanner message={fetchError} />}

      {!isLoading && !fetchError && (
        <>
          <AdminErrorBanner message={actionError} />

          <section aria-label="강의 검색 및 필터 영역">
            <LectureToolbar
              searchKeyword={searchKeyword}
              countryFilter={countryFilter}
              statusFilter={statusFilter}
              countryOptions={countryOptions}
              onSearchKeywordChange={(value) => {
                setSearchKeyword(value);
                resetPage();
              }}
              onCountryFilterChange={(value) => {
                setCountryFilter(value);
                resetPage();
              }}
              onStatusFilterChange={(value) => {
                setStatusFilter(value);
                resetPage();
              }}
            />
          </section>

          <section aria-labelledby="lecture-list-title">
            <h2 id="lecture-list-title" className="sr-only">
              강의 목록
            </h2>
            <LectureTable
              lectures={currentLectures}
              totalCount={filteredLectures.length}
              onChapterManage={(courseId) =>
                router.push(`/contentadmin/lecture/${courseId}/chapter/new`)
              }
              onUsersClick={(course) => {
                setTargetCourseForStudent(course);
                setStudentModalOpen(true);
              }}
              onEditClick={(courseId) =>
                router.push(`/contentadmin/lecture/${courseId}/edit`)
              }
              onDeleteClick={(courseId) => {
                setSelectedCourseId(courseId);
                setDeleteModalOpen(true);
              }}
            >
              <LecturePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </LectureTable>
          </section>
        </>
      )}

      <Modal
        open={deleteModalOpen}
        title="강의 삭제"
        description="정말 이 강의를 삭제하시겠습니까? 연결된 챕터도 함께 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedCourseId(null);
        }}
      />

      <CompleteModal
        open={completeModalOpen}
        title="삭제 완료"
        description="강의가 삭제되었습니다."
        buttonText="확인"
        onConfirm={() => setCompleteModalOpen(false)}
      />

      <StudentForm
        open={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        courseId={targetCourseForStudent?.id || null}
        courseTitle={targetCourseForStudent?.title || ""}
      />
    </main>
  );
}
