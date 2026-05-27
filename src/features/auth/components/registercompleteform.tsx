"use client";

import Link from "next/link";

interface RegisterCompleteFormProps {
  formData?: any; // RegisterPage에서 넘어오는 가입 정보 (API 제출 완료 후 렌더링 가정)
}

export default function RegisterCompleteForm({ formData }: RegisterCompleteFormProps) {
  // 닉네임이나 이름이 없으면 기본 텍스트 출력
  const displayName = formData?.nickname || formData?.name || "고객";

  return (
    <div className="mx-auto w-full max-w-[560px]">
      {/* 완료 영역 */}
      <div className="flex flex-col items-center">
        {/* 완료 아이콘 */}
        <div className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-[#439A97]">
          <img
            src="/images/check.svg"
            alt="완료아이콘"
            className="h-[30px] w-[30px]"
          />
        </div>

        {/* 제목 (닉네임 활용하여 개인화) */}
        <h1 className="mt-5 text-[20px] font-bold text-[#111827]">
          {displayName}님, 회원가입이 완료되었습니다!
        </h1>

        {/* 설명 */}
        <p className="mt-2 text-[15px] text-[#98A2B3]">
          알고가의 다양한 여행 서비스를 이용해보세요
        </p>
      </div>

      {/* 서비스 소개 */}
      <div className="mt-6 space-y-3">
        {/* 여행 강의 */}
        <div className="flex items-center gap-3 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F5F7FA]">
            <img
              src="/images/book.svg"
              alt="학습아이콘"
              className="h-[18px] w-[18px]"
            />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#111827]">
              여행 강의 학습
            </h3>
            <p className="mt-1 text-[12px] text-[#98A2B3]">
              전문가의 여행 강의를 듣고 여행 지식을 쌓아보세요
            </p>
          </div>
        </div>

        {/* AI 일정 */}
        <div className="flex items-center gap-3 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F5F7FA]">
            <img
              src="/images/book.svg" // 필요시 ai 관련 아이콘 경로로 수정
              alt="AI아이콘"
              className="h-[18px] w-[18px]"
            />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#111827]">
              AI 맞춤 여행 일정
            </h3>
            <p className="mt-1 text-[12px] text-[#98A2B3]">
              개인화된 여행 코스를 AI가 추천해드립니다
            </p>
          </div>
        </div>

        {/* 커뮤니티 */}
        <div className="flex items-center gap-3 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F5F7FA]">
            <img
              src="/images/global.svg"
              alt="지구아이콘"
              className="h-[18px] w-[18px]"
            />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#111827]">
              여행 커뮤니티
            </h3>
            <p className="mt-1 text-[12px] text-[#98A2B3]">
              다른 여행자들과 경험을 공유하고 소통하세요
            </p>
          </div>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <Link
        href="/auth/login"
        className="mt-5 flex h-[48px] w-full items-center justify-center rounded-[14px] bg-[#439A97] text-[15px] font-semibold text-white transition hover:bg-[#357c7a]"
      >
        로그인하기
      </Link>
    </div>
  );
}