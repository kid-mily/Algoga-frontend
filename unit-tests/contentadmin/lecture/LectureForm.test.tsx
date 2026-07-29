import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LectureForm from "@/features/contentmanage/lecture/components/LectureForm";
import LectureUpdateForm from "@/features/contentmanage/lecture/components/LectureUpdateForm";
import {
  createLectureAction,
  getLectureCountriesAction,
} from "@/features/contentmanage/lecture/actions";

jest.mock("@/features/contentmanage/lecture/actions", () => ({
  createLectureAction: jest.fn(),
  getLectureCountriesAction: jest.fn(),
}));

const pushMock = jest.fn();
const backMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    back: backMock,
    refresh: refreshMock,
  }),
}));

const countries = [
  {
    countryId: 12,
    countryName: "일본",
    continentName: "아시아",
  },
];

const createImageFile = () =>
  new File(["thumbnail"], "thumbnail.png", { type: "image/png" });

describe("LectureForm 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: jest.fn(() => "blob:lecture-thumbnail"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: jest.fn(),
    });

    (getLectureCountriesAction as jest.Mock).mockResolvedValue(countries);
    (createLectureAction as jest.Mock).mockResolvedValue({ courseId: 100 });
  });

  test("강의 등록 폼이 정상적으로 렌더링되고 국가 목록을 불러온다", async () => {
    render(<LectureForm />);

    expect(screen.getByText("강의 기본 정보")).toBeVisible();
    expect(screen.getByLabelText("국가 선택 *")).toBeVisible();
    expect(screen.getByLabelText("강의 제목 *")).toBeVisible();
    expect(screen.getByRole("button", { name: "다음 단계로" })).toBeVisible();

    await waitFor(() => {
      expect(getLectureCountriesAction).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByRole("option", { name: "일본 (아시아)" })).toBeInTheDocument();
  });

  test("필수 값을 입력하지 않고 제출하면 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(<LectureForm />);

    await waitFor(() => {
      expect(getLectureCountriesAction).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole("button", { name: "다음 단계로" }));

    expect(screen.getByText("국가를 선택해주세요.")).toBeVisible();
    expect(screen.getByText("강의 제목을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("강의 설명을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("올바른 가격을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("썸네일 이미지를 등록해주세요.")).toBeVisible();
    expect(createLectureAction).not.toHaveBeenCalled();
  });

  test("강의 등록 정보를 입력하면 강의 등록 API를 호출하고 다음 단계로 이동한다", async () => {
    const user = userEvent.setup();
    const onNext = jest.fn();

    render(<LectureForm onNext={onNext} />);

    await waitFor(() => {
      expect(getLectureCountriesAction).toHaveBeenCalledTimes(1);
    });
    await screen.findByRole("option", { name: "일본 (아시아)" });

    await user.selectOptions(screen.getByLabelText("국가 선택 *"), "12");
    await user.selectOptions(screen.getByLabelText("상태 *"), "true");
    await user.type(screen.getByLabelText("강의 제목 *"), "오사카 여행 준비");
    await user.type(
      screen.getByLabelText("강의 설명 *"),
      "오사카 여행 전 반드시 알아야 하는 정보를 학습합니다."
    );
    await user.type(screen.getByLabelText("가격 *"), "120000");
    await user.type(screen.getByLabelText("최대 지급 마일리지"), "1000");
    await user.selectOptions(screen.getByLabelText("난이도 *"), "INTERMEDIATE");
    await user.upload(screen.getByLabelText("썸네일 이미지 *"), createImageFile());

    await user.click(screen.getByRole("button", { name: "다음 단계로" }));

    await waitFor(() => {
      expect(createLectureAction).toHaveBeenCalledWith(
        expect.objectContaining({
          countryId: 12,
          title: "오사카 여행 준비",
          description: "오사카 여행 전 반드시 알아야 하는 정보를 학습합니다.",
          price: 120000,
          mileage: 1000,
          maxRewardMileage: 1000,
          level: "INTERMEDIATE",
          status: "DRAFT",
          thumbnail: expect.any(File),
        })
      );
    });

    expect(onNext).toHaveBeenCalledWith(100, true);
  });

  test("강의 수정 폼은 기존 강의 정보를 초기값으로 표시한다", () => {
    render(
      <LectureUpdateForm
        initialData={{
          country: "일본",
          title: "오사카 여행 준비 마스터 개정판",
          description: "오사카 여행 전 반드시 알아야 하는 정보",
          price: "120000",
          mileage: "1000",
          level: "INTERMEDIATE",
          isPublic: "true",
          thumbnailUrl: "/images/thumb.png",
        }}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText("일본")).toBeVisible();
    expect(screen.getByDisplayValue("오사카 여행 준비 마스터 개정판")).toBeVisible();
    expect(screen.getByDisplayValue("오사카 여행 전 반드시 알아야 하는 정보")).toBeVisible();
    expect(screen.getByDisplayValue("120000")).toBeVisible();
    expect(screen.getByDisplayValue("1000")).toBeVisible();
    expect(screen.getByLabelText("난이도 *")).toHaveValue("INTERMEDIATE");
    expect(screen.getByLabelText("상태 *")).toHaveValue("true");
  });

  test("강의 수정 폼 제출 시 수정 payload를 전달하고 완료 모달을 보여준다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(true);

    render(
      <LectureUpdateForm
        initialData={{
          country: "일본",
          title: "기존 강의",
          description: "기존 설명",
          price: "50000",
          mileage: "500",
          level: "BEGINNER",
          isPublic: "false",
          thumbnailUrl: "/images/thumb.png",
        }}
        onSubmit={onSubmit}
      />
    );

    await user.clear(screen.getByLabelText("강의 제목 *"));
    await user.type(screen.getByLabelText("강의 제목 *"), "수정된 강의");
    await user.selectOptions(screen.getByLabelText("상태 *"), "true");

    await user.click(screen.getByRole("button", { name: "수정하기" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "수정된 강의",
          description: "기존 설명",
          price: "50000",
          mileage: "500",
          level: "BEGINNER",
          isPublic: "true",
          status: "PUBLISHED",
        }),
        undefined,
        []
      );
    });

    expect(await screen.findByText("수정 완료")).toBeVisible();
  });

  test("강의 수정 폼에서 필수 값을 비우면 에러 문구가 보이고 제출하지 않는다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <LectureUpdateForm
        initialData={{
          country: "일본",
          title: "기존 강의",
          description: "기존 설명",
          price: "50000",
          mileage: "500",
          level: "BEGINNER",
          isPublic: "false",
          thumbnailUrl: "/images/thumb.png",
        }}
        onSubmit={onSubmit}
      />
    );

    await user.clear(screen.getByLabelText("강의 제목 *"));
    await user.clear(screen.getByLabelText("강의 설명 *"));
    await user.clear(screen.getByLabelText("가격 *"));

    await user.click(screen.getByRole("button", { name: "수정하기" }));

    expect(screen.getByText("강의 제목을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("강의 설명을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("올바른 가격을 입력해주세요.")).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("강의 수정 폼에서 새 첨부자료를 추가하고 삭제할 수 있다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(true);
    const attachment = new File(["lecture"], "lecture-note.pdf", {
      type: "application/pdf",
    });

    render(
      <LectureUpdateForm
        initialData={{
          country: "일본",
          title: "기존 강의",
          description: "기존 설명",
          price: "50000",
          mileage: "500",
          level: "BEGINNER",
          isPublic: "false",
          thumbnailUrl: "/images/thumb.png",
          files: [
            {
              fileUrl: "/files/original.pdf",
              fileOrder: 1,
              originalFileName: "기존자료.pdf",
            },
          ],
        }}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText("기존자료.pdf")).toBeVisible();

    await user.upload(screen.getByLabelText("첨부 자료"), attachment);

    expect(screen.getByText("lecture-note.pdf")).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "lecture-note.pdf 첨부 취소" })
    );

    expect(screen.queryByText("lecture-note.pdf")).not.toBeInTheDocument();
  });

  test("강의 수정 폼 제출 실패 시 완료 모달을 보여주지 않는다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(false);

    render(
      <LectureUpdateForm
        initialData={{
          country: "일본",
          title: "기존 강의",
          description: "기존 설명",
          price: "50000",
          mileage: "500",
          level: "BEGINNER",
          isPublic: "false",
          thumbnailUrl: "/images/thumb.png",
        }}
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole("button", { name: "수정하기" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    expect(screen.queryByText("수정 완료")).not.toBeInTheDocument();
  });
});
