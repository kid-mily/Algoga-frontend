import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { ChatbotQuestion } from "../types";

type ChatbotQuestionRowProps = {
  question: ChatbotQuestion;
  order: number;
  onDelete: (question: ChatbotQuestion) => void;
};

export default function ChatbotQuestionRow({
  question,
  order,
  onDelete,
}: ChatbotQuestionRowProps) {
  return (
    <tr className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
      <td className="w-[72px] px-6 py-5 text-[#98A2B3]">{order}</td>
      <td className="w-[36%] px-6 py-5">
        <p className="font-bold text-[#111827]">{question.question}</p>
      </td>
      <td className="px-6 py-5">
        <p className="line-clamp-2 max-w-[560px] leading-6 text-[#667085]">
          {question.answer}
        </p>
      </td>
      <td className="w-[128px] px-6 py-5">
        <div className="flex items-center gap-3 text-[#667085]">
          <Link
            href={`/csadmin/chatbot/${question.id}`}
            aria-label={`수정: 예상 질문 ${question.id}`}
            className="cursor-pointer hover:text-[#439A97]"
          >
            <Pencil size={17} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(question)}
            aria-label={`삭제: 예상 질문 ${question.id}`}
            className="cursor-pointer text-[#EF4444]"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </td>
    </tr>
  );
}
