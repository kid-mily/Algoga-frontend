"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/features/common/Modal";
import { getCookie } from "@/lib/cookie";
import { CourseItem } from "./types";

interface LectureActionCardProps {
  course: CourseItem & {
    isPaid?: boolean;
    purchased?: boolean;
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

  const isPaid = Boolean(course.isPaid ?? course.purchased);

  const studyHref = `/classroom/${continentCode}/${countryId}/lecture/${courseId}/study`;
  const paymentHref = `/classroom/${continentCode}/${countryId}/lecture/${courseId}/payment/single`;

  const handleActionClick = () => {
    const token = getCookie("accessToken");

    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    router.push(isPaid ? studyHref : paymentHref);
  };

  const handleLoginConfirm = () => {
    setIsLoginModalOpen(false);
    router.push("/auth/login");
  };

  return (
    <>
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0A1628]">강의 듣기</h2>

            <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
              <span className="font-semibold text-[#439A97]">
                {course.levelName}
              </span>

              <span>|</span>

              <span>{course.price.toLocaleString()}원</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleActionClick}
            className="rounded-2xl bg-[#439A97] px-6 py-3 font-semibold text-white transition hover:bg-[#357A78]"
          >
            {isPaid ? "강의 듣기" : "결제하기"}
          </button>
        </div>
      </section>

      <Modal
        open={isLoginModalOpen}
        title="로그인이 필요합니다"
        description="결제를 진행하려면 로그인이 필요합니다. 로그인 후 다시 시도해 주세요."
        confirmText="로그인하기"
        cancelText="취소"
        onConfirm={handleLoginConfirm}
        onCancel={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}