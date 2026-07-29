import { ChatbotQuestion } from "../types";
import ChatbotQuestionRow from "./ChatbotQuestionRow";

type ChatbotQuestionTableProps = {
  questions: ChatbotQuestion[];
  isLoading: boolean;
  onDelete: (question: ChatbotQuestion) => void;
};

const CHATBOT_TABLE_COLUMN_COUNT = 4;

export default function ChatbotQuestionTable({
  questions,
  isLoading,
  onDelete,
}: ChatbotQuestionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead className="bg-[#F8FAFC]">
          <tr className="text-[12px] font-bold text-[#667085]">
            <th className="w-[72px] px-6 py-4">번호</th>
            <th className="w-[36%] px-6 py-4">예상 질문</th>
            <th className="px-6 py-4">답변 미리보기</th>
            <th className="w-[128px] px-6 py-4">관리</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <EmptyRow text="예상 질문을 불러오는 중입니다..." />
          ) : questions.length === 0 ? (
            <EmptyRow text="조건에 맞는 예상 질문이 없습니다." />
          ) : (
            questions.map((question, index) => (
              <ChatbotQuestionRow
                key={question.id}
                question={question}
                order={index + 1}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <tr>
      <td
        colSpan={CHATBOT_TABLE_COLUMN_COUNT}
        role="status"
        aria-live="polite"
        className="px-6 py-14 text-center text-[14px] font-medium text-[#98A2B3]"
      >
        {text}
      </td>
    </tr>
  );
}
