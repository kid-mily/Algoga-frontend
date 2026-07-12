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
          setError(
            "선택한 패키지 정보가 없습니다. 패키지 라운지에서 다시 선택해 주세요."
          );
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
          setError("예약 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
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
      <main className="min-h-screen bg-[#F3F7FB] px-4 py-16">
        <section className="mx-auto max-w-[520px] rounded-[20px] border border-[#E2EAF1] bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#172235]">{error}</p>
          <button
            type="button"
            onClick={() => router.replace("/packagelounge")}
            className="mt-6 h-11 rounded-xl bg-[#67A19E] px-6 text-sm font-bold text-white transition hover:bg-[#5A928F]"
          >
            패키지 라운지로 돌아가기
          </button>
        </section>
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="min-h-screen bg-[#F3F7FB] px-4 py-16">
        <section className="mx-auto max-w-[520px] rounded-[20px] border border-[#E2EAF1] bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-bold text-[#172235]">
            예약 정보를 불러오는 중입니다.
          </p>
          <p className="mt-2 text-xs text-[#8A98AA]">
            항공권과 숙소 정보를 확인하고 있어요.
          </p>
        </section>
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
