import { ApiRequestError } from "@/lib/api";
import {
  getErrorMessage,
  isAbortError,
} from "@/features/services/error.service";

describe("공통 error.service 테스트", () => {
  test("ApiRequestError이면 에러 메시지를 반환한다", () => {
    const error = new ApiRequestError({
      message: "서버 내부에서 오류가 발생했습니다.",
      status: 500,
    });

    expect(getErrorMessage(error, "기본 오류")).toBe(
      "서버 내부에서 오류가 발생했습니다."
    );
  });

  test("ApiRequestError 메시지가 비어 있으면 fallback을 반환한다", () => {
    const error = new ApiRequestError({
      message: "",
      status: 500,
    });

    expect(getErrorMessage(error, "기본 오류")).toBe("기본 오류");
  });

  test("일반 Error이면 Error 메시지를 반환하고, unknown이면 fallback을 반환한다", () => {
    expect(getErrorMessage(new Error("네트워크 오류"), "기본 오류")).toBe(
      "네트워크 오류"
    );
    expect(getErrorMessage("문자열 오류", "기본 오류")).toBe("기본 오류");
  });

  test("AbortError 여부를 구분한다", () => {
    expect(isAbortError(new DOMException("aborted", "AbortError"))).toBe(true);
    expect(isAbortError(new DOMException("failed", "NetworkError"))).toBe(false);
    expect(isAbortError(new Error("AbortError"))).toBe(false);
  });
});
