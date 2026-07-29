import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminQnaAnswerClient from "@/features/contentmanage/qna/components/AdminQnaAnswerClient";
import {
  createAdminCourseQnaAnswer,
  getCourseQna,
} from "@/features/services/courseQna.service";

jest.mock("@/features/services/courseQna.service", () => ({
  createAdminCourseQnaAnswer: jest.fn(),
  getCourseQna: jest.fn(),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const qnaDetail = {
  id: 3,
  userId: 99,
  title: "환전은 어떻게 하나요?",
  content: "엔화 환전 정보를 알고 싶습니다.",
  writer: "여행러버",
  createdAt: "2026-07-14",
  isAnswered: false,
  comments: [],
};

describe("AdminQnaAnswerClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getCourseQna as jest.Mock).mockResolvedValue(qnaDetail);
    (createAdminCourseQnaAnswer as jest.Mock).mockResolvedValue({});
  });

  test("Q&A 상세와 답변 작성 영역을 렌더링한다", async () => {
    render(<AdminQnaAnswerClient courseId="12" qnaId="3" />);

    expect(screen.getByText("Q&A 상세 내용을 불러오는 중입니다...")).toBeVisible();

    expect(await screen.findAllByText(/환전은 어떻게 하나요/)).toHaveLength(2);
    expect(screen.getByText("엔화 환전 정보를 알고 싶습니다.")).toBeVisible();
    expect(screen.getByText("여행러버")).toBeVisible();
    expect(screen.getByLabelText("답변 작성")).toBeVisible();
  });

  test("빈 답변이면 등록 버튼이 비활성화되고 답변 API를 호출하지 않는다", async () => {
    render(<AdminQnaAnswerClient courseId="12" qnaId="3" />);

    await screen.findAllByText(/환전은 어떻게 하나요/);

    expect(screen.getByRole("button", { name: "답변 등록" })).toBeDisabled();
    expect(createAdminCourseQnaAnswer).not.toHaveBeenCalled();
  });

  test("답변을 입력하고 등록하면 답변 API를 호출하고 완료 모달을 보여준다", async () => {
    const user = userEvent.setup();

    render(<AdminQnaAnswerClient courseId="12" qnaId="3" />);

    await screen.findAllByText(/환전은 어떻게 하나요/);
    await user.type(screen.getByLabelText("답변 작성"), "엔화는 미리 환전하고 가는 것을 추천합니다.");
    await user.click(screen.getByRole("button", { name: "답변 등록" }));

    await waitFor(() => {
      expect(createAdminCourseQnaAnswer).toHaveBeenCalledWith("12", "3", {
        answer: "엔화는 미리 환전하고 가는 것을 추천합니다.",
      });
    });

    expect(await screen.findByText("등록 완료")).toBeVisible();
  });

  test("등록된 답변이 있으면 답변 상세를 초기값처럼 표시한다", async () => {
    (getCourseQna as jest.Mock).mockResolvedValue({
      ...qnaDetail,
      isAnswered: true,
      comments: [
        {
          id: 1,
          writer: "관리자",
          content: "이미 등록된 답변입니다.",
          createdAt: "2026-07-14",
        },
      ],
    });

    render(<AdminQnaAnswerClient courseId="12" qnaId="3" mode="detail" />);

    expect(await screen.findByText("등록된 답변")).toBeVisible();
    expect(screen.getByText("관리자 · 2026-07-14")).toBeVisible();
    expect(screen.getByText("이미 등록된 답변입니다.")).toBeVisible();
  });
});
