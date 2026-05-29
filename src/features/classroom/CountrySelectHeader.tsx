import SubHeader from "../contentmanage/SubHeader";
import SearchBar from "./SearchBar";

export default function CountrySelectHeader() {
    return (
        <div>
            <SubHeader
                    backHref='/classroom'
                    backText="대륙 선택으로 돌아가기"
                    title="클래스룸"
                    description="여행 전 필요한 모든 것을 배워보세요"
                  />
            
            {/* 검색 */}
            <SearchBar/>
        </div>
    );
}