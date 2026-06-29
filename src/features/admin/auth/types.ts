export interface AdminLoginRequest {
  loginId: string;
  password: string;
}

export type AdminRole =
  | "CONTENT_MANAGER"
  | "CS_MANAGER"
  | "SETTLEMENT_MANAGER"
  | "STATISTICS_MANAGER"
  | "SUPER_ADMIN";

export interface AdminLoginResponse {
  managerId?: number;
  id?: number;
  loginId?: string;
  name?: string;
  email?: string;
  role?: AdminRole;
  managerRole?: AdminRole;
  authority?: AdminRole;
  authorities?: AdminRole[] | AdminRole;
  roles?: AdminRole[] | AdminRole;
  type?: AdminRole;
  message?: string;
}

export type AdminDisplayInfoInput = {
  loginId?: string;
  name?: string;
  email?: string;
};

export type AdminDisplayInfo = {
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  initial: string;
};

export type AdminTokenPayload = {
  sub?: string;
  name?: string;
  email?: string;
  loginId?: string;
  username?: string;
  role?: string;
  type?: string;
  authority?: string;
  authorities?: string[] | string;
  id?: number;
  exp?: number;
};