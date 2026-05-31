import { api } from "@/lib/api";
import { CreateLecturePaymentPayload } from "../payment/types";

export const createLecturePayment = async (
  payload: CreateLecturePaymentPayload
) => {
  const response = await api.post("/api/v1/payments/lecture", payload);
  return response.data?.data ?? response.data;
};

export const getMyPayments = async () => {
  const response = await api.get("/api/v1/payments/me", {
    params: { t: Date.now() },
  });
  return response.data?.data ?? [];
};
