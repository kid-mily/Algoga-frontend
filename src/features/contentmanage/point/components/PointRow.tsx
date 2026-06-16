import { StudentPointInfo } from "../types";

interface PointRowProps {
  student: StudentPointInfo;
  onDetail: (studentId: number) => void;
  onGive: (student: StudentPointInfo) => void;
  onRecall: (student: StudentPointInfo) => void;
}

export default function PointRow({
  student,
  onDetail,
  onGive,
  onRecall,
}: PointRowProps) {
  return (
    <tr className="border-b border-[#E4E7EC] transition hover:bg-[#FCFCFD]">
      <td className="px-6 py-5">
        <button
          type="button"
          onClick={() => onDetail(student.userId)}
          className="flex min-w-0 items-center gap-4 text-left"
        >
          <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#EAF2FF]">
            <img
              src="/images/users.svg"
              alt=""
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[16px] font-semibold text-[#111827]">
              {student.userName}
            </span>
            <span className="mt-1 block truncate text-[14px] text-[#98A2B3]">
              {student.email}
            </span>
          </span>
        </button>
      </td>

      <td className="px-6 py-5 text-[20px] font-bold text-[#111827]">
        {student.totalPoint.toLocaleString()}원
      </td>

      <td className="px-6 py-5">
        <button
          type="button"
          onClick={() => onDetail(student.userId)}
          className="text-[15px] font-medium text-[#439A97] hover:underline"
        >
          상세 내역 확인
        </button>
      </td>

      <td className="px-6 py-5">
        <menu className="flex items-center justify-center gap-3">
          <li>
            <button
              type="button"
              onClick={() => onGive(student)}
              className="h-[36px] rounded-full bg-[#ECFDF3] px-4 text-[13px] font-semibold text-[#16A34A]"
            >
              지급
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => onRecall(student)}
              className="h-[36px] rounded-full bg-[#FEF2F2] px-4 text-[13px] font-semibold text-[#DC2626]"
            >
              회수
            </button>
          </li>
        </menu>
      </td>
    </tr>
  );
}
