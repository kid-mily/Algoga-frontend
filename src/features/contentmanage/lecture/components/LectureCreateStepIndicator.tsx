import { LectureCreateStepIndicatorProps } from "../types";

export default function LectureCreateStepIndicator({
  step,
}: LectureCreateStepIndicatorProps) {
  const steps = [
    {
      number: 1,
      title: "강의 기본 정보",
      description: "강의 기본 정보를 입력합니다.",
    },
    {
      number: 2,
      title: "챕터 정보",
      description: "강의 챕터를 등록합니다.",
    },
  ];

  return (
    <nav
      aria-label="강의 등록 단계"
      className="border-b border-[#E4E7EC] bg-white py-7"
    >
      <ol className="mx-auto flex max-w-[900px] items-center justify-center">
        {steps.map((item, index) => (
          <li key={item.number} className="flex items-center">
            {index > 0 && <div className="mx-12 h-px w-[120px] bg-[#E4E7EC]" aria-hidden="true" />}

            <div className="flex items-center" aria-current={step === item.number ? "step" : undefined}>
              <div
                className={`flex h-[40px] w-[40px] items-center justify-center rounded-full text-[18px] font-semibold ${
                  step >= item.number
                    ? "bg-[#439A97] text-white"
                    : "bg-[#F2F4F7] text-[#98A2B3]"
                }`}
              >
                {item.number}
              </div>
              <div className="ml-4">
                <p className="text-[16px] font-semibold text-[#111827]">
                  {item.title}
                </p>
                <p className="mt-1 text-[14px] text-[#98A2B3]">
                  {item.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
