import { SignupRequest } from "@/features/auth/types";
import { api } from "@/lib/api";

export const signup = async (data: SignupRequest) => {
  return api.post("/api/v1/auth/signup", data);
};