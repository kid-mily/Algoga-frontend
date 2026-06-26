"use client";

import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import AdminLoadingState from "@/features/admin/common/AdminLoadingState";
import DeletedLectureTable from "./DeletedLectureTable";
import DeletedLectureToolbar from "./DeletedLectureToolbar";
import LecturePagination from "./LecturePagination";
import { useAdminDeletedLectureList } from "../hooks/useAdminDeletedLectureList";

export default function DeletedLectureManageClient() {
  const {
    courses,
    countries,
    currentPage,
    totalPages,
    totalElements,
    selectedCountryId,
    lectureTitleKeyword,
    isLoading,
    errorMessage,
    setCurrentPage,
    changeSelectedCountryId,
    changeLectureTitleKeyword,
  } = useAdminDeletedLectureList();

  return (
    <main className="w-full" aria-labelledby="deleted-lecture-title">
      <section aria-labelledby="deleted-lecture-title">
        <SimpleSubHeader
          title="삭제 강의 목록"
          description="삭제 처리된 강의를 국가별로 조회합니다."
        />
      </section>

      <AdminErrorBanner message={errorMessage} />

      <section aria-label="삭제 강의 검색 및 필터 영역">
        <DeletedLectureToolbar
          countries={countries}
          selectedCountryId={selectedCountryId}
          lectureTitleKeyword={lectureTitleKeyword}
          onSelectedCountryIdChange={changeSelectedCountryId}
          onLectureTitleKeywordChange={changeLectureTitleKeyword}
        />
      </section>

      {isLoading ? (
        <AdminLoadingState text="삭제 강의 목록을 불러오는 중입니다." />
      ) : (
        <section aria-labelledby="deleted-lecture-list-title">
          <h2 id="deleted-lecture-list-title" className="sr-only">
            삭제 강의 목록
          </h2>
          <DeletedLectureTable courses={courses} totalCount={totalElements}>
            <LecturePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </DeletedLectureTable>
        </section>
      )}
    </main>
  );
}
