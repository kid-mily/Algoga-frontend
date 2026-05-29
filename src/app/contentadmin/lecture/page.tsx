"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import LectureCard from "@/features/contentmanage/lecture/LectureCard";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import Modal from "@/features/common/Modal";
import CompleteModal from "@/features/common/CompleteModal";

import {
  getAdminCourses,
  getCourseCountries,
  deleteAdminCourse,
} from "@/features/services/adminCourse.service";

export default function LecturePage() {
  const router = useRouter();

  const [lectures, setLectures] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLectureData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [courseData, countryData] = await Promise.all([
          getAdminCourses(),
          getCourseCountries(),
        ]);

        setLectures(courseData);
        setCountries(countryData);
      } catch (error: any) {
        setErrorMessage(error.message || "강의 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectureData();
  }, []);

  const countryNameMap = useMemo(() => {
    const map = new Map<number, string>();
    countries.forEach((country) => {
      map.set(country.countryId, country.countryName);
    });
    return map;
  }, [countries]);

  // 🌟 공개 여부 로직 강화 (백엔드의 다양한 변수명 호환)
  const getIsPublic = (lecture: any) => {
    if (lecture.isPublic !== undefined) return lecture.isPublic;
    if (lecture.is_public !== undefined) return lecture.is_public;
    if (lecture.public !== undefined) return lecture.public; // 자바에서 boolean 필드명 이슈 방어
    if (lecture.status) {
      const s = String(lecture.status).toUpperCase();
      return s === "PUBLIC" || s === "OPEN" || s === "PUBLISHED";
    }
    return false;
  };

  const lecturesWithCountryName = useMemo(() => {
    return lectures.map((lecture) => {
      const mappedCountryName = countryNameMap.get(lecture.countryId || lecture.country_id);
      return {
        ...lecture,
        countryName:
          lecture.countryName ||
          lecture.country_name ||
          mappedCountryName ||
          `국가 ID ${lecture.countryId || lecture.country_id}`,
      };
    });
  }, [lectures, countryNameMap]);

  const countryOptions = useMemo(() => {
    const names = lecturesWithCountryName
      .map((lecture) => lecture.countryName)
      .filter((country): country is string => Boolean(country));
    return Array.from(new Set(names));
  }, [lecturesWithCountryName]);

  const filteredLectures = useMemo(() => {
    return lecturesWithCountryName.filter((lecture) => {
      const title = lecture.title || "";
      const description = lecture.description || "";
      const countryName = lecture.countryName || "";
      const isPublic = getIsPublic(lecture);

      const keyword = searchKeyword.trim().toLowerCase();
      const matchesSearch =
        keyword === "" ||
        title.toLowerCase().includes(keyword) ||
        description.toLowerCase().includes(keyword);
      const matchesCountry =
        countryFilter === "all" || countryName === countryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "public" && isPublic) ||
        (statusFilter === "private" && !isPublic);

      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [lecturesWithCountryName, searchKeyword, countryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLectures.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLectures = filteredLectures.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price?: number) => {
    if (typeof price !== "number") return "-";
    return `${price.toLocaleString()}원`;
  };

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "-";
    const datePart = dateValue.includes("T")
      ? dateValue.split("T")[0]
      : dateValue.split(" ")[0];
    return datePart.replaceAll("-", ".");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourseId) return;

    try {
      await deleteAdminCourse(selectedCourseId);
      setLectures((prev) => prev.filter((l) => (l.courseId || l.course_id) !== selectedCourseId));
      setDeleteModalOpen(false);
      setCompleteModalOpen(true);
      setSelectedCourseId(null);
    } catch (error: any) {
      alert(error.message || "강의 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <SimpleSubHeader title="강의 관리" description="나라별 강의 콘텐츠를 등록하고 관리합니다" />
        <div className="mt-5 rounded-[20px] border border-[#E4E7EC] bg-white p-10 text-center text-[14px] text-[#667085]">
          강의 목록을 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full">
        <SimpleSubHeader title="강의 관리" description="나라별 강의 콘텐츠를 등록하고 관리합니다" />
        <div className="mt-5 rounded-[20px] border border-[#FCA5A5] bg-white p-10 text-center text-[14px] text-[#DC2626]">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SimpleSubHeader title="강의 관리" description="나라별 강의 콘텐츠를 등록하고 관리합니다" />

      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex h-[42px] min-w-0 flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
            <img src="/images/search.svg" alt="검색" className="h-[15px] w-[15px]" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="강의 제목 검색..."
              className="ml-2 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#98A2B3]"
            />
          </div>

          <select
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[42px] w-[120px] rounded-[12px] border border-[#E4E7EC] px-2 text-[13px] outline-none"
          >
            <option value="all">전체 국가</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[42px] w-[100px] rounded-[12px] border border-[#E4E7EC] px-2 text-[13px] outline-none"
          >
            <option value="all">전체</option>
            <option value="public">공개</option>
            <option value="private">비공개</option>
          </select>

          <Link
            href="/contentadmin/lecture/new"
            className="flex h-[42px] whitespace-nowrap rounded-[12px] bg-[#439A97] px-4 text-[13px] font-semibold text-white"
          >
            <div className="flex items-center">+ 강의 등록</div>
          </Link>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-[#E4E7EC] bg-white">
        <div className="grid grid-cols-[0.9fr_0.9fr_2fr_1fr_1fr_0.8fr_1.2fr_1fr_1fr_1fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-5 py-4 text-[13px] font-semibold text-[#667085]">
          <div>썸네일</div>
          <div>국가</div>
          <div>강의 제목</div>
          <div>가격</div>
          <div>수강생</div>
          <div>챕터</div>
          <div>챕터관리</div>
          <div>등록일</div>
          <div className="text-center">상태</div>
          <div className="text-center">액션</div>
        </div>

       {currentLectures.map((lecture) => {
          const currentCourseId = lecture.courseId || lecture.course_id || lecture.id;
          
          // 🚨 백엔드가 도대체 무슨 이름으로 주는지 콘솔로 훔쳐보기!
          console.log(`강의[${currentCourseId}] 백엔드 원본 데이터:`, lecture);

          return (
            <LectureCard
              key={currentCourseId}
              thumbnail={lecture.thumbnailUrl || lecture.thumbnail_url || ""}
              country={lecture.countryName || lecture.country_name || "-"}
              title={lecture.title || "-"}
              description={lecture.description || "-"}
              price={formatPrice(lecture.price)}
              students={`${lecture.studentCount ?? lecture.student_count ?? 0}`}
              
              // 🌟 투망 던지기: 백엔드가 쓸만한 모든 이름 다 검사하기!!!
              chapters={
                lecture.chapterCount ?? 
                lecture.chapter_count ?? 
                lecture.chapters?.length ?? 
                lecture.chapterList?.length ?? 
                0
              } 
              
              createdAt={formatDate(lecture.createdAt || lecture.created_at)}
              isPublic={getIsPublic(lecture)}
              onChapterManage={() =>
                router.push(`/contentadmin/lecture/${currentCourseId}/chapter/new`)
              }
              onUsersClick={() =>
                router.push(`/contentadmin/lecture/${currentCourseId}`)
              }
              onEditClick={() =>
                router.push(`/contentadmin/lecture/${currentCourseId}/edit`)
              }
              onDeleteClick={() => {
                setSelectedCourseId(currentCourseId);
                setDeleteModalOpen(true);
              }}
            />
          );
        })}

        {currentLectures.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-[14px] text-[#98A2B3]">
            등록된 강의가 없습니다.
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-4">
          <p className="text-[13px] font-medium text-[#667085]">
            총 {filteredLectures.length}개의 강의
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="h-[38px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-[38px] w-[38px] items-center justify-center rounded-[12px] text-[13px] font-semibold ${
                    currentPage === page
                      ? "bg-[#439A97] text-white"
                      : "border border-[#E4E7EC] text-[#667085]"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="h-[38px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={deleteModalOpen}
        title="강의 삭제"
        description="정말 이 강의를 삭제하시겠습니까? (관련된 챕터도 모두 삭제됩니다)"
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
        description="강의가 성공적으로 삭제되었습니다."
        buttonText="확인"
        onConfirm={() => setCompleteModalOpen(false)}
      />
    </div>
  );
}