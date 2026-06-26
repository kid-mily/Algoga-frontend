import {
  createLoginPayload,
  LOGIN_FAILED_MESSAGE,
  LOGIN_REQUIRED_PASSWORD_MESSAGE,
  LOGIN_REQUIRED_USERNAME_MESSAGE,
  validateLoginPassword,
  validateLoginUsername,
} from "@/features/auth/utils/loginValidators";

describe("로그인 유효성 검사 단위 테스트", () => {
  test("아이디가 비어 있으면 아이디 필수 메시지를 반환한다", () => {
    const result = validateLoginUsername("");

    expect(result).toBe(LOGIN_REQUIRED_USERNAME_MESSAGE);
  });

  test("아이디가 공백만 있으면 아이디 필수 메시지를 반환한다", () => {
    const result = validateLoginUsername("   ");

    expect(result).toBe(LOGIN_REQUIRED_USERNAME_MESSAGE);
  });

  test("아이디가 입력되어 있으면 빈 문자열을 반환한다", () => {
    const result = validateLoginUsername("testuser");

    expect(result).toBe("");
  });

  test("비밀번호가 비어 있으면 비밀번호 필수 메시지를 반환한다", () => {
    const result = validateLoginPassword("");

    expect(result).toBe(LOGIN_REQUIRED_PASSWORD_MESSAGE);
  });

  test("비밀번호가 공백만 있으면 비밀번호 필수 메시지를 반환한다", () => {
    const result = validateLoginPassword("   ");

    expect(result).toBe(LOGIN_REQUIRED_PASSWORD_MESSAGE);
  });

  test("비밀번호가 입력되어 있으면 빈 문자열을 반환한다", () => {
    const result = validateLoginPassword("password123");

    expect(result).toBe("");
  });

  test("아이디와 비밀번호가 정상 입력되면 로그인 요청 payload를 만든다", () => {
    const result = createLoginPayload(" testuser ", "password123");

    expect(result).toEqual({
      username: "testuser",
      password: "password123",
    });
  });

  test("아이디가 없으면 에러가 발생한다", () => {
    expect(() => createLoginPayload("", "password123")).toThrow(
      LOGIN_REQUIRED_USERNAME_MESSAGE
    );
  });

  test("비밀번호가 없으면 에러가 발생한다", () => {
    expect(() => createLoginPayload("testuser", "")).toThrow(
      LOGIN_REQUIRED_PASSWORD_MESSAGE
    );
  });

  test("로그인 실패 메시지는 아이디 또는 비밀번호가 틀렸습니다로 고정한다", () => {
    expect(LOGIN_FAILED_MESSAGE).toBe("아이디 또는 비밀번호가 틀렸습니다.");
  });
});