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

export const mockManagers: AdminManager[] = [
  {
    managerId: 1,
    displayId: "A001",
    loginId: "cs_kim",
    name: "김관리자",
    phone: "010-1234-5678",
    email: "cs_kim@algoga.com",
    role: "CS_MANAGER",
    roleLabel: "CS 매니저",
    createdAt: "2024.01.01",
    active: true,
  },
  {
    managerId: 2,
    displayId: "A002",
    loginId: "finance_lee",
    name: "이정산",
    phone: "010-2345-6789",
    email: "finance_lee@algoga.com",
    role: "SETTLEMENT_MANAGER",
    roleLabel: "정산 매니저",
    createdAt: "2024.02.01",
    active: true,
  },
  {
    managerId: 3,
    displayId: "A003",
    loginId: "stats_park",
    name: "박통계",
    phone: "010-3456-7890",
    email: "stats_park@algoga.com",
    role: "STATISTICS_MANAGER",
    roleLabel: "통계 매니저",
    createdAt: "2024.03.01",
    active: true,
  },
  {
    managerId: 4,
    displayId: "A004",
    loginId: "content_choi",
    name: "최콘텐츠",
    phone: "010-4567-8901",
    email: "content_choi@algoga.com",
    role: "CONTENT_MANAGER",
    roleLabel: "콘텐츠 매니저",
    createdAt: "2024.04.01",
    active: true,
  },
  {
    managerId: 5,
    displayId: "A005",
    loginId: "super_admin",
    name: "슈퍼관리자",
    phone: "010-5678-9012",
    email: "super@algoga.com",
    role: "SUPER_ADMIN",
    roleLabel: "슈퍼 관리자",
    createdAt: "2023.12.01",
    active: true,
  },
];
