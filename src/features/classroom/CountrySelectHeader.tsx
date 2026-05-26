import SearchBar from "./SearchBar";

export default function CountrySelectHeader() {
    return (
        <div>
            <header className="mb-10">
                {/* 제목 */}
                <h1 className="text-4xl font-bold text-[#0A1628]">클래스룸</h1>
                <p className="mt-2 text-[#8A94A6]">여행 전 필요한 모든 것을 배워보세요</p>
            </header>
            
            {/* 검색 */}
            <SearchBar/>
            
            {/* breadcrumb */}
            <nav className="flex items-center gap-3 mt-5 mb-8">
                <span className="text-[#439A97] font-bold">전체 대륙</span>
                <span className="text-[#439A97]">{'>'}</span>
                <span className="text-[#439A97] font-bold">아시아</span>
            </nav>
        </div>
    );
}