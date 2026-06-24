"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { CourseItem } from "@/features/classroom/components/types";
import { getCourseDetail } from "@/features/services/lectureDetail.service";
import { getPackageLoungeDetail } from "@/features/services/package.service";
import type { PackageLoungeDetail } from "../types";
import { getPackageSelection } from "../utils/selectionStorage";
import ReservationSummary from "./ReservationSummary";

interface LoadedReservation {
  detail: PackageLoungeDetail;
  course: CourseItem;
  continentCode: string;
}

export default function ReservationClient() {
  const router = useRouter();
  const [reservation, setReservation] = useState<LoadedReservation | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadReservation = async () => {
      const selection = getPackageSelection();

      if (!selection) {
        if (isMounted) {
          setError("선택한 패키지 정보가 없습니다. 패키지를 다시 선택해주세요.");
        }
        return;
      }

      try {
        const [detail, course] = await Promise.all([
          getPackageLoungeDetail(selection.packageId),
          getCourseDetail(selection.countryId, selection.courseId),
        ]);

        if (!isMounted) return;
        if (!course) {
          setError("선택한 강의 정보를 찾을 수 없습니다.");
          return;
        }

        setReservation({
          detail,
          course,
          continentCode: selection.continentCode,
        });
      } catch {
        if (isMounted) {
          setError("예약 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        }
      }
    };

    void loadReservation();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-[#F6F8FB] px-4 py-10">
        <div className="mx-auto max-w-[760px] rounded-2xl bg-white p-8 text-center">
          <p className="text-sm text-[#667085]">{error}</p>
          <button
            type="button"
            onClick={() => router.replace("/classroom")}
            className="mt-5 rounded-xl bg-[#439A97] px-5 py-3 text-xs font-bold text-white"
          >
            강의 선택으로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="min-h-screen bg-[#F6F8FB] px-4 py-10">
        <p className="text-center text-sm text-[#8796AA]">
          예약 정보를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  return (
    <ReservationSummary
      packageItem={reservation.detail.packageItem}
      accommodation={reservation.detail.accommodation}
      course={reservation.course}
      continentCode={reservation.continentCode}
    />
  );
}
