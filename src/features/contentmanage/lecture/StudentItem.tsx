interface StudentItemProps {
  name: string;
  lecture: string;
  email: string;
  status: "complete" | "progress";
  progress: number;
  quizComplete: boolean;
  reviewWritten: boolean;
  createdAt: string;
  checked: boolean;
  onCheck: () => void;
}

export default function StudentItem({
  name,
  lecture,
  email,
  status,
  progress,
  quizComplete,
  reviewWritten,
  createdAt,

  checked,
  onCheck,
}: StudentItemProps) {

  return (
    <div className="grid grid-cols-[50px_2fr_1.3fr_120px_200px_100px_100px_100px] items-center border-b border-[#E4E7EC] px-6 py-4">

      {/* 체크박스 */}
      <div>
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheck}
          className="h-[18px] w-[18px] rounded-[5px] border border-[#D0D5DD] accent-[#439A97]"
        />
      </div>

      {/* 학생 */}
      <div className="flex items-center gap-3">

        {/* 프로필 */}
        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#439A97] text-[18px] font-bold text-white shadow-sm">

          {name[0]}
        </div>

        {/* 이름 */}
        <div>

          <p className="text-[15px] font-bold text-[#111827]">
            {name}
          </p>

          <p className="mt-0.5 text-[13px] text-[#98A2B3]">
            {lecture}
          </p>
        </div>
      </div>

      {/* 이메일 */}
      <div className="text-[15px] font-medium text-[#4B5563]">
        {email}
      </div>

      {/* 상태 */}
      <div>

        <div
          className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-semibold ${
            status === "complete"
              ? "bg-[#EAF7EE] text-[#43A047]"
              : "bg-[#E8F5F4] text-[#439A97]"
          }`}
        >
          {status === "complete"
            ? "수강 완료"
            : "수강중"}
        </div>
      </div>

      {/* 진도율 */}
      <div className="flex items-center gap-4">

        <div className="h-[8px] w-[140px] overflow-hidden rounded-full bg-[#E5E7EB]">

          <div
            className="h-full rounded-full bg-[#439A97]"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <span className="text-[14px] font-semibold text-[#4B5563]">
          {progress}%
        </span>
      </div>

      {/* 퀴즈 */}
      <div>

        <div
          className={`inline-flex rounded-[8px] px-3 py-1.5 text-[13px] font-semibold ${
            quizComplete
              ? "bg-[#EAF7EE] text-[#43A047]"
              : "bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {quizComplete
            ? "완료"
            : "미완료"}
        </div>
      </div>

      {/* 후기 */}
      <div>

        <div
          className={`inline-flex rounded-[8px] px-3 py-1.5 text-[13px] font-semibold ${
            reviewWritten
              ? "bg-[#F3E8FF] text-[#9333EA]"
              : "bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {reviewWritten
            ? "작성"
            : "미작성"}
        </div>
      </div>

      {/* 등록일 */}
      <div className="text-[14px] font-medium text-[#667085]">
        {createdAt}
      </div>
    </div>
  );
}