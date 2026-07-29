import { Search } from "lucide-react";

type ChatbotToolbarProps = {
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
};

export default function ChatbotToolbar({
  searchKeyword,
  onSearchKeywordChange,
}: ChatbotToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#EEF0F3] px-6 py-4">
      <h2 className="text-[16px] font-bold text-[#111827]">
        예상 질문 목록
      </h2>

      <label
        htmlFor="chatbot-question-search"
        className="flex h-10 w-[280px] items-center rounded-[12px] border border-[#E4E7EC] bg-white px-3"
      >
        <Search size={16} className="text-[#98A2B3]" />
        <span className="sr-only">예상 질문 검색</span>
        <input
          id="chatbot-question-search"
          type="search"
          value={searchKeyword}
          onChange={(event) => onSearchKeywordChange(event.target.value)}
          placeholder="예상 질문을 검색해 주세요."
          className="ml-2 w-full bg-transparent text-[13px] text-[#344054] outline-none placeholder:text-[#98A2B3]"
        />
      </label>
    </div>
  );
}
