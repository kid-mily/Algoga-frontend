import type { CommunityCategoryTabsProps } from "../../types";

export default function CommunityCategoryTabs({
  selectedCategories,
  categories,
  onCategoryChange,
  disabled = false,
}: CommunityCategoryTabsProps) {
  return (
    <nav aria-label="커뮤니티 카테고리">
      <ul className="flex flex-wrap items-center gap-2">
        {categories.map((category) => {
          const isActive = selectedCategories.includes(category.id);

          return (
            <li key={category.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onCategoryChange(category.id)}
                className={`h-[38px] rounded-[8px] border px-5 text-[14px] font-bold transition ${
                  disabled
                    ? "cursor-not-allowed border-[#DDE8EF] bg-[#F3F4F6] text-[#B7BEC9]"
                    : isActive
                      ? "cursor-pointer border-[#6BA19D] bg-[#6BA19D] text-white shadow-[0_8px_18px_rgba(107,161,157,0.18)]"
                      : "cursor-pointer border-[#DDE8EF] bg-white text-[#7A6F66] hover:border-[#6BA19D]/60 hover:bg-[#EEF4F4] hover:text-[#5F928E]"
                }`}
              >
                {category.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
