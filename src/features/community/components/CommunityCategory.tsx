import { CommunityCategoryOption,  CommunityCategoryTabsProps } from "../types"

export const COMMUNITY_CATEGORIES: CommunityCategoryOption[] = [
  { id: "TRAVEL_REVIEW", label: "여행 후기" },
  { id: "TIP_INFO", label: "팁&정보" },
  { id: "QUESTION", label: "질문" },
  { id: "COMPANION", label: "동행 구해요" },
  { id: "LECTURE", label: "강의 후기" },
  { id: "FREE", label: "자유" },
];

export default function CommunityCategoryTabs({
  selectedCategories,
  categories,
  onCategoryChange,
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
                onClick={() => onCategoryChange(category.id)}
                className={`h-[38px] rounded-[8px] border px-5 text-[14px] font-bold transition ${
                  isActive
                    ? "border-[#6BA19D] bg-[#6BA19D] text-white shadow-[0_8px_18px_rgba(107,161,157,0.18)]"
                    : "border-[#E7D7C3] bg-[#FFFDF8] text-[#7A6F66] hover:border-[#D97A3A]/60 hover:bg-[#FFF4E8] hover:text-[#D97A3A]"
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
