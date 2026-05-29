export default function SearchBar() {
    return (
      <div className="mt-8 flex items-center gap-4">

        {/* 검색창 */}
        <div className="flex-1 h-12 bg-white border border-[#8A9BB0] rounded-2xl px-6 flex items-center shadow-sm">
          <input
            type="text"
            placeholder="여행지 검색..."
            className="w-full bg-transparent outline-none text-[#0A1628] placeholder:text-[#9AA6B2]"
          />
        </div>
        
        {/* 버튼 */}
        <button className="w-32 h-12 bg-[#439A97] rounded-2xl text-white font-semibold hover:bg-[#1f4644] cursor-pointer">
          검색
        </button>
      </div>
    );
}