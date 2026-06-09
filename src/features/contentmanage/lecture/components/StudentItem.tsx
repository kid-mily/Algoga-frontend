import { StudentItemProps } from "../types";

export default function StudentItem({
  id,
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
  const displayName = name || "이름 없음";

  return (
    <tr className="border-b border-[#E4E7EC] text-[14px] text-[#111827]">
      <td className="px-6 py-4 align-middle">
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheck}
          aria-label={`${displayName} 선택`}
          className="h-[18px] w-[18px] rounded-[5px] border border-[#D0D5DD] accent-[#439A97]"
        />
      </td>

      <th scope="row" className="px-6 py-4 text-left align-middle">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#439A97] text-[18px] text-white"
          >
            {displayName[0]}
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#111827]">
              {displayName}
            </p>
            <p className="mt-0.5 text-[13px] text-[#98A2B3]">
              {lecture}
            </p>
          </div>
        </div>
      </th>

      <td className="px-6 py-4 align-middle text-[15px] font-medium text-[#4B5563]">
        <a href={`mailto:${email}`} className="hover:underline">
          {email}
        </a>
      </td>

      <td className="px-6 py-4 align-middle">
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-semibold ${
            status === "complete"
              ? "bg-[#EAF7EE] text-[#43A047]"
              : "bg-[#E8F5F4] text-[#439A97]"
          }`}
        >
          {status === "complete" ? "완료" : "진행중"}
        </span>
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-4">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={`${displayName} 강의 진도율`}
            className="h-[8px] w-[140px] overflow-hidden rounded-full bg-[#E5E7EB]"
          >
            <div
              className="h-full rounded-full bg-[#439A97]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[14px] font-semibold text-[#4B5563]">
            {progress}%
          </span>
        </div>
      </td>

      <td className="px-6 py-4 align-middle">
        <span
          className={`inline-flex rounded-[8px] px-3 py-1.5 text-[13px] font-semibold ${
            quizComplete
              ? "bg-[#EAF7EE] text-[#43A047]"
              : "bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {quizComplete ? "완료" : "미완료"}
        </span>
      </td>

      <td className="px-6 py-4 align-middle">
        <span
          className={`inline-flex rounded-[8px] px-3 py-1.5 text-[13px] font-semibold ${
            reviewWritten
              ? "bg-[#F3E8FF] text-[#9333EA]"
              : "bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {reviewWritten ? "작성" : "미작성"}
        </span>
      </td>

      <td className="px-6 py-4 align-middle text-[14px] font-medium text-[#667085]">
        <time dateTime={createdAt === "-" ? undefined : createdAt}>
          {createdAt}
        </time>
        <span className="sr-only"> 수강생 ID {id}</span>
      </td>
    </tr>
  );
}
