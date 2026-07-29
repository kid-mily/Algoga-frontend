import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChapterItem from "@/features/contentmanage/lecture/components/ChapterItem";
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
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  };
});

const createVideoFile = () =>
  new File(["chapter-video"], "chapter.mp4", { type: "video/mp4" });

const createTextFile = () =>
  new File(["not-video"], "memo.txt", { type: "text/plain" });

const mockVideoMetadataLoad = (duration = 125) => {
  const originalCreateElement = document.createElement.bind(document);

  return jest
    .spyOn(document, "createElement")
    .mockImplementation((tagName, options) => {
      const element = originalCreateElement(tagName, options);

      if (tagName.toLowerCase() !== "video") {
        return element;
      }

      Object.defineProperty(element, "duration", {
        configurable: true,
        value: duration,
      });

      Object.defineProperty(element, "src", {
        configurable: true,
        set() {
          queueMicrotask(() => {
            const video = element as HTMLVideoElement;
            video.onloadedmetadata?.(new Event("loadedmetadata"));
          });
        },
      });

      return element;
    });
};

const setupObjectUrlMock = () => {
  Object.defineProperty(URL, "createObjectURL", {
    writable: true,
    value: jest.fn(() => "blob:chapter-video"),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    writable: true,
    value: jest.fn(),
  });
};

describe("ChapterItem 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("챕터 정보와 에러 메시지를 렌더링한다", () => {
    render(
      <ChapterItem
        id={1}
        title="입국 준비"
        description="입국 전 준비사항"
        video={null}
        preview=""
        errors={{
          title: "챕터 제목을 입력해주세요.",
          description: "챕터 설명을 입력해주세요.",
          video: "챕터 영상을 업로드해주세요.",
        }}
        onRemove={jest.fn()}
        onTitleChange={jest.fn()}
        onDescriptionChange={jest.fn()}
        onVideoUpload={jest.fn()}
        onVideoRemove={jest.fn()}
      />
    );

    expect(screen.getByText("챕터 1")).toBeVisible();
    expect(screen.getByDisplayValue("입국 준비")).toBeVisible();
    expect(screen.getByDisplayValue("입국 전 준비사항")).toBeVisible();
    expect(screen.getByText("챕터 제목을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("챕터 설명을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("챕터 영상을 업로드해주세요.")).toBeVisible();
  });

  test("제목, 설명, 영상 업로드, 챕터 삭제 콜백을 호출한다", async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    const onTitleChange = jest.fn();
    const onDescriptionChange = jest.fn();
    const onVideoUpload = jest.fn();

    render(
      <ChapterItem
        id={2}
        title=""
        description=""
        video={null}
        preview=""
        onRemove={onRemove}
        onTitleChange={onTitleChange}
        onDescriptionChange={onDescriptionChange}
        onVideoUpload={onVideoUpload}
        onVideoRemove={jest.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("챕터 제목"), {
      target: { value: "도쿄 교통" },
    });
    fireEvent.change(screen.getByLabelText("챕터 설명"), {
      target: { value: "교통패스 설명" },
    });
    await user.upload(
      document.querySelector("#chapter-2-video") as HTMLInputElement,
      createVideoFile()
    );
    await user.click(screen.getByRole("button", { name: "2번 챕터 삭제" }));

    expect(onTitleChange).toHaveBeenLastCalledWith("도쿄 교통");
    expect(onDescriptionChange).toHaveBeenLastCalledWith("교통패스 설명");
    expect(onVideoUpload).toHaveBeenCalledWith(expect.any(File));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("영상 삭제 모달에서 취소와 삭제 흐름을 처리한다", async () => {
    const user = userEvent.setup();
    const onVideoRemove = jest.fn();

    render(
      <ChapterItem
        id={3}
        title="영상 챕터"
        description="영상 설명"
        video={createVideoFile()}
        preview="blob:chapter-video"
        onRemove={jest.fn()}
        onTitleChange={jest.fn()}
        onDescriptionChange={jest.fn()}
        onVideoUpload={jest.fn()}
        onVideoRemove={onVideoRemove}
      />
    );

    await user.click(screen.getByRole("button", { name: "3번 챕터 영상 삭제" }));
    expect(screen.getByText("선택한 영상을 삭제하시겠습니까?")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "취소" }));
    expect(onVideoRemove).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "3번 챕터 영상 삭제" }));
    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(onVideoRemove).toHaveBeenCalledTimes(1);
  });
});

