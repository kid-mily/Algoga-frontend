export type CommunityCardProps = {
  postId: number;
  authorName: string;
  authorInitial: string;
  country: string;
  category: string;
  createdAt: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  imageAlt: string;
  imageIndex?: number;
  imageTotal?: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
};

export type CommunityCategoryOption = {
  id: string;
  label: string;
};

export type CommunityWriteButtonProps = {
  onClick?: () => void;
};

export type CommunityStatProps = {
  icon: string;
  label: string;
  count: number;
};

export type CommunityCategoryTabsProps = {
  selectedCategories: string[];
  categories: CommunityCategoryOption[];
  onCategoryChange: (category: string) => void;
};
