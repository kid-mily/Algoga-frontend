import CommunityCategoryTabs from "../components/CommunityCategory";
import CommunityWriteButton from "./CommunityWriteButton";
import { CommunityHeaderProps } from "../types";

export default function CommunityHeader({
  selectedCategories,
  categories,
  onCategoryChange,
  onWriteClick,
}: CommunityHeaderProps) {
  const categoryTags = categories.filter((category) => category.tagType !== "COUNTRY");
  const countryTags = categories.filter((category) => category.tagType === "COUNTRY");

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

        <div className="space-y-3 py-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="mt-[9px] w-[64px] shrink-0 text-sm font-extrabold text-[#5F928E]">
                카테고리
              </span>
              <CommunityCategoryTabs
                selectedCategories={selectedCategories}
                categories={categoryTags}
                onCategoryChange={onCategoryChange}
              />
            </div>
            <CommunityWriteButton onClick={onWriteClick} />
          </div>

          {countryTags.length > 0 && (
            <div className="flex items-start gap-3 pr-[118px]">
              <span className="mt-[9px] w-[64px] shrink-0 text-sm font-extrabold text-[#5F928E]">
                인기나라
              </span>
              <CommunityCategoryTabs
                selectedCategories={selectedCategories}
                categories={countryTags}
                onCategoryChange={onCategoryChange}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
