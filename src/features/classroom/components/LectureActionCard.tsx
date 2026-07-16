"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import Modal from "@/features/common/components/Modal";
import { getCourseStudyDetail } from "@/features/services/courseStudy.service";
import { getMe } from "@/features/services/user.service";
import type { CourseItem } from "./types";

interface LectureActionCardProps {
  course: CourseItem & {
    isPaid?: boolean;
    purchased?: boolean;
    paid?: boolean;
    enrolled?: boolean;
  };
  continentCode: string;
  countryId: string;
  courseId: string;
}

export default function LectureActionCard({
  course,
  continentCode,
  countryId,
  courseId,
}: LectureActionCardProps) {
  const router = useRouter();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [canStudy, setCanStudy] = useState(
    Boolean(course.isPaid ?? course.purchased ?? course.paid)
  );

  const pathContinentCode = continentCode.trim().toLowerCase();
  const studyHref = `/classroom/${pathContinentCode}/${countryId}/lecture/${courseId}/study`;
  const paymentHref = `/classroom/${pathContinentCode}/${countryId}/lecture/${courseId}/payment/single`;

  useEffect(() => {
    let isActive = true;

    const checkAccess = async () => {
      try {
        setIsCheckingAccess(true);
        setRequiresLogin(false);

        const user = await getMe();

        if (!isActive) return;

        if (!user) {
          setRequiresLogin(true);
          setCanStudy(false);
          return;
        }

        try {
          await getCourseStudyDetail(courseId);

          if (!isActive) return;

          setCanStudy(true);
        } catch (error) {
          if (!isActive) return;

          if (error instanceof ApiRequestError) {
            if (
              error.status === 403 ||
              error.status === 404
            ) {
              setCanStudy(false);
              return;
            }
          }

          console.error(
            "[lecture-action] 수강 권한 확인 실패:",
            error
          );

          setCanStudy(
            Boolean(
              course.isPaid ??
                course.purchased ??
                course.paid
            )
          );
        }
      } catch (error) {
        if (!isActive) return;

        if (
          error instanceof ApiRequestError &&
          error.status === 401
        ) {
          setRequiresLogin(true);
          setCanStudy(false);
          return;
        }

        console.error(
          "[lecture-action] 로그인 상태 확인 실패:",
          error
        );

        setRequiresLogin(true);
        setCanStudy(false);
      } finally {
        if (isActive) {
          setIsCheckingAccess(false);
        }
      }
    };

    checkAccess();

    return () => {
      isActive = false;
    };
  }, [courseId, course.isPaid, course.purchased, course.paid]);

  const handleActionClick = () => {
    if (requiresLogin) {
      setIsLoginModalOpen(true);
      return;
    }

    router.push(canStudy ? studyHref : paymentHref);
  };

  const handleLoginConfirm = () => {
    setIsLoginModalOpen(false);
    router.push("/auth/login");
  };

  return (
    <>
      <section className="rounded-2xl border border-[#E1E8EF] bg-white p-6 shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-[#439A97]">
              COURSE
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#0A1628]">
              강의 수강
            </h2>

            <p className="mt-1 flex items-center gap-2 text-sm text-[#718096]">
              <span className="font-semibold text-[#439A97]">
                {course.levelName || course.level}
              </span>
              <span>|</span>
              <span>{course.price.toLocaleString()}원</span>
            </p>
          </div>

          <button
            type="button"
            disabled={isCheckingAccess}
            onClick={handleActionClick}
            className="h-12 rounded-2xl bg-[#439A97] px-6 text-sm font-bold text-white transition hover:bg-[#357A78] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCheckingAccess ? "확인 중..." : canStudy ? "강의 듣기" : "결제하기"}
          </button>
        </div>
      </section>

      <Modal
        open={isLoginModalOpen}
        title="로그인이 필요합니다"
        description="결제 또는 수강을 진행하려면 로그인이 필요합니다. 로그인 후 다시 시도해 주세요."
        confirmText="로그인하기"
        cancelText="취소"
        onConfirm={handleLoginConfirm}
        onCancel={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}