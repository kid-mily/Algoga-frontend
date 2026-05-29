import SearchBar from "./SearchBar";

export default function ContinentHeader() {
    return (
        <div className="w-full max-w-5xl mx-auto pt-32 pb-20 px-4">
        {/* 상단 */}
        <div className="flex flex-col items-center gap-5 mt-16">
          <img src="/images/Earth.svg" alt="지구" />
          <p className="text-4xl font-bold text-[#0A1628]">어디로 떠나시나요?</p>
          <p className="text-lg text-[#8A9BB0]">대륙을 선택하여 여행을 시작하세요</p>
        </div>
        <SearchBar/>
      </div>
    );
}