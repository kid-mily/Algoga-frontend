import { AdminCourse } from "@/features/contentmanage/lecture/types";

export interface AdminCoupon {
  couponPolicyId: number;
  courseId: number;
  managerId?: number;
  couponName: string;
  discountType: "RATE" | "AMOUNT" | string;
  discountValue: number;
  validDays: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AdminCouponRecord = AdminCoupon & {
  id?: number;
  couponId?: number;
  coupon_id?: number;
  couponPolicyId?: number;
  coupon_policy_id?: number;
  policyId?: number;
  policy_id?: number;
  benefitId?: number;
  benefit_id?: number;
  course_id?: number;
  course?: {
    courseId?: number;
    id?: number;
  };
  name?: string;
  coupon_name?: string;
  discount_type?: string;
  discount_value?: number;
  valid_days?: number;
  isActive?: boolean;
  is_active?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export interface AdminCouponPayload {
  courseId: number;
  couponName: string;
  discountType: string;
  discountValue: number;
  validDays: number;
  active: boolean;
}

export type CouponWithLecture = AdminCouponRecord & {
  lectureName?: string;
};

export type CouponStatusFilter = "all" | "active" | "inactive";

export type CouponFormData = {
  courseId: string;
  couponName: string;
  discountType: string;
  discountValue: string;
  validDays: string;
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

export type CreateCouponClientProps = {
  courses?: AdminCourse[];
};

export type EditCouponClientProps = {
  couponId: number;
  courseId: number;
};
