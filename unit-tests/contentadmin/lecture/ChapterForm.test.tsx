import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LectureChapterForm from "@/features/contentmanage/lecture/components/LectureChapterForm";
import { createChapterAction } from "@/features/contentmanage/lecture/actions";

jest.mock("@/features/contentmanage/lecture/actions", () => ({
  createChapterAction: jest.fn(),
}));

jest.mock("next/image", () => {
  return function ImageMock({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) {
    return <img alt={alt} src={src} />;
  };
});

describe("LectureChapterForm 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createChapterAction as jest.Mock).mockResolvedValue({ chapterId: 1 });
  });

  test("챕터 등록 폼이 정상적으로 렌더링된다", () => {
    render(
      <LectureChapterForm
        courseId={100}
        onPrev={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText("챕터 상세 정보")).toBeVisible();
    expect(screen.getByPlaceholderText("챕터 제목")).toBeVisible();
    expect(screen.getByPlaceholderText("챕터 설명")).toBeVisible();
    expect(screen.getByRole("button", { name: "챕터 추가" })).toBeVisible();
    expect(screen.getByRole("button", { name: "다음 단계로" })).toBeVisible();
  });

  test("챕터 필수 값을 입력하지 않으면 챕터 등록 API를 호출하지 않는다", async () => {
    const user = userEvent.setup();

    render(
      <LectureChapterForm
        courseId={100}
        onPrev={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "다음 단계로" }));

    expect(screen.getByText("챕터 제목을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("챕터 설명을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("챕터 영상을 업로드해주세요.")).toBeVisible();
    expect(createChapterAction).not.toHaveBeenCalled();
  });

  test("강의 ID가 없으면 챕터 등록을 막는다", async () => {
    const user = userEvent.setup();

    render(
      <LectureChapterForm
        courseId={0}
        onPrev={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "다음 단계로" }));

    expect(
      screen.getByText("강의 ID를 찾을 수 없습니다. 강의 기본 정보를 먼저 등록해주세요.")
    ).toBeVisible();
    expect(createChapterAction).not.toHaveBeenCalled();
  });
});
