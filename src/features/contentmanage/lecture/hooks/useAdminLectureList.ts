"use client";

import { useEffect, useState } from "react";
import {
  deleteLectureAction,
  getLectureCountriesAction,
  getLectureListAction,
} from "../actions";

export function useAdminLectureList() {
  const [lectures, setLectures] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
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
    } catch (error: any) {
      setFetchError(error.message || "강의 목록을 불러오지 못했습니다.");
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
    fetchLectures();
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
