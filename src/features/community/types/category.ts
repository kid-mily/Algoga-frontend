export type CommunityCategoryCode =
  | "TRAVEL_REVIEW"
  | "TIP_INFO"
  | "QUESTION"
  | "COMPANION"
  | "LECTURE"
  | "FREE";

export type CommunityCategoryOption = {
  id: string;
  label: string;
  tagType?: "ALL" | "CATEGORY" | "COUNTRY";
};

export const COMMUNITY_CATEGORIES: Array<{
  id: CommunityCategoryCode;
  label: string;
}> = [
  { id: "TRAVEL_REVIEW", label: "여행후기" },
  { id: "TIP_INFO", label: "팁&정보" },
  { id: "QUESTION", label: "질문" },
  { id: "COMPANION", label: "동행 구해요" },
  { id: "LECTURE", label: "강의후기" },
  { id: "FREE", label: "자유" },
];

export type CommunityCategoryTabsProps = {
  selectedCategories: string[];
  categories: CommunityCategoryOption[];
  onCategoryChange: (category: string) => void;
  disabled?: boolean;
  variant?: "category" | "country";
};

export type CommunityFilter = {
  id: string;
  tagType: "CATEGORY" | "COUNTRY";
  tagName: string;
  category?: CommunityCategoryCode;
  countryId?: number;
};

export type CommunityContinent = {
  continentCode: string;
  continentName: string;
};

export type CommunityCountry = {
  countryId: number;
  countryName: string;
  countryCode?: string;
  continentCode?: string;
};
