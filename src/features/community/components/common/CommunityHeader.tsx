import CommunityCategoryTabs from "./CommunityCategory";
import CommunityWriteButton from "./CommunityWriteButton";
import { CommunityHeaderProps } from "../../types";

const CATEGORY_TAB_ORDER = [
  "ALL",
  "TRAVEL_REVIEW",
  "TIP_INFO",
  "QUESTION",
  "COMPANION",
  "FREE",
  "LECTURE",
];

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
  ).sort((first, second) => {
    const firstIndex = CATEGORY_TAB_ORDER.indexOf(first.id);
    const secondIndex = CATEGORY_TAB_ORDER.indexOf(second.id);

    return (
      (firstIndex === -1 ? CATEGORY_TAB_ORDER.length : firstIndex) -
      (secondIndex === -1 ? CATEGORY_TAB_ORDER.length : secondIndex)
    );
  });

  const countryTags = categories.filter(
    (category) => category.tagType === "COUNTRY",
  );

  return (
    <section className="w-full bg-[#F3F8FC] pb-5 pt-8">
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

        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="min-w-0 flex-1">
              <CommunityCategoryTabs
                selectedCategories={selectedCategories}
                categories={categoryTags}
                onCategoryChange={onCategoryChange}
              />
            </div>

            <CommunityWriteButton onClick={onWriteClick} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {countryTags.length > 0 && (
              <>
                <span className="shrink-0 text-[13px] font-semibold text-[#667085]">
                  인기 국가
                </span>
                <div className="min-w-0 flex-1">
                  <CommunityCategoryTabs
                    selectedCategories={selectedCategories}
                    categories={countryTags}
                    onCategoryChange={onCategoryChange}
                    disabled={isMyPostsOnly}
                    variant="country"
                  />
                </div>
              </>
            )}

            <button
              type="button"
              aria-pressed={isMyPostsOnly}
              onClick={onToggleMyPostsOnly}
              className={`h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold transition ${
                isMyPostsOnly
                  ? "bg-[#DDF1EF] text-[#357A78]"
                  : "bg-white text-[#667085] hover:bg-[#EEF2F4] hover:text-[#344054]"
              }`}
            >
              내가 쓴 글
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
