"use client";

import { useEffect, useMemo, useState } from "react";
import { getLectureListAction } from "@/features/contentmanage/lecture/actions";
import { AdminCourse } from "@/features/contentmanage/lecture/types";
import { getQuizListAction } from "../actions";
import { AdminQuizWithLecture } from "../types";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message || fallback : fallback;
};

export function useAdminQuizList(initialCourseId = "all") {
  const [selectedLecture, setSelectedLecture] = useState(
    initialCourseId || "all"
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuizWithLecture[]>([]);
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
            const quizList = await getQuizListAction(course.courseId);
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
    const quizList = await getQuizListAction(courseId);

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

      const courseList = await getLectureListAction();
      const safeCourseList = Array.isArray(courseList) ? courseList : [];

      setCourses(safeCourseList);
      await fetchQuizzesByCourses(safeCourseList, selectedLecture);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "퀴즈 목록을 불러오지 못했습니다."));
      setCourses([]);
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (courses.length === 0) return;

    const reloadQuizzes = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        await fetchQuizzesByCourses(courses, selectedLecture);
      } catch (error: unknown) {
        setErrorMessage(getErrorMessage(error, "퀴즈 목록을 불러오지 못했습니다."));
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    };

    void reloadQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLecture]);

  const filteredQuizzes = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return quizzes;

    return quizzes.filter((quiz) =>
      quiz.question?.toLowerCase().includes(keyword)
    );
  }, [quizzes, searchKeyword]);

  return {
    selectedLecture,
    setSelectedLecture,
    searchKeyword,
    setSearchKeyword,
    courses,
    filteredQuizzes,
    isLoading,
    errorMessage,
    refetch: fetchPageData,
  };
}
