export interface AdminLoginRequest {
  loginId: string;
  password: string;
}

export type AdminRole =
  | "CONTENT_MANAGER"
  | "CS_MANAGER"
  | "SETTLEMENT_MANAGER"
  | "STATISTICS_MANAGER"
  | "SUPER_ADMIN"
  | "ROLE_CONTENT_MANAGER"
  | "ROLE_CS_MANAGER"
  | "ROLE_SETTLEMENT_MANAGER"
  | "ROLE_STATISTICS_MANAGER"
  | "ROLE_SUPER_ADMIN";

export interface AdminLoginResponse {
  managerId?: number;
  id?: number;
  loginId?: string;
  name?: string;
  role?: AdminRole;
  managerRole?: AdminRole;
  authority?: AdminRole;
  authorities?: AdminRole[] | AdminRole;
  roles?: AdminRole[] | AdminRole;
  type?: AdminRole;
  message?: string;
}
