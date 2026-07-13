import type { AdminCourse } from "@/features/contentmanage/lecture/types";
export type CouponDiscountType = "RATE" | "AMOUNT";

export interface AdminCoupon {
  couponPolicyId: number;
  courseId: number;
  managerId: number;
  couponName: string;
  discountType: CouponDiscountType;
  discountValue: number;
  validDays: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCouponPayload {
  courseId: number;
  couponName: string;
  discountType: CouponDiscountType;
  discountValue: number;
  validDays: number;
  active: boolean;
}

export type CouponWithLecture = AdminCoupon & {
  lectureName?: string;
};

export type CouponStatusFilter = "all" | "active" | "inactive";

export type CouponFormData = {
  courseId: string;
  couponName: string;
  discountType: CouponDiscountType;
  discountValue: string;
  active: string;
};

export type CouponToolbarProps = {
  searchTerm: string;
  statusFilter: CouponStatusFilter;
  onSearchTermChange: (value: string) => void;
  onStatusFilterChange: (value: CouponStatusFilter) => void;
};

export type CouponTableProps = {
  coupons: CouponWithLecture[];
  totalCount: number;
  onEdit: (coupon: CouponWithLecture) => void;
  onDelete: (coupon: CouponWithLecture) => void;
  children?: React.ReactNode;
};

export type CouponRowProps = {
  coupon: CouponWithLecture;
  onEdit: () => void;
  onDelete: () => void;
};

export type CouponPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type CouponFormProps = {
  courses: AdminCourse[];
  initialData?: CouponFormData;
  isEdit?: boolean;
  onSubmit: (data: AdminCouponPayload) => Promise<boolean> | boolean;
};

export type EditCouponClientProps = {
  couponId: number;
  courseId: number;
};