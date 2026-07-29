import {
  createAdminQuiz,
  deleteAdminQuiz,
  getAdminQuizDetail,
  getAdminQuizzes,
} from "@/features/services/adminQuiz.service";
import { adminApi } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  adminApi: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("adminQuiz.service 단위 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAdminQuizzes는 백엔드 응답을 프론트 퀴즈 형식으로 변환한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 7,
          question: "오사카 대표 공항은?",
          option1: "간사이 공항",
          option2: "김포 공항",
          option3: "인천 공항",
          option4: "제주 공항",
          answer: 1,
          explanation: "간사이 공항이 대표적입니다.",
        },
      ],
    });

    await expect(getAdminQuizzes(100)).resolves.toEqual([
      {
        quizId: 7,
        courseId: 100,
        lectureTitle: undefined,
        question: "오사카 대표 공항은?",
        option1: "간사이 공항",
        option2: "김포 공항",
        option3: "인천 공항",
        option4: "제주 공항",
        correctOption: 1,
        explanation: "간사이 공항이 대표적입니다.",
      },
    ]);
  });

  test("createAdminQuiz는 기존 퀴즈가 5개이면 등록을 막는다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: Array.from({ length: 5 }, (_, index) => ({
        quizId: index + 1,
        question: `문제 ${index + 1}`,
      })),
    });

    await expect(
      createAdminQuiz({
        courseId: 100,
        question: "추가 문제",
        option1: "A",
        option2: "B",
        option3: "C",
        option4: "D",
        correctOption: 1,
      })
    ).rejects.toThrow("강의별 퀴즈는 최대 5개까지 등록할 수 있습니다.");

    expect(adminApi.post).not.toHaveBeenCalled();
  });

  test("createAdminQuiz는 기존 퀴즈가 5개 미만이면 등록 API를 호출한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    (adminApi.post as jest.Mock).mockResolvedValueOnce({
      data: {
        quizId: 1,
        question: "오사카 대표 공항은?",
        option1: "간사이 공항",
        option2: "김포 공항",
        option3: "인천 공항",
        option4: "제주 공항",
        correctOption: 1,
        explanation: "",
      },
    });

    await createAdminQuiz({
      courseId: 100,
      question: "오사카 대표 공항은?",
      option1: "간사이 공항",
      option2: "김포 공항",
      option3: "인천 공항",
      option4: "제주 공항",
      correctOption: 1,
    });

    expect(adminApi.post).toHaveBeenCalledWith(
      "/api/v1/admin/courses/100/quizzes",
      {
        question: "오사카 대표 공항은?",
        option1: "간사이 공항",
        option2: "김포 공항",
        option3: "인천 공항",
        option4: "제주 공항",
        correctOption: 1,
        explanation: "",
      }
    );
  });

  test("deleteAdminQuiz는 사전 목록 조회 없이 삭제 API를 호출한다", async () => {
    await deleteAdminQuiz(100, 1);

    expect(adminApi.get).not.toHaveBeenCalled();
    expect(adminApi.delete).toHaveBeenCalledWith(
      "/api/v1/admin/courses/100/quizzes/1"
    );
  });

  test("getAdminQuizDetail은 퀴즈 목록에서 quizId가 일치하는 항목을 반환한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { quizId: 1, question: "퀴즈 1" },
        { quizId: 2, question: "퀴즈 2" },
      ],
    });

    await expect(getAdminQuizDetail(100, 2)).resolves.toEqual(
      expect.objectContaining({
        quizId: 2,
        courseId: 100,
        question: "퀴즈 2",
      })
    );
  });
});
