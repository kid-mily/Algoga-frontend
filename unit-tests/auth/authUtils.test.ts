import { ApiRequestError } from "@/lib/api";
import {
  getErrorCode,
  getErrorNumber,
  getErrorRecord,
} from "@/features/auth/utils/authError";
import { formatCountdown } from "@/features/auth/utils/formatCountdown";

describe("auth 유틸 테스트", () => {
  test("formatCountdown은 초를 분/초 형식으로 변환한다", () => {
    expect(formatCountdown(0)).toBe("0분 00초");
    expect(formatCountdown(65)).toBe("1분 05초");
    expect(formatCountdown(287)).toBe("4분 47초");
  });

  test("formatCountdown은 음수 값을 0초로 보정한다", () => {
    expect(formatCountdown(-10)).toBe("0분 00초");
  });

  test("ApiRequestError body에서 errorCode와 숫자 필드를 추출한다", () => {
    const error = new ApiRequestError({
      message: "비밀번호 오류",
      status: 400,
      body: {
        errorCode: "USER_006",
        failCount: "2",
        maxAttempts: 5,
      },
    });

    expect(getErrorRecord(error)).toEqual({
      errorCode: "USER_006",
      failCount: "2",
      maxAttempts: 5,
    });
    expect(getErrorCode(error)).toBe("USER_006");
    expect(getErrorNumber(error, "failCount")).toBe(2);
    expect(getErrorNumber(error, "maxAttempts")).toBe(5);
  });

  test("ApiRequestError가 아니거나 값이 없으면 fallback을 반환한다", () => {
    expect(getErrorRecord(new Error("일반 오류"))).toEqual({});
    expect(getErrorCode(new Error("일반 오류"))).toBe("");
    expect(getErrorNumber(new Error("일반 오류"), "failCount", 1)).toBe(1);
  });
});
