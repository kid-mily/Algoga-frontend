import {
  createInquiry,
  getInquiryCategories,
  markInquiryAnswerRead,
} from "@/features/services/inquiry.service";
import { api } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
  unwrapData: <T,>(response: { data?: T } | T) =>
    response && typeof response === "object" && "data" in response
      ? response.data
      : response,
}));

describe("사용자 문의 서비스 테스트", () => {
  beforeEach(() => jest.clearAllMocks());

  test("문의 카테고리를 조회한다", async () => {
    const controller = new AbortController();
    const categories = [{ code: "REFUND", description: "환불" }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: categories });

    await expect(getInquiryCategories(controller.signal)).resolves.toEqual(categories);
    expect(api.get).toHaveBeenCalledWith("/api/v1/inquiries/categories", {
      cache: "no-store",
      suppressGlobalError: true,
      signal: controller.signal,
    });
  });

  test("문의 카테고리 응답이 null이면 빈 배열을 반환한다", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: null });
    await expect(getInquiryCategories()).resolves.toEqual([]);
  });

  test("문의 등록 payload를 그대로 전송한다", async () => {
    const payload = {
      category: "REFUND" as const,
      title: "환불 문의",
      content: "환불 진행 상태가 궁금합니다.",
    };
    (api.post as jest.Mock).mockResolvedValueOnce({ data: null });

    await createInquiry(payload);
    expect(api.post).toHaveBeenCalledWith("/api/v1/inquiries", payload, {
      suppressGlobalError: true,
    });
  });

  test("문의 답변 확인 API를 호출한다", async () => {
    (api.patch as jest.Mock).mockResolvedValueOnce({ data: null });

    await markInquiryAnswerRead(15);
    expect(api.patch).toHaveBeenCalledWith(
      "/api/v1/inquiries/15/answer/read",
      undefined,
      { suppressGlobalError: true }
    );
  });
});
