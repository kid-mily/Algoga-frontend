"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const getParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function PaymentCompletePage() {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParam(params.continentCode);
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);

  const studyHref = `/classroom/${continentCode}/${countryId}/lecture/${courseId}`;

  useEffect(() => {
    if (!continentCode || !countryId || !courseId) {
      router.replace("/classroom");
    }
  }, [continentCode, countryId, courseId, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-4">
      <section className="w-full max-w-md rounded-3xl border border-[#EBF0F5] bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EFFFFE]">
          <span className="text-4xl font-bold text-[#5E908D]">✓</span>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-[#0A1628]">
          결제가 완료되었습니다
        </h1>

        <p className="mb-8 text-sm leading-6 text-[#8A9BB0]">
          수강 신청이 정상적으로 처리되었습니다.
          <br />
          지금 바로 강의실에서 학습을 시작해 보세요.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push(studyHref)}
            className="h-14 w-full rounded-2xl bg-[#5E908D] font-bold text-white transition hover:bg-[#4F7F7C]"
          >
            바로 수강하러 가기
          </button>

          <button
            type="button"
            onClick={() => router.push("/classroom")}
            className="h-14 w-full rounded-2xl border border-[#DCE3EA] bg-white font-semibold text-[#0A1628] transition hover:bg-gray-50"
          >
            다른 강의 둘러보기
          </button>
        </div>
      </section>
    </main>
  );
}
