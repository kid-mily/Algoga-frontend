"use client";

import { useEffect, useState } from "react";
import {
  deleteLectureAction,
  getLectureCountriesAction,
  getLectureListAction,
} from "../actions";
import { AdminCourseRecord, CourseCountry } from "../types";

export function useAdminLectureList() {
  const [lectures, setLectures] = useState<AdminCourseRecord[]>([]);
  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchLectures = async () => {
    try {
      setIsLoading(true);
      setFetchError("");

      const [courseData, countryData] = await Promise.all([
        getLectureListAction(),
        getLectureCountriesAction(),
      ]);

      setLectures(courseData);
      setCountries(countryData);
    } catch (error: unknown) {
      setFetchError(
        error instanceof Error ? error.message : "강의 목록을 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeLecture = async (courseId: number) => {
    await deleteLectureAction(courseId);
    setLectures((prev) =>
      prev.filter((lecture) => {
        const id = lecture.courseId || lecture.course_id || lecture.id;
        return id !== courseId;
      })
    );
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchLectures();
  }, []);

  return {
    lectures,
    countries,
    isLoading,
    fetchError,
    refetch: fetchLectures,
    removeLecture,
  };
}
