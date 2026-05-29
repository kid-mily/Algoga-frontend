"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import QuizList from "@/features/contentmanage/quiz/QuizList";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import {
  getAdminCourses,
  type AdminCourse,
} from "@/features/services/adminCourse.service";
import {
  getAdminQuizzes,
  type AdminQuiz,
} from "@/features/services/adminQuiz.service";

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
    if (courseList.length === 0) {
      setQuizzes([]);
      return;
    }

    if (selectedValue === "all") {
      const quizGroups = await Promise.all(
        courseList.map(async (course) => {
          try {
            const quizList = await getAdminQuizzes(course.courseId);

            return quizList.map((quiz) => ({
              ...quiz,
              lectureTitle: course.title,
            }));
          } catch {
            return [];
          }
        })
      );

      setQuizzes(quizGroups.flat());
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

    setQuizzes(
      quizList.map((quiz) => ({
        ...quiz,
        lectureTitle: selectedCourse?.title,
      }))
    );
  };

  const fetchPageData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const courseList = await getAdminCourses();

      setCourses(courseList);

      await fetchQuizzesByCourses(courseList, selectedLecture);
    } catch (error: any) {
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
    if (courses.length === 0) return;

    const reloadQuizzes = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        await fetchQuizzesByCourses(courses, selectedLecture);
      } catch (error: any) {
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
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return quizzes;

    return quizzes.filter((quiz) =>
      quiz.question.toLowerCase().includes(keyword)
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
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="문제 내용 검색..."
                className="ml-2 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
              />
            </div>

            <select
              value={selectedLecture}
              onChange={(e) => setSelectedLecture(e.target.value)}
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
        <div className="mt-6 rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#98A2B3]">
          퀴즈 목록을 불러오는 중입니다...
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