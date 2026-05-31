"use client";

interface RegisterAgreeFormProps {
  formData: any;
  onChange: (field: string, value: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function RegisterAgreeForm({
  formData,
  onChange,
  onPrev,
  onNext,
}: RegisterAgreeFormProps) {
  
  const { termsServiceAgreed, termsPrivacyAgreed, termsMarketingAgreed } = formData;

  // 전체 동의 상태 계산 (3개가 모두 true인지 확인)
  const allAgree = termsServiceAgreed && termsPrivacyAgreed && termsMarketingAgreed;

  // 전체 동의 클릭
  const handleAllAgree = () => {
    const nextValue = !allAgree;
    onChange("termsServiceAgreed", nextValue);
    onChange("termsPrivacyAgreed", nextValue);
    onChange("termsMarketingAgreed", nextValue);
  };

  // 다음 버튼 활성화 여부 (필수 약관 동의 확인)
  const canNext = termsServiceAgreed && termsPrivacyAgreed;
  return (
    <div className="mt-3 w-full rounded-[30px] bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      <h2 className="text-[25px] font-bold text-[#111827]">약관 동의</h2>

      <div className="mt-6 rounded-[22px] border border-[#E4E7EC] bg-[#F9FAFB] p-5">
        {/* 전체 동의 */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={allAgree}
            onChange={handleAllAgree}
            className="h-[18px] w-[18px] accent-[#439A97]"
          />
          <span className="text-[16px] font-semibold text-[#344054]">전체 동의</span>
        </label>

        <div className="my-5 h-px bg-[#E4E7EC]" />

        {/* 개별 약관 */}
        <div className="space-y-4 pl-7">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={termsServiceAgreed}
              onChange={(e) => onChange("termsServiceAgreed", e.target.checked)}
              className="h-[16px] w-[16px] accent-[#439A97]"
            />
            <span className="text-[15px] text-[#344054]">[필수] 이용약관 동의</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={termsPrivacyAgreed}
              onChange={(e) => onChange("termsPrivacyAgreed", e.target.checked)}
              className="h-[16px] w-[16px] accent-[#439A97]"
            />
            <span className="text-[15px] text-[#344054]">[필수] 개인정보 처리방침 동의</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={termsMarketingAgreed}
              onChange={(e) => onChange("termsMarketingAgreed", e.target.checked)}
              className="h-[16px] w-[16px] accent-[#439A97]"
            />
            <span className="text-[15px] text-[#344054]">[선택] 마케팅 정보 수신 동의</span>
          </label>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] bg-[#F5F7FA] p-5">
        <p className="text-[14px] leading-[24px] text-[#98A2B3]">
          알고가에 가입하시면 여행 학습, AI 일정 추천, 예약 서비스를 자유롭게 이용하실 수 있습니다.
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="h-[50px] flex-1 rounded-[18px] border border-[#D0D5DD] bg-white text-[16px] font-semibold text-[#667085] transition hover:bg-gray-50"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={`h-[50px] flex-1 rounded-[18px] text-[16px] font-semibold text-white transition ${
            canNext ? "bg-[#439A97] hover:bg-[#357c7a]" : "bg-[#D0D5DD] cursor-not-allowed"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}