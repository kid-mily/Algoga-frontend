import { api, ApiRequestError, ApiResponse } from "@/lib/api";
import { markUserSessionActive } from "@/features/auth/services/userSession";

export interface UserProfileResponse {
  userId: number;
  id?: number;
  memberId?: number;
  username: string;
  name: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  phone: string;
  gender: string;
  birthDate: string;
}

type UserMeResponse = ApiResponse<UserProfileResponse> | UserProfileResponse;

const unwrapData = <T>(response: ApiResponse<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

const normalizeUserProfile = (profile: UserProfileResponse | null): UserProfileResponse | null => {
  if (!profile) return null;

  const normalizedUserId = Number(profile.userId ?? profile.id ?? profile.memberId);

  return {
    ...profile,
    userId: Number.isFinite(normalizedUserId) ? normalizedUserId : 0,
  };
};

export const getMe = async (
  signal?: AbortSignal
): Promise<UserProfileResponse | null> => {
  try {
    const response = await api.get<UserMeResponse>("/api/v1/users/me", {
      signal,
      suppressGlobalError: true,
    });

    const profile = normalizeUserProfile(unwrapData(response));

    if (profile) {
      markUserSessionActive();
    }

    return profile;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      return null;
    }

    throw error;
  }
};
