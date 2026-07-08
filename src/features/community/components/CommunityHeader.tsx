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
    <section className="w-full bg-[#F8F5EF] py-6">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div>
          <h1 className="text-[28px] font-extrabold leading-none text-[#2F2A26]">
            커뮤니티
          </h1>

          <p className="mt-3 text-[14px] font-medium text-[#7A6F66]">
            여행 경험을 나눠보세요
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
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
