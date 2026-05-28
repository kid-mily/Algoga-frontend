// src/app/contentadmin/lecture/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import LectureCard from "@/features/contentmanage/LectureCard";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";

import type { AdminCourse } from "@/features/services/adminCourse.service";
import { getAdminCourses } from "@/features/services/adminCourse.service";

export default function LecturePage() {
  const router = useRouter();

  const [lectures, setLectures] = useState<AdminCourse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getAdminCourses();
        setLectures(data);
      } catch (error: any) {
        setErrorMessage(error.message || "강의 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectures();
  }, []);

  const filteredLectures = useMemo(() => {
    return lectures.filter((lecture) => {
      const title = lecture.title || "";
      const description = lecture.description || "";

      const isPublic =
        lecture.isPublic === true ||
        lecture.status === "PUBLIC" ||
        lecture.status === "OPEN" ||
        lecture.status === "PUBLISHED";

      const keyword = searchKeyword.trim().toLowerCase();

      const matchesSearch =
        keyword === "" ||
        title.toLowerCase().includes(keyword) ||
        description.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "public" && isPublic) ||
        (statusFilter === "private" && !isPublic);

      return matchesSearch && matchesStatus;
    });
  }, [lectures, searchKeyword, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLectures.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentLectures = filteredLectures.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatPrice = (price?: number) => {
    if (typeof price !== "number") {
      return "-";
    }

    return `${price.toLocaleString()}원`;
  };

  const formatDate = (createdAt?: string) => {
    if (!createdAt) {
      return "-";
    }

    return createdAt.slice(0, 10).replaceAll("-", ".");
  };

  const getIsPublic = (lecture: AdminCourse) => {
    return (
      lecture.isPublic === true ||
      lecture.status === "PUBLIC" ||
      lecture.status === "OPEN" ||
      lecture.status === "PUBLISHED"
    );
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <SimpleSubHeader
          title="강의 관리"
          description="나라별 강의 콘텐츠를 등록하고 관리합니다"
        />

        <div className="mt-5 rounded-[20px] border border-[#E4E7EC] bg-white p-10 text-center text-[14px] text-[#667085]">
          강의 목록을 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full">
        <SimpleSubHeader
          title="강의 관리"
          description="나라별 강의 콘텐츠를 등록하고 관리합니다"
        />

        <div className="mt-5 rounded-[20px] border border-[#FCA5A5] bg-white p-10 text-center text-[14px] text-[#DC2626]">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SimpleSubHeader
        title="강의 관리"
        description="나라별 강의 콘텐츠를 등록하고 관리합니다"
      />

      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex h-[42px] min-w-0 flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
            <img
              src="/images/search.svg"
              alt="검색"
              className="h-[15px] w-[15px]"
            />

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

        {currentLectures.map((lecture) => (
          <LectureCard
            key={lecture.courseId}
            thumbnail={lecture.thumbnailUrl || ""}
            country={lecture.countryName || `국가 ID ${lecture.countryId}`}
            title={lecture.title || "-"}
            description={lecture.description || "-"}
            price={formatPrice(lecture.price)}
            students={`${lecture.studentCount ?? 0}`}
            chapters={lecture.chapterCount ?? 0}
            createdAt={formatDate(lecture.createdAt)}
            isPublic={getIsPublic(lecture)}
            onChapterManage={() =>
              router.push(`/contentadmin/lecture/${lecture.courseId}/chapters`)
            }
            onUsersClick={() =>
              router.push(`/contentadmin/lecture/${lecture.courseId}`)
            }
            onEditClick={() =>
              router.push(`/contentadmin/lecture/${lecture.courseId}/edit`)
            }
            onDeleteClick={() =>
              router.push(`/contentadmin/lecture/${lecture.courseId}/delete`)
            }
          />
        ))}

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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="h-[38px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}