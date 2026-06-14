import { NoticeTag, noticeFilterOptions } from "../types";

type NoticeToolbarProps = {
  searchKeyword: string;
  selectedTag: NoticeTag;
  onSearchKeywordChange: (value: string) => void;
  onSelectedTagChange: (value: NoticeTag) => void;
};

export default function NoticeToolbar({
  searchKeyword,
  selectedTag,
  onSearchKeywordChange,
  onSelectedTagChange,
}: NoticeToolbarProps) {
  return (
    <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="공지사항 검색 및 필터"
        className="flex flex-wrap items-center gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex h-[44px] min-w-[260px] flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
          <span className="text-[18px] text-[#98A2B3]" aria-hidden="true">⌕</span>
          <label htmlFor="notice-search" className="sr-only">
            공지사항 제목 또는 내용 검색
          </label>
          <input
            id="notice-search"
            type="search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="제목, 내용, 번호 검색..."
            className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        <label htmlFor="notice-tag-filter" className="sr-only">
          공지사항 태그 필터
        </label>
        <select
          id="notice-tag-filter"
          value={selectedTag}
          onChange={(event) => onSelectedTagChange(event.target.value as NoticeTag)}
          className="h-[44px] w-[150px] rounded-[10px] border border-[#E4E7EC] bg-white px-4 text-[14px] font-semibold text-[#344054] outline-none"
        >
          {noticeFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </form>
    </section>
  );
}
