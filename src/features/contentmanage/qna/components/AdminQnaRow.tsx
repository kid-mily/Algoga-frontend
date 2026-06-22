import { AdminQnaItem } from "../types";

interface AdminQnaRowProps {
  qna: AdminQnaItem;
  onAnswer: (qna: AdminQnaItem) => void;
}

const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10) || "-";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export default function AdminQnaRow({ qna, onAnswer }: AdminQnaRowProps) {
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
            {qna.userId > 0 ? qna.userId : "-"}
          </span>
        </span>
      </td>
      <td className="px-5 py-5 text-[14px] text-[#667085]">
        {formatDate(qna.createdAt)}
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
      <td className="px-5 py-5 text-center">
        <button
          type="button"
          onClick={() => onAnswer(qna)}
          className="text-[13px] font-semibold text-[#439A97] transition hover:opacity-70"
        >
          답변
        </button>
      </td>
    </tr>
  );
}
