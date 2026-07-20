import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizForm from "@/features/contentmanage/quiz/components/QuizForm";
import QuizList from "@/features/contentmanage/quiz/components/QuizList";
import { getLectureListAction } from "@/features/contentmanage/lecture/actions";
import {
  createQuizAction,
  deleteQuizAction,
} from "@/features/contentmanage/quiz/actions";

jest.mock("@/features/contentmanage/lecture/actions", () => ({
  getLectureListAction: jest.fn(),
}));

jest.mock("@/features/contentmanage/quiz/actions", () => ({
  createQuizAction: jest.fn(),
  updateQuizAction: jest.fn(),
  deleteQuizAction: jest.fn(),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const courses = [
  {
    courseId: 100,
    countryId: 12,
    title: "오사카 여행 준비",
    description: "오사카 여행 강의",
    price: 120000,
  },
];

describe("QuizForm 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getLectureListAction as jest.Mock).mockResolvedValue(courses);
    (createQuizAction as jest.Mock).mockResolvedValue({ quizId: 1 });
    (deleteQuizAction as jest.Mock).mockResolvedValue(undefined);
  });

  test("퀴즈 등록 폼이 정상적으로 렌더링되고 기본 강의가 선택된다", async () => {
    render(<QuizForm mode="create" defaultCourseId={100} />);

    expect(screen.getByLabelText(/강의 선택/)).toBeVisible();
    expect(screen.getByLabelText(/문제/)).toBeVisible();
    expect(screen.getByRole("button", { name: "등록하기" })).toBeVisible();

    await waitFor(() => {
      expect(getLectureListAction).toHaveBeenCalledTimes(1);
    });
    expect(await screen.findByRole("option", { name: "오사카 여행 준비" })).toBeInTheDocument();

    expect(screen.getByLabelText(/강의 선택/)).toHaveValue("100");
  });

  test("퀴즈 정보를 입력하면 퀴즈 등록 API를 호출한다", async () => {
    const user = userEvent.setup();

    render(<QuizForm mode="create" defaultCourseId={100} />);

    await waitFor(() => {
      expect(getLectureListAction).toHaveBeenCalledTimes(1);
    });

    await user.type(
      screen.getByLabelText(/문제/),
      "간사이 공항에서 오사카 시내로 이동할 때 사용할 수 있는 교통수단은?"
    );
    await user.type(screen.getByLabelText("1번 보기"), "라피트");
    await user.type(screen.getByLabelText("2번 보기"), "KTX");
    await user.type(screen.getByLabelText("3번 보기"), "SRT");
    await user.type(screen.getByLabelText("4번 보기"), "무궁화호");
    await user.click(screen.getByRole("button", { name: "1번 보기를 정답으로 선택" }));
    await user.type(
      screen.getByLabelText("해설"),
      "라피트는 간사이 공항과 난바를 연결합니다."
    );

    await user.click(screen.getByRole("button", { name: "등록하기" }));

    await waitFor(() => {
      expect(createQuizAction).toHaveBeenCalledWith({
        courseId: 100,
        question: "간사이 공항에서 오사카 시내로 이동할 때 사용할 수 있는 교통수단은?",
        option1: "라피트",
        option2: "KTX",
        option3: "SRT",
        option4: "무궁화호",
        correctOption: 1,
        explanation: "라피트는 간사이 공항과 난바를 연결합니다.",
      });
    });

    expect(await screen.findByText("등록 완료")).toBeVisible();
  });

  test("등록 버튼이 연속으로 눌려도 퀴즈 등록 API는 한 번만 호출된다", async () => {
    const user = userEvent.setup();
    let resolveCreateQuiz: ((value: unknown) => void) | undefined;

    (createQuizAction as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveCreateQuiz = resolve;
        })
    );

    render(<QuizForm mode="create" defaultCourseId={100} />);

    await waitFor(() => {
      expect(getLectureListAction).toHaveBeenCalledTimes(1);
    });

    await user.type(screen.getByLabelText(/문제/), "오사카 대표 공항은?");
    await user.type(screen.getByLabelText("1번 보기"), "간사이 공항");
    await user.type(screen.getByLabelText("2번 보기"), "김포 공항");
    await user.type(screen.getByLabelText("3번 보기"), "인천 공항");
    await user.type(screen.getByLabelText("4번 보기"), "제주 공항");

    const submitButton = screen.getByRole("button", { name: "등록하기" });
    await user.click(submitButton);
    await user.click(submitButton);

    expect(createQuizAction).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "저장 중..." })).toBeDisabled();

    resolveCreateQuiz?.({ quizId: 1 });

    expect(await screen.findByText("등록 완료")).toBeVisible();
  });

  test("퀴즈 문제를 입력하지 않으면 퀴즈 등록 API를 호출하지 않는다", async () => {
    const user = userEvent.setup();

    render(<QuizForm mode="create" defaultCourseId={100} />);

    await waitFor(() => {
      expect(getLectureListAction).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole("button", { name: "등록하기" }));

    expect(await screen.findByText("퀴즈 문제를 입력해주세요.")).toBeVisible();
    expect(createQuizAction).not.toHaveBeenCalled();
  });

  test("객관식 보기가 비어 있으면 퀴즈 등록 API를 호출하지 않는다", async () => {
    const user = userEvent.setup();

    render(<QuizForm mode="create" defaultCourseId={100} />);

    await waitFor(() => {
      expect(getLectureListAction).toHaveBeenCalledTimes(1);
    });

    await user.type(screen.getByLabelText(/문제/), "오사카 대표 공항은?");
    await user.click(screen.getByRole("button", { name: "등록하기" }));

    expect(await screen.findAllByText("보기를 입력해주세요.")).toHaveLength(4);
    expect(createQuizAction).not.toHaveBeenCalled();
  });

  test("객관식 보기가 중복되면 퀴즈 등록 API를 호출하지 않는다", async () => {
    const user = userEvent.setup();

    render(<QuizForm mode="create" defaultCourseId={100} />);

    await waitFor(() => {
      expect(getLectureListAction).toHaveBeenCalledTimes(1);
    });

    await user.type(screen.getByLabelText(/문제/), "오사카 대표 공항은?");
    await user.type(screen.getByLabelText("1번 보기"), "간사이 공항");
    await user.type(screen.getByLabelText("2번 보기"), "간사이 공항");
    await user.type(screen.getByLabelText("3번 보기"), "김포 공항");
    await user.type(screen.getByLabelText("4번 보기"), "인천 공항");

    await user.click(screen.getByRole("button", { name: "등록하기" }));

    expect(
      await screen.findAllByText("같은 보기는 중복해서 입력할 수 없습니다.")
    ).toHaveLength(2);
    expect(createQuizAction).not.toHaveBeenCalled();
  });

  test("퀴즈가 1개만 남은 경우 삭제를 막는다", async () => {
    const user = userEvent.setup();

    render(
      <QuizList
        quizzes={[
          {
            courseId: 100,
            quizId: 1,
            lectureTitle: "오사카 여행 준비",
            question: "라피트는 어떤 교통수단인가요?",
            option1: "공항철도",
            option2: "버스",
            option3: "택시",
            option4: "배",
            correctOption: 1,
            explanation: "간사이 공항과 난바를 연결합니다.",
          },
        ]}
        quizCountByCourse={{ 100: 1 }}
      />
    );

    await user.click(screen.getByRole("button", { name: "퀴즈 삭제" }));

    expect(
      await screen.findByText(/강의에는 퀴즈가 최소 1개 이상 필요합니다/)
    ).toBeVisible();

    expect(screen.getByRole("button", { name: "삭제" })).toBeDisabled();
    expect(deleteQuizAction).not.toHaveBeenCalled();
  });

  test("퀴즈 목록이 비어 있으면 빈 목록 문구가 보인다", () => {
    render(<QuizList quizzes={[]} />);

    expect(screen.getByText("등록된 퀴즈가 없습니다.")).toBeVisible();
  });

  test("퀴즈 수정 버튼을 누르면 수정 페이지로 이동한다", async () => {
    const user = userEvent.setup();

    render(
      <QuizList
        quizzes={[
          {
            courseId: 100,
            quizId: 7,
            lectureTitle: "오사카 여행 준비",
            question: "오사카 대표 공항은?",
            option1: "간사이 공항",
            option2: "김포 공항",
            option3: "인천 공항",
            option4: "제주 공항",
            correctOption: 1,
            explanation: "간사이 공항을 이용합니다.",
          },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: "퀴즈 수정" }));

    expect(pushMock).toHaveBeenCalledWith(
      "/contentadmin/quiz/7/edit?courseId=100"
    );
  });

  test("퀴즈 삭제에 성공하면 완료 모달 확인 후 onDeleted를 호출한다", async () => {
    const user = userEvent.setup();
    const onDeleted = jest.fn();

    render(
      <QuizList
        quizzes={[
          {
            courseId: 100,
            quizId: 1,
            lectureTitle: "오사카 여행 준비",
            question: "라피트는 어떤 교통수단인가요?",
            option1: "공항철도",
            option2: "버스",
            option3: "택시",
            option4: "배",
            correctOption: 1,
            explanation: "간사이 공항과 난바를 연결합니다.",
          },
          {
            courseId: 100,
            quizId: 2,
            lectureTitle: "오사카 여행 준비",
            question: "도톤보리는 어느 지역에 있나요?",
            option1: "난바",
            option2: "우메다",
            option3: "교토",
            option4: "나라",
            correctOption: 1,
            explanation: "난바 근처에 있습니다.",
          },
        ]}
        quizCountByCourse={{ 100: 2 }}
        onDeleted={onDeleted}
      />
    );

    await user.click(screen.getAllByRole("button", { name: "퀴즈 삭제" })[0]);
    await user.click(await screen.findByRole("button", { name: "삭제" }));

    await waitFor(() => {
      expect(deleteQuizAction).toHaveBeenCalledWith(100, 1);
    });

    expect(await screen.findByText("삭제 완료")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(onDeleted).toHaveBeenCalledTimes(1);
  });

  test("퀴즈 삭제 실패 시 에러 메시지를 보여준다", async () => {
    const user = userEvent.setup();

    (deleteQuizAction as jest.Mock).mockRejectedValueOnce(
      new Error("퀴즈 삭제에 실패했습니다.")
    );

    render(
      <QuizList
        quizzes={[
          {
            courseId: 100,
            quizId: 1,
            lectureTitle: "오사카 여행 준비",
            question: "라피트는 어떤 교통수단인가요?",
            option1: "공항철도",
            option2: "버스",
            option3: "택시",
            option4: "배",
            correctOption: 1,
            explanation: "간사이 공항과 난바를 연결합니다.",
          },
          {
            courseId: 100,
            quizId: 2,
            lectureTitle: "오사카 여행 준비",
            question: "도톤보리는 어느 지역에 있나요?",
            option1: "난바",
            option2: "우메다",
            option3: "교토",
            option4: "나라",
            correctOption: 1,
            explanation: "난바 근처에 있습니다.",
          },
        ]}
        quizCountByCourse={{ 100: 2 }}
      />
    );

    await user.click(screen.getAllByRole("button", { name: "퀴즈 삭제" })[0]);
    await user.click(await screen.findByRole("button", { name: "삭제" }));

    expect(await screen.findByText("퀴즈 삭제에 실패했습니다.")).toBeVisible();
  });
});
