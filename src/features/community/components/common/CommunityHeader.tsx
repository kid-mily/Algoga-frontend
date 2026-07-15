import CommunityCategoryTabs from "./CommunityCategory";
import CommunityWriteButton from "./CommunityWriteButton";
import { CommunityHeaderProps } from "../../types";

export default function CommunityHeader({
  selectedCategories,
  categories,
  onCategoryChange,
  onWriteClick,
  isMyPostsOnly,
  onToggleMyPostsOnly,
}: CommunityHeaderProps) {
  const categoryTags = categories.filter(
    (category) => category.tagType !== "COUNTRY",
  );

  const countryTags = categories.filter(
    (category) => category.tagType === "COUNTRY",
  );

  return (
    <section className="w-full bg-[#F3F8FC] pb-4 pt-8">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="mb-5">
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

        <div className="relative py-2">
          {/* 왼쪽 카테고리 영역 */}
          <div className="space-y-3 pr-[170px]">
            <div className="flex items-start gap-3">
              <span className="mt-[9px] w-[64px] shrink-0 text-sm font-extrabold text-[#5F928E]">
                카테고리
              </span>

              <CommunityCategoryTabs
                selectedCategories={selectedCategories}
                categories={categoryTags}
                onCategoryChange={onCategoryChange}
              />
            </div>

            {countryTags.length > 0 && (
              <div className="flex items-start gap-3">
                <span className="mt-[9px] w-[64px] shrink-0 text-sm font-extrabold text-[#5F928E]">
                  인기나라
                </span>

                <CommunityCategoryTabs
                  selectedCategories={selectedCategories}
                  categories={countryTags}
                  onCategoryChange={onCategoryChange}
                  disabled={isMyPostsOnly}
                />
              </div>
            )}
          </div>

          {/* 오른쪽 글쓰기 영역 */}
          <div className="absolute right-0 top-2 flex flex-col items-center gap-3">
            <CommunityWriteButton onClick={onWriteClick} />

            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#5F928E]">
              <input
                type="checkbox"
                checked={isMyPostsOnly}
                onChange={onToggleMyPostsOnly}
                className="h-4 w-4 accent-[#6BA19D]"
              />
              내가 쓴 글
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}