interface RegisterStepHeaderProps {
  currentStep: number;
}

export default function RegisterStepHeader({
  currentStep,
}: RegisterStepHeaderProps) {

  // 회원가입 단계 목록
  const steps = [
    "기본 정보",
    "약관 동의",
    "가입 완료",
  ];

  return (
    // 전체 step header 영역
    <div className="mt-8 flex w-[1000] items-center justify-between">
        
      {/* 단계 반복 */}
      {steps.map((step, index) => {

        // 현재 step 번호
        // index는 0부터 시작이라 +1
        const stepNumber = index + 1;

        // 현재 단계 활성화 여부
        // ex) currentStep=2면
        // 1,2 활성화 / 3 비활성화
        const active = currentStep >= stepNumber;

        return (
          <div
            key={step}
            className="flex flex-1 items-center"
          >
            {/* 원 + 텍스트 */}
            <div className="flex flex-col items-center">

              {/* 원형 step 번호 */}
              <div
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full text-[16px] font-semibold ${
                  active
                    ? "bg-[#439A97] text-white"
                    : "border border-[#E4E7EC] bg-white text-[#98A2B3]"
                }`}
              >
                {stepNumber}
              </div>

              {/* step 이름 */}
              <span
                className={`mt-3 text-[13px] ${
                  active
                    ? "font-semibold text-[#439A97]"
                    : "text-[#98A2B3]"
                }`}
              >
                {step}
              </span>
            </div>

            {/* step 사이 연결선 */}
            {stepNumber !== 3 && (
              <div className="mx-6 mb-8 h-px flex-1 bg-[#E4E7EC]" />
            )}
          </div>
        );
      })}
    </div>
  );
}