"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import QuizList from "@/features/contentmanage/quiz/QuizList";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { getAdminCourses } from "@/features/services/adminCourse.service";
import { getAdminQuizzes } from "@/features/services/adminQuiz.service";
import { AdminCourse } from "@/features/contentmanage/lecture/types";
import { AdminQuiz } from "@/features/contentmanage/quiz/types";
// 🌟 스피너 컴포넌트 추가
import LoadingSpinner from "@/features/common/LoadingSpinner";

export default function QuizPage() {
  const [selectedLecture, setSelectedLecture] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchQuizzesByCourses = async (
    courseList: AdminCourse[],
    selectedValue: string
  ) => {
    if (!Array.isArray(courseList) || courseList.length === 0) {
      console.log("퀴즈 조회할 강의가 없습니다.");
      setQuizzes([]);
      return;
    }

    console.log("퀴즈 조회할 강의 목록:", courseList);
    console.log("선택된 강의:", selectedValue);

    if (selectedValue === "all") {
      const quizGroups = await Promise.all(
        courseList.map(async (course) => {
          try {
            const quizList = await getAdminQuizzes(course.courseId);

            console.log(`${course.courseId}번 강의 퀴즈 목록:`, quizList);

            return quizList.map((quiz) => ({
              ...quiz,
              lectureTitle: course.title,
            }));
          } catch (error) {
            console.error(
              `강의 ID ${course.courseId} 퀴즈 목록 조회 실패:`,
              error
            );
            return [];
          }
        })
      );

      const allQuizzes = quizGroups.flat();

      console.log("전체 퀴즈 목록:", allQuizzes);

      setQuizzes(allQuizzes);
      return;
    }

    const courseId = Number(selectedValue);

    if (!courseId) {
      setQuizzes([]);
      return;
    }

    const selectedCourse = courseList.find(
      (course) => course.courseId === courseId
    );

    const quizList = await getAdminQuizzes(courseId);

    const mappedQuizzes = quizList.map((quiz) => ({
      ...quiz,
      lectureTitle: selectedCourse?.title,
    }));

    console.log(`${courseId}번 선택 강의 퀴즈 목록:`, mappedQuizzes);

    setQuizzes(mappedQuizzes);
  };

  const fetchPageData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const courseList = await getAdminCourses();
      const safeCourseList = Array.isArray(courseList) ? courseList : [];

      console.log("퀴즈 페이지 강의 목록:", safeCourseList);

      setCourses(safeCourseList);

      await fetchQuizzesByCourses(safeCourseList, selectedLecture);
    } catch (error: any) {
      console.error("퀴즈 페이지 데이터 조회 실패:", error);
      setErrorMessage(error?.message || "퀴즈 목록을 불러오지 못했습니다.");
      setCourses([]);
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!Array.isArray(courses) || courses.length === 0) {
      setQuizzes([]);
      return;
    }

    const reloadQuizzes = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        await fetchQuizzesByCourses(courses, selectedLecture);
      } catch (error: any) {
        console.error("퀴즈 재조회 실패:", error);
        setErrorMessage(error?.message || "퀴즈 목록을 불러오지 못했습니다.");
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    };

    reloadQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLecture]);

  const filteredQuizzes = useMemo(() => {
    const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return safeQuizzes;

    return safeQuizzes.filter((quiz) =>
      quiz.question?.toLowerCase().includes(keyword)
    );
  }, [quizzes, searchKeyword]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SimpleSubHeader
        title="퀴즈 관리"
        description="강의별 퀴즈를 등록하고 관리합니다"
      />

      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 gap-3">
            <div className="flex h-[42px] flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
              <img
                src="/images/search.svg"
                alt="검색"
                className="h-[16px] w-[16px]"
              />

              <input
                type="text"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="문제 내용 검색..."
                className="ml-2 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
              />
            </div>

            <select
              value={selectedLecture}
              onChange={(event) => setSelectedLecture(event.target.value)}
              className="h-[42px] w-[220px] rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
            >
              <option value="all">전체 강의</option>

              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/contentadmin/quiz/new"
            className="flex h-[42px] items-center rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white transition hover:opacity-90"
          >
            + 퀴즈 등록
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 flex justify-center rounded-[18px] border border-[#E4E7EC] bg-white p-8">
          <LoadingSpinner text="퀴즈 목록을 불러오는 중입니다..." />
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="mt-6 rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-red-500">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && (
        <QuizList quizzes={filteredQuizzes} onDeleted={fetchPageData} />
      )}
    </div>
  );
}
