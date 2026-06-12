import { AdminQnaItem } from "../types";

interface AdminQnaRowProps {
  qna: AdminQnaItem;
  onView: (qna: AdminQnaItem) => void;
  onAnswer: (qna: AdminQnaItem) => void;
}

export default function AdminQnaRow({ qna, onView, onAnswer }: AdminQnaRowProps) {
  return (
    <tr className="border-b border-[#E4E7EC]">
      <td className="px-5 py-5 text-[15px] font-semibold text-[#111827]">
        {qna.lecture}
      </td>
      <td className="px-5 py-5 text-[15px] font-medium text-[#344054]">
        <p className="truncate font-semibold">{qna.title}</p>
        <p className="mt-1 line-clamp-1 text-[13px] text-[#667085]">
          {qna.content}
        </p>
      </td>
      <td className="px-5 py-5">
        <span className="flex items-center gap-2">
          <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#EAF2FF]">
            <img
              src="/images/people.svg"
              alt=""
              aria-hidden="true"
              className="h-[14px] w-[14px]"
            />
          </span>
          <span className="text-[14px] font-medium text-[#667085]">
            {qna.writer}
          </span>
        </span>
      </td>
      <td className="px-5 py-5 text-[14px] text-[#667085]">
        {qna.createdAt || "-"}
      </td>
      <td className="px-5 py-5">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold ${
            qna.isAnswered
              ? "bg-[#EAF7EE] text-[#43A047]"
              : "bg-[#FFF4ED] text-[#F17B2C]"
          }`}
        >
          <span
            className={`h-[6px] w-[6px] rounded-full ${
              qna.isAnswered ? "bg-[#43A047]" : "bg-[#F17B2C]"
            }`}
          />
          {qna.isAnswered ? "답변 완료" : "답변 대기"}
        </span>
      </td>
      <td className="px-5 py-5">
        <menu className="flex items-center justify-center gap-4">
          <li>
            <button
              type="button"
              onClick={() => onView(qna)}
              className="text-[13px] font-semibold text-[#439A97] transition hover:opacity-70"
            >
              보기
            </button>
          </li>
          {!qna.isAnswered && (
            <li>
              <button
                type="button"
                onClick={() => onAnswer(qna)}
                className="text-[13px] font-semibold text-[#439A97] transition hover:opacity-70"
              >
                답변
              </button>
            </li>
          )}
        </menu>
      </td>
    </tr>
  );
}
