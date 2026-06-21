import { api, ApiResponse } from "@/lib/api";

export interface UserProfileResponse {
  userId: number;
  username: string;
  name: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  phone: string;
  gender: string;
  birthDate: string;
}

type UserMeResponse =
  | ApiResponse<UserProfileResponse>
  | UserProfileResponse;

const unwrapData = <T>(
  response: ApiResponse<T> | T
): T => {
  if (
    response &&
    typeof response === "object" &&
    "data" in response
  ) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

export const getMe =
  async (): Promise<UserProfileResponse> => {
    const response = await api.get<UserMeResponse>(
      "/api/v1/users/me",
      {
        suppressGlobalError: true,
      }
    );

    return unwrapData(response);
  };