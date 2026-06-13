export default function ReviewPagination() {
  return (
    <nav
      aria-label="후기 페이지 이동"
      className="mt-0 flex items-center justify-between rounded-b-[16px] border-x border-b border-[#E4E7EC] bg-white px-6 py-4"
    >
      <span className="text-[14px] text-[#667085]">1/1 페이지</span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled
          className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] text-[#C0C7D2]"
        >
          이전
        </button>

        <button
          type="button"
          aria-current="page"
          className="h-[36px] w-[36px] rounded-full bg-[#639E9B] text-[14px] font-semibold text-white"
        >
          1
        </button>

        <button
          type="button"
          disabled
          className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] text-[#C0C7D2]"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
