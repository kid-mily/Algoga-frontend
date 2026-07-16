import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BannerFormClient from "@/features/csadmin/banner/components/BannerFormClient";
import { useBannerForm } from "@/features/csadmin/banner/hooks/useBannerForm";

jest.mock("@/features/csadmin/banner/hooks/useBannerForm", () => ({
  useBannerForm: jest.fn(),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const createHookValue = (override = {}) => ({
  formData: {
    text: "",
    linkUrl: "",
    fileType: "IMAGE",
    isVisible: true,
  },
  file: null,
  fileError: "",
  mediaPreviewUrl: "",
  isLoading: false,
  isSubmitting: false,
  error: "",
  confirmOpen: false,
  completeOpen: false,
  setConfirmOpen: jest.fn(),
  setCompleteOpen: jest.fn(),
  updateField: jest.fn(),
  handleFileChange: jest.fn(),
  validateForm: jest.fn(() => true),
  saveBanner: jest.fn(),
  ...override,
});

describe("BannerFormClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("배너 등록 폼을 렌더링한다", () => {
    (useBannerForm as jest.Mock).mockReturnValue(createHookValue());

    render(<BannerFormClient mode="create" />);

    expect(screen.getAllByText("배너 등록")[0]).toBeVisible();
    expect(screen.getByLabelText(/배너 문구/)).toBeVisible();
    expect(screen.getByLabelText(/연결 URL/)).toBeVisible();
    expect(screen.getByLabelText(/배너 파일/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "등록하기" })).toBeVisible();
  });

  test("배너 문구와 URL 변경 시 updateField를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useBannerForm as jest.Mock).mockReturnValue(hookValue);

    render(<BannerFormClient mode="create" />);

    await user.type(screen.getByLabelText(/배너 문구/), "메인 배너");
    await user.type(screen.getByLabelText(/연결 URL/), "https://algoga.kro.kr");

    expect(hookValue.updateField).toHaveBeenCalledWith("text", expect.any(String));
    expect(hookValue.updateField).toHaveBeenCalledWith("linkUrl", expect.any(String));
  });

  test("파일 선택 시 handleFileChange를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    const file = new File(["banner"], "banner.png", { type: "image/png" });
    (useBannerForm as jest.Mock).mockReturnValue(hookValue);

    render(<BannerFormClient mode="create" />);

    await user.upload(screen.getByLabelText(/배너 파일/), file);

    expect(hookValue.handleFileChange).toHaveBeenCalled();
  });

  test("노출 체크박스 변경 시 updateField를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useBannerForm as jest.Mock).mockReturnValue(hookValue);

    render(<BannerFormClient mode="create" />);

    await user.click(screen.getByLabelText("메인 화면에 노출"));

    expect(hookValue.updateField).toHaveBeenCalledWith("isVisible", false);
  });

  test("등록 버튼을 누르면 validateForm과 saveBanner를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({
      formData: {
        text: "메인 배너",
        linkUrl: "https://algoga.kro.kr",
        fileType: "IMAGE",
        isVisible: true,
      },
      file: new File(["banner"], "banner.png", { type: "image/png" }),
    });
    (useBannerForm as jest.Mock).mockReturnValue(hookValue);

    render(<BannerFormClient mode="create" />);

    await user.click(screen.getByRole("button", { name: "등록하기" }));

    expect(hookValue.validateForm).toHaveBeenCalled();
    expect(hookValue.saveBanner).toHaveBeenCalled();
  });

  test("수정 버튼을 누르면 확인 모달을 연다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({
      formData: {
        text: "수정 배너",
        linkUrl: "https://algoga.kro.kr/event",
        fileType: "IMAGE",
        isVisible: true,
      },
    });
    (useBannerForm as jest.Mock).mockReturnValue(hookValue);

    render(<BannerFormClient mode="edit" bannerId={1} />);

    await user.click(screen.getByRole("button", { name: "수정 완료" }));

    expect(hookValue.setConfirmOpen).toHaveBeenCalledWith(true);
  });

  test("완료 모달 확인 시 배너 목록으로 이동한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({ completeOpen: true });
    (useBannerForm as jest.Mock).mockReturnValue(hookValue);

    render(<BannerFormClient mode="create" />);

    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(hookValue.setCompleteOpen).toHaveBeenCalledWith(false);
    expect(pushMock).toHaveBeenCalledWith("/csadmin/banner");
  });
});
