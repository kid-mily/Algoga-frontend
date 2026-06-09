export interface AdminLoginRequest {
  loginId: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken?: string;
}
