import CommunityCategoryTabs from "../components/CommunityCategory";
import CommunityWriteButton from "./CommunityWriteButton";
import { CommunityCategoryOption } from "../types";

type CommunityHeaderProps = {
  selectedCategories: string[];
  categories: CommunityCategoryOption[];
  onCategoryChange: (category: string) => void;
  onWriteClick?: () => void;
};

export default function CommunityHeader({
  selectedCategories,
  categories,
  onCategoryChange,
  onWriteClick,
}: CommunityHeaderProps) {
  return (
    <section className="w-full bg-[#F3F8FC] pb-4 pt-8">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="mb-5">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-[#439A97]">
              TRAVEL COMMUNITY
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#0A1628]">
              여행 이야기 모아보기
            </h1>

            <p className="mt-1 text-sm text-[#8A94A6]">
              학습한 나라의 여행 후기와 정보를 함께 나눠보세요.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <CommunityCategoryTabs
            selectedCategories={selectedCategories}
            categories={categories}
            onCategoryChange={onCategoryChange}
          />
          <CommunityWriteButton onClick={onWriteClick} />
        </div>
      </div>
    </section>
  );
}
