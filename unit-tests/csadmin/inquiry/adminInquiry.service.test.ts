import { adminApi, ApiRequestError } from "@/lib/api";
import {
  getAdminInquiries,
  getAdminInquiryById,
} from "@/features/services/adminInquiry.service";

jest.mock("@/lib/api", () => {
  const actual = jest.requireActual("@/lib/api");

  return {
    ...actual,
    adminApi: {
      get: jest.fn(),
      put: jest.fn(),
    },
  };
});

const adminApiMock = adminApi as jest.Mocked<typeof adminApi>;

describe("adminInquiry.service 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("문의 목록에서 작성자 닉네임을 우선 표시한다", async () => {
    adminApiMock.get.mockResolvedValueOnce({
      data: {
        content: [
          {
            inquiryId: 42,
            userId: 1001,
            userName: "김진도",
            userNickname: "jindo",
            category: "REFUND",
            title: "환불 문의드립니다",
            content: "결제 취소가 안 됩니다.",
            answer: null,
            status: "PENDING",
            createdAt: "2026-07-20T14:30:00Z",
            answeredAt: null,
          },
        ],
        page: 0,
        size: 8,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
      },
    });

    const result = await getAdminInquiries({
      category: "REFUND",
      status: "PENDING",
      page: 0,
    });

    expect(adminApiMock.get).toHaveBeenCalledWith("/api/v1/admin/inquiries", {
      params: {
        category: "REFUND",
        status: "PENDING",
        page: 0,
      },
      suppressGlobalError: true,
      signal: undefined,
    });
    expect(result.inquiries[0]).toMatchObject({
      inquiryId: 42,
      userId: 1001,
      userName: "김진도",
      userNickname: "jindo",
      writer: "jindo",
      type: "환불",
      status: "미처리",
      date: "2026.07.20 23:30",
    });
  });

  test("작성자 닉네임이 없으면 이름, 둘 다 없으면 알 수 없음으로 표시한다", async () => {
    adminApiMock.get.mockResolvedValueOnce({
      data: {
        content: [
          {
            inquiryId: 1,
            userId: 11,
            userName: "김진도",
            userNickname: null,
            category: "COURSE",
            title: "강의 문의",
            content: "강의 질문입니다.",
            answer: null,
            status: "PENDING",
            createdAt: "2026-07-20T14:30:00Z",
            answeredAt: null,
          },
          {
            inquiryId: 2,
            userId: 12,
            userName: null,
            userNickname: null,
            category: "ETC",
            title: "기타 문의",
            content: "기타 질문입니다.",
            answer: null,
            status: "ANSWERED",
            createdAt: "2026-07-20T14:30:00Z",
            answeredAt: "2026-07-20T15:30:00Z",
          },
        ],
        page: 0,
        size: 8,
        totalElements: 2,
        totalPages: 1,
        first: true,
        last: true,
      },
    });

    const result = await getAdminInquiries();

    expect(result.inquiries[0].writer).toBe("김진도");
    expect(result.inquiries[1].writer).toBe("(알 수 없음)");
    expect(result.inquiries[1].status).toBe("답변 완료");
  });

  test("문의 단건 상세 조회 API를 호출하고 응답을 정규화한다", async () => {
    adminApiMock.get.mockResolvedValueOnce({
      data: {
        inquiryId: 42,
        userId: 1001,
        userName: "김진도",
        userNickname: "jindo",
        category: "REFUND",
        title: "환불 문의드립니다",
        content: "결제 취소가 안 됩니다.",
        answer: "확인했습니다.",
        status: "ANSWERED",
        createdAt: "2026-07-20T14:30:00Z",
        answeredAt: "2026-07-20T15:30:00Z",
      },
    });

    const result = await getAdminInquiryById(42);

    expect(adminApiMock.get).toHaveBeenCalledWith(
      "/api/v1/admin/inquiries/42",
      {
        suppressGlobalError: true,
        signal: undefined,
      }
    );
    expect(result).toMatchObject({
      inquiryId: 42,
      writer: "jindo",
      answer: "확인했습니다.",
      status: "답변 완료",
      answeredAt: "2026.07.21 00:30",
    });
  });

  test("문의 단건 조회에서 404가 오면 null을 반환한다", async () => {
    adminApiMock.get.mockRejectedValueOnce(
      new ApiRequestError({
        message: "해당 ID의 문의 없음",
        status: 404,
        code: "INQ_001",
      })
    );

    await expect(getAdminInquiryById(404)).resolves.toBeNull();
  });
});
