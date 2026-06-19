import SubHeader from "@/features/contentmanage/common/SubHeader";

export default function CountrySelectHeader() {
  return (
    <header>
      <SubHeader
        backHref="/classroom"
        backText="대륙 선택으로 돌아가기"
        title="클래스룸"
        description="여행에 필요한 모든 것을 배워보세요"
      />
    </header>
  );
}