import SubHeader from "@/features/contentmanage/SubHeader";
import TabNavigation from "./TabNavigation";

interface Props {
    continentCode: string;
}

export default function LecturePageHeader({continentCode}: Props) {
    
    return (
        <div className="">
            <SubHeader
                backHref={`/classroom/${continentCode}`}
                backText="나라 선택으로 돌아가기"
                title="강의 목록"
                description="원하는 학습 방식을 선택하세요"
            />
        
            <TabNavigation />
        </div>
    );
}