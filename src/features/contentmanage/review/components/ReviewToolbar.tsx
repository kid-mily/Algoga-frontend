import { reviewScoreFilters } from "../types";

type ReviewToolbarProps = {
  searchKeyword: string;
  selectedScore: string;
  onSearchKeywordChange: (value: string) => void;
  onSelectedScoreChange: (value: string) => void;
};

export default function ReviewToolbar({
  searchKeyword,
  selectedScore,
  onSearchKeywordChange,
  onSelectedScoreChange,
}: ReviewToolbarProps) {
  return (
    <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="후기 검색 및 필터"
        className="flex items-center gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex h-[44px] min-w-0 flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
          <img
            src="/images/search.svg"
            alt=""
            aria-hidden="true"
            className="h-[18px] w-[18px]"
          />
          <label htmlFor="review-search" className="sr-only">
            강의명 또는 학생 이름 검색
          </label>
          <input
            id="review-search"
            type="search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="강의명 또는 학생 이름 검색..."
            className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        <button
          type="button"
          className="flex h-[44px] min-w-[170px] items-center justify-between rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-semibold text-[#344054]"
        >
          <span className="flex items-center gap-2">
            <img
              src="/images/book.svg"
              alt=""
              aria-hidden="true"
              className="h-[16px] w-[16px]"
            />
            전체 강의
          </span>
          <img
            src="/images/arrow.svg"
            alt=""
            aria-hidden="true"
            className="h-[14px] w-[14px] rotate-90"
          />
        </button>

        <div
          role="group"
          aria-label="평점 필터"
          className="flex shrink-0 items-center gap-2 whitespace-nowrap"
        >
          <span className="text-[14px] font-semibold text-[#344054]">
            평점
          </span>

          {reviewScoreFilters.map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onSelectedScoreChange(score)}
              className={`h-[36px] rounded-full border px-4 text-[14px] font-semibold ${
                score === selectedScore
                  ? "border-[#639E9B] bg-[#639E9B] text-white"
                  : "border-[#E4E7EC] bg-white text-[#344054]"
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