describe("LectureChapterForm 컴포넌트 테스트", () => {
  let createElementSpy: jest.SpyInstance | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    setupObjectUrlMock();
    (createChapterAction as jest.Mock).mockResolvedValue({ chapterId: 1 });
  });

  afterEach(() => {
    createElementSpy?.mockRestore();
    createElementSpy = undefined;
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

  test("이전 버튼을 클릭하면 이전 단계 콜백을 호출한다", async () => {
    const user = userEvent.setup();
    const onPrev = jest.fn();

    render(
      <LectureChapterForm
        courseId={100}
        onPrev={onPrev}
        onSubmit={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "이전" }));

    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  test("챕터를 추가하고 삭제하면 챕터 번호를 다시 정렬한다", async () => {
    const user = userEvent.setup();

    render(
      <LectureChapterForm
        courseId={100}
        onPrev={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "챕터 추가" }));
    expect(screen.getByText("챕터 1")).toBeVisible();
    expect(screen.getByText("챕터 2")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "1번 챕터 삭제" }));

    expect(screen.getByText("챕터 1")).toBeVisible();
    expect(screen.queryByText("챕터 2")).not.toBeInTheDocument();
  });

  test("챕터는 최대 5개까지만 추가할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <LectureChapterForm
        courseId={100}
        onPrev={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    const addButton = screen.getByRole("button", { name: "챕터 추가" });

    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);

    expect(screen.getByText("챕터는 최대 5개까지 등록할 수 있습니다.")).toBeVisible();
    expect(screen.getAllByText(/챕터 \d/)).toHaveLength(5);
  });

  test("영상 파일이 아니면 업로드 에러를 표시한다", () => {
    render(
      <LectureChapterForm
        courseId={100}
        onPrev={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    fireEvent.change(document.querySelector("#chapter-1-video") as HTMLInputElement, {
      target: { files: [createTextFile()] },
    });

    expect(screen.getByText("영상 파일만 업로드할 수 있습니다.")).toBeVisible();
  });

  test("제목, 설명, 영상을 입력하면 챕터 등록 API를 호출하고 다음 단계로 이동한다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    createElementSpy = mockVideoMetadataLoad(125);

    render(
      <LectureChapterForm
        courseId={100}
        onPrev={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText("챕터 제목"), "도쿄 입국 준비");
    await user.type(screen.getByLabelText("챕터 설명"), "입국 서류와 교통 정보를 설명합니다.");
    await user.upload(
      document.querySelector("#chapter-1-video") as HTMLInputElement,
      createVideoFile()
    );

    expect(await screen.findByText("영상 길이: 2분 5초")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "다음 단계로" }));

    await waitFor(() => {
      expect(createChapterAction).toHaveBeenCalledWith({
        courseId: 100,
        title: "도쿄 입국 준비",
        description: "입국 서류와 교통 정보를 설명합니다.",
        durationSeconds: 125,
        chapterOrder: 1,
        video: expect.any(File),
      });
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test("챕터 등록 실패 시 에러 메시지를 표시하고 다음 단계로 이동하지 않는다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    createElementSpy = mockVideoMetadataLoad(60);
    (createChapterAction as jest.Mock).mockRejectedValue(new Error("챕터 등록 실패"));

    render(
      <LectureChapterForm
        courseId={100}
        onPrev={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText("챕터 제목"), "실패 챕터");
    await user.type(screen.getByLabelText("챕터 설명"), "실패 케이스 설명");
    await user.upload(
      document.querySelector("#chapter-1-video") as HTMLInputElement,
      createVideoFile()
    );
    await screen.findByText("영상 길이: 1분");

    await user.click(screen.getByRole("button", { name: "다음 단계로" }));

    expect(await screen.findByText("챕터 등록 실패")).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
