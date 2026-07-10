import type { CommunityCategoryTabsProps } from "./category";

export type CommunityActionModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

export type CommunityStatProps = {
  icon: string;
  label: string;
  count: number;
};

export type CommunityWriteButtonProps = {
  onClick?: () => void;
};

export type CommunityHeaderProps = CommunityCategoryTabsProps & {
  onWriteClick?: () => void;
  isMyPostsOnly: boolean;
  onToggleMyPostsOnly: () => void;
};
