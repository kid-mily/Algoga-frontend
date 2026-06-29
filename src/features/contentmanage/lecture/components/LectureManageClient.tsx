"use client";

import { useRouter } from "next/navigation";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import Modal from "@/features/common/components/Modal";
import CompleteModal from "@/features/common/components/CompleteModal";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import AdminLoadingState from "@/features/admin/common/AdminLoadingState";
import StudentForm from "./StudentForm";
import LectureToolbar from "./LectureToolbar";
import LectureTable from "./LectureTable";
import LecturePagination from "./LecturePagination";
import { useAdminLectureList } from "../hooks/useAdminLectureList";
import { useLectureManageState } from "../hooks/useLectureManageState";

export default function LectureManageClient() {
  const router = useRouter();
  const { lectures, countries, isLoading, fetchError, removeLecture } =
    useAdminLectureList();
  const {
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
  } = useLectureManageState({ lectures, countries, removeLecture });

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
              searchKeyword={filters.keyword}
              countryFilter={filters.country}
              statusFilter={filters.status}
              countryOptions={countryOptions}
              onSearchKeywordChange={(value) => updateFilter("keyword", value)}
              onCountryFilterChange={(value) => updateFilter("country", value)}
              onStatusFilterChange={(value) => updateFilter("status", value)}
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
              onQuizManage={(courseId) =>
                router.push(`/contentadmin/quiz?courseId=${courseId}`)
              }
              onUsersClick={openStudentModal}
              onEditClick={(courseId) =>
                router.push(`/contentadmin/lecture/${courseId}/edit`)
              }
              onDeleteClick={openDeleteModal}
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
        open={modal.type === "delete"}
        title="강의 삭제"
        description="정말 이 강의를 삭제하시겠습니까? 연결된 챕터도 함께 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={closeModal}
      />

      <CompleteModal
        open={modal.type === "complete"}
        title="삭제 완료"
        description="강의가 삭제되었습니다."
        buttonText="확인"
        onConfirm={closeModal}
      />

      <StudentForm
        open={modal.type === "students"}
        onClose={closeModal}
        courseId={modal.type === "students" ? modal.course.id : null}
        courseTitle={modal.type === "students" ? modal.course.title : ""}
      />
    </main>
  );
}
