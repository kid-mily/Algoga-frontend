import type { CommunityCategoryTabsProps } from "../../types";

export default function CommunityCategoryTabs({
  selectedCategories,
  categories,
  onCategoryChange,
  disabled = false,
  variant = "category",
}: CommunityCategoryTabsProps) {
  const isCountry = variant === "country";

  return (
    <nav
      aria-label={isCountry ? "인기 국가 필터" : "커뮤니티 카테고리"}
      className={
        isCountry
          ? "min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "w-full overflow-x-auto border-b border-[#DDE5EA] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      }
    >
      <ul
        className={
          isCountry
            ? "flex min-w-max items-center gap-2"
            : "flex min-w-max items-center gap-7"
        }
      >
        {categories.map((category) => {
          const isActive = selectedCategories.includes(category.id);

          return (
            <li key={category.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onCategoryChange(category.id)}
                aria-pressed={isActive}
                className={
                  isCountry
                    ? `h-8 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold transition ${
                        disabled
                          ? "cursor-not-allowed bg-[#ECEFF1] text-[#B7BEC9]"
                          : isActive
                            ? "cursor-pointer bg-[#DDF1EF] text-[#357A78]"
                            : "cursor-pointer bg-[#E9EDF0] text-[#667085] hover:bg-[#DDE5E8] hover:text-[#344054]"
                      }`
                    : `-mb-px h-11 whitespace-nowrap border-b-2 px-0.5 text-[14px] font-semibold transition ${
                        isActive
                          ? "cursor-pointer border-[#439A97] text-[#439A97]"
                          : "cursor-pointer border-transparent text-[#667085] hover:text-[#344054]"
                      }`
                }
              >
                {isCountry ? `#${category.label}` : category.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
