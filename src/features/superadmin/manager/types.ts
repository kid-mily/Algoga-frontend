export type ManagerRole =
  | "CS_MANAGER"
  | "CONTENT_MANAGER"
  | "SETTLEMENT_MANAGER"
  | "STATISTICS_MANAGER"
  | "SUPER_ADMIN";

export type AdminManager = {
  managerId: number;
  displayId: string;
  loginId: string;
  name: string;
  phone: string;
  email: string;
  role: ManagerRole;
  roleLabel: string;
  createdAt: string;
  active: boolean;
};

export type ManagerFormData = {
  loginId: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  role: ManagerRole;
};

export type ManagerRequestPayload = {
  loginId: string;
  password?: string;
  name: string;
  phone: string;
  email: string;
  role: ManagerRole;
};

export type ManagerApiRecord = Partial<{
  id: number;
  managerId: number;
  loginId: string;
  login_id: string;
  username: string;
  name: string;
  phone: string;
  phoneNumber: string;
  email: string;
  role: ManagerRole;
  managerRole: ManagerRole;
  authority: ManagerRole;
  createdAt: string;
  created_at: string;
  active: boolean;
  deleted: boolean;
  isDeleted: boolean;
}>;

export const managerRoleOptions: Array<{
  value: ManagerRole;
  label: string;
}> = [
  { value: "CS_MANAGER", label: "CS 매니저" },
  { value: "CONTENT_MANAGER", label: "콘텐츠 매니저" },
  { value: "SETTLEMENT_MANAGER", label: "정산 매니저" },
  { value: "STATISTICS_MANAGER", label: "통계 매니저" },
  { value: "SUPER_ADMIN", label: "슈퍼 관리자" },
];

export const getManagerRoleLabel = (role: ManagerRole) => {
  return (
    managerRoleOptions.find((option) => option.value === role)?.label ??
    "관리자"
  );
};

export const emptyManagerForm: ManagerFormData = {
  loginId: "",
  password: "",
  name: "",
  phone: "",
  email: "",
  role: "CS_MANAGER",
};
