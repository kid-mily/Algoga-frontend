import SubHeader from "@/features/common/components/SubHeader";
import TabNavigation from "./TabNavigation";

interface Props {
    continentCode: string;
    countryName: string;
}

export default function LecturePageHeader({ continentCode, countryName }: Props) {
    return (
        <div>
        <SubHeader
            backHref={`/classroom/${continentCode}`}
            backText="나라 선택으로 돌아가기"
            title={`${countryName} 강의실`}
            description={`${countryName} 여행 전 필요한 표현과 상황별 학습 콘텐츠를 확인해 보세요.`}
        />

        <TabNavigation />
        </div>
    );
}