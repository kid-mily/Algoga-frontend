import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommunityWriteForm from "@/features/community/components/common/CommunityWriteForm";
import {
  createCommunityPost,
  getCommunityContinents,
  getCommunityCountries,
  getCommunityPost,
  getCommunityPostTags,
  updateCommunityPost,
} from "@/features/services/community.service";

jest.mock("@/features/services/community.service", () => ({
  createCommunityPost: jest.fn(),
  getCommunityContinents: jest.fn(),
  getCommunityCountries: jest.fn(),
  getCommunityPost: jest.fn(),
  getCommunityPostTags: jest.fn(),
  updateCommunityPost: jest.fn(),
}));

const pushMock = jest.fn();
const backMock = jest.fn();
let searchParamsPostId: string | null = null;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    back: backMock,
  }),
  useSearchParams: () => ({
    get: (key: string) => (key === "postId" ? searchParamsPostId : null),
  }),
}));

jest.mock("next/image", () => {
  return function ImageMock({ alt, src }: { alt: string; src: string }) {
    return <img alt={alt} src={src} />;
  };
});

const continents = [{ continentCode: "ASIA", continentName: "아시아" }];
const countries = [
  { countryId: 1, countryName: "일본", countryCode: "JP", continentCode: "ASIA" },
];

describe("CommunityWriteForm 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    searchParamsPostId = null;

    (getCommunityContinents as jest.Mock).mockResolvedValue(continents);
    (getCommunityCountries as jest.Mock).mockResolvedValue(countries);
    (getCommunityPostTags as jest.Mock).mockResolvedValue([]);
  });

  test("커뮤니티 글쓰기 폼이 정상적으로 렌더링된다", async () => {
    render(<CommunityWriteForm />);

    expect(screen.getByText("게시글 작성")).toBeVisible();
    expect(screen.getByPlaceholderText("어떤 여행이었나요?")).toBeVisible();
    expect(screen.getByPlaceholderText("여행 이야기를 자유롭게 나눠주세요")).toBeVisible();
    expect(screen.getByRole("button", { name: "작성 완료" })).toBeVisible();

    await waitFor(() => {
      expect(getCommunityContinents).toHaveBeenCalledTimes(1);
      expect(getCommunityPostTags).toHaveBeenCalledTimes(1);
    });
  });

  test("제목/내용/태그를 입력하지 않으면 작성 완료 버튼이 비활성화된다", async () => {
    render(<CommunityWriteForm />);

    await waitFor(() => {
      expect(getCommunityPostTags).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole("button", { name: "작성 완료" })).toBeDisabled();
  });

  test("대륙을 선택하면 국가 목록을 불러온다", async () => {
    const user = userEvent.setup();

    render(<CommunityWriteForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("대륙")).toBeVisible();
    });

    await user.selectOptions(screen.getByLabelText("대륙"), "ASIA");

    await waitFor(() => {
      expect(getCommunityCountries).toHaveBeenCalledWith(
        "ASIA",
        expect.any(AbortSignal)
      );
    });

    expect(await screen.findByRole("option", { name: "일본" })).toBeInTheDocument();
  });

  test("태그를 자유로 선택하면 커스텀 태그 입력창이 보인다", async () => {
    const user = userEvent.setup();

    render(<CommunityWriteForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("태그")).toBeVisible();
    });

    await user.selectOptions(screen.getByLabelText("태그"), "FREE");

    expect(screen.getByPlaceholderText("최대 10자")).toBeVisible();

    await user.type(screen.getByPlaceholderText("최대 10자"), "혼자여행");
    await user.click(screen.getByRole("button", { name: "추가" }));

    expect(screen.getByText("#혼자여행")).toBeVisible();
  });

  test("필수 값을 모두 입력하고 제출하면 게시글 등록 API를 호출하고 완료 모달이 보인다", async () => {
    const user = userEvent.setup();

    (createCommunityPost as jest.Mock).mockResolvedValueOnce(undefined);

    render(<CommunityWriteForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("태그")).toBeVisible();
    });

    await user.selectOptions(screen.getByLabelText("태그"), "QUESTION");
    await user.type(
      screen.getByPlaceholderText("어떤 여행이었나요?"),
      "오사카 질문 있어요"
    );
    await user.type(
      screen.getByPlaceholderText("여행 이야기를 자유롭게 나눠주세요"),
      "환전은 어디서 하는 게 좋을까요?"
    );

    await user.click(screen.getByRole("button", { name: "작성 완료" }));

    await waitFor(() => {
      expect(createCommunityPost).toHaveBeenCalledWith({
        title: "오사카 질문 있어요",
        content: "환전은 어디서 하는 게 좋을까요?",
        countryId: undefined,
        tagType: "QUESTION",
        customTags: [],
        images: [],
      });
    });

    expect(await screen.findByText("게시글 등록 완료")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "목록으로" }));

    expect(pushMock).toHaveBeenCalledWith("/community");
  });

  test("게시글 등록에 실패하면 에러 메시지가 보인다", async () => {
    const user = userEvent.setup();

    (createCommunityPost as jest.Mock).mockRejectedValueOnce(
      new Error("게시글 등록에 실패했습니다.")
    );

    render(<CommunityWriteForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("태그")).toBeVisible();
    });

    await user.selectOptions(screen.getByLabelText("태그"), "FREE");
    await user.type(screen.getByPlaceholderText("어떤 여행이었나요?"), "제목");
    await user.type(
      screen.getByPlaceholderText("여행 이야기를 자유롭게 나눠주세요"),
      "내용"
    );

    await user.click(screen.getByRole("button", { name: "작성 완료" }));

    expect(await screen.findByText("게시글 등록에 실패했습니다.")).toBeVisible();
  });

  test("취소 버튼을 누르면 커뮤니티 목록으로 이동한다", async () => {
    const user = userEvent.setup();

    render(<CommunityWriteForm />);

    await waitFor(() => {
      expect(getCommunityPostTags).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(pushMock).toHaveBeenCalledWith("/community");
  });

  test("뒤로가기 버튼을 누르면 이전 화면으로 이동한다", async () => {
    const user = userEvent.setup();

    render(<CommunityWriteForm />);

    await waitFor(() => {
      expect(getCommunityPostTags).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole("button", { name: "뒤로가기" }));

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  test("수정 모드로 진입하면 기존 게시글 정보를 불러와 폼에 채운다", async () => {
    searchParamsPostId = "42";

    (getCommunityPost as jest.Mock).mockResolvedValueOnce({
      postId: 42,
      title: "기존 제목",
      content: "기존 내용",
      categoryCode: "TIP_INFO",
      imageUrls: [],
      countryId: undefined,
    });

    render(<CommunityWriteForm />);

    expect(await screen.findByText("게시글 수정")).toBeVisible();

    await waitFor(() => {
      expect(getCommunityPost).toHaveBeenCalledWith(42, expect.any(AbortSignal));
    });

    expect(await screen.findByDisplayValue("기존 제목")).toBeVisible();
    expect(screen.getByDisplayValue("기존 내용")).toBeVisible();
    expect(screen.getByRole("button", { name: "수정 완료" })).toBeVisible();
  });

  test("수정 모드에서 제출하면 게시글 수정 API를 호출한다", async () => {
    const user = userEvent.setup();
    searchParamsPostId = "42";

    (getCommunityPost as jest.Mock).mockResolvedValueOnce({
      postId: 42,
      title: "기존 제목",
      content: "기존 내용",
      categoryCode: "TIP_INFO",
      imageUrls: [],
      countryId: undefined,
    });
    (updateCommunityPost as jest.Mock).mockResolvedValueOnce(undefined);

    render(<CommunityWriteForm />);

    await screen.findByDisplayValue("기존 제목");

    await user.click(screen.getByRole("button", { name: "수정 완료" }));

    await waitFor(() => {
      expect(updateCommunityPost).toHaveBeenCalledWith(
        expect.objectContaining({
          postId: 42,
          title: "기존 제목",
          content: "기존 내용",
          tagType: "TIP_INFO",
        })
      );
    });

    expect(await screen.findByText("게시글 수정 완료")).toBeVisible();
  });
});
