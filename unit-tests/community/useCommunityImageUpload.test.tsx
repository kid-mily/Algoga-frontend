import { ChangeEvent } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MAX_IMAGE_COUNT,
  useCommunityImageUpload,
} from "@/features/community/hooks/useCommunityImageUpload";

function createImageFile(name: string) {
  return new File(["image"], name, { type: "image/png" });
}

function ImageUploadHarness() {
  const {
    images,
    existingImageUrls,
    deletedImageUrls,
    imagePreviews,
    handleImageChange,
    handleRemoveImage,
    handleRemoveExistingImage,
    resetForEdit,
  } = useCommunityImageUpload();

  return (
    <section>
      <input
        aria-label="이미지 업로드"
        type="file"
        multiple
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          handleImageChange(event)
        }
      />
      <button
        type="button"
        onClick={() => resetForEdit(["/images/old-1.png", "/images/old-2.png"])}
      >
        기존 이미지 세팅
      </button>
      <button
        type="button"
        onClick={() => handleRemoveExistingImage("/images/old-1.png")}
      >
        기존 이미지 삭제
      </button>
      <button type="button" onClick={() => handleRemoveImage(0)}>
        새 이미지 삭제
      </button>

      <p>새 이미지 {images.length}장</p>
      <p>기존 이미지 {existingImageUrls.length}장</p>
      <p>삭제 이미지 {deletedImageUrls.length}장</p>
      <p>미리보기 {imagePreviews.length}장</p>
    </section>
  );
}

describe("useCommunityImageUpload 훅 테스트", () => {
  beforeEach(() => {
    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: jest.fn((file: File) => `blob:${file.name}`),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: jest.fn(),
    });
  });

  test("이미지를 업로드하면 이미지 목록과 미리보기가 추가된다", async () => {
    const user = userEvent.setup();

    render(<ImageUploadHarness />);

    await user.upload(screen.getByLabelText("이미지 업로드"), [
      createImageFile("travel-1.png"),
      createImageFile("travel-2.png"),
    ]);

    expect(screen.getByText("새 이미지 2장")).toBeVisible();
    expect(screen.getByText("미리보기 2장")).toBeVisible();
    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
  });

  test("최대 이미지 수를 넘기면 10장까지만 유지한다", async () => {
    const user = userEvent.setup();

    render(<ImageUploadHarness />);

    const files = Array.from({ length: MAX_IMAGE_COUNT + 2 }, (_, index) =>
      createImageFile(`travel-${index}.png`)
    );

    await user.upload(screen.getByLabelText("이미지 업로드"), files);

    expect(screen.getByText("새 이미지 10장")).toBeVisible();
  });

  test("수정 모드 기존 이미지를 삭제하면 삭제 목록에 추가된다", async () => {
    const user = userEvent.setup();

    render(<ImageUploadHarness />);

    await user.click(screen.getByRole("button", { name: "기존 이미지 세팅" }));
    expect(screen.getByText("기존 이미지 2장")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "기존 이미지 삭제" }));

    expect(screen.getByText("기존 이미지 1장")).toBeVisible();
    expect(screen.getByText("삭제 이미지 1장")).toBeVisible();
  });

  test("새로 올린 이미지를 삭제할 수 있다", async () => {
    const user = userEvent.setup();

    render(<ImageUploadHarness />);

    await user.upload(screen.getByLabelText("이미지 업로드"), [
      createImageFile("travel-1.png"),
    ]);
    await user.click(screen.getByRole("button", { name: "새 이미지 삭제" }));

    expect(screen.getByText("새 이미지 0장")).toBeVisible();
  });
});
