import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterInfoForm from "@/features/auth/components/RegisterInfoForm";
import type { RegisterFormData } from "@/features/auth/types";

const createFormData = (
  overrides: Partial<RegisterFormData> = {}
): RegisterFormData => ({
  name: "",
  username: "",
  password: "",
  passwordConfirm: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  nickname: "",
  socialType: "",
  referralCode: "",
  signupPath: "",
  termsServiceAgreed: false,
  termsPrivacyAgreed: false,
  termsMarketingAgreed: false,
  ...overrides,
});

describe("RegisterInfoForm 컴포넌트 테스트", () => {
  test("회원가입 정보 입력 폼이 정상적으로 렌더링된다", () => {
    render(
      <RegisterInfoForm
        formData={createFormData()}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText("홍길동")).toBeVisible();
    expect(screen.getByPlaceholderText("4자 이상 20자 이하")).toBeVisible();
    expect(screen.getByPlaceholderText("8자 이상 영문, 숫자 조합")).toBeVisible();
    expect(screen.getByPlaceholderText("example@algoga.com")).toBeVisible();
    expect(screen.getByRole("button", { name: "다음 단계로 이동" })).toBeVisible();
  });

  test("필수 정보를 입력하지 않고 다음 버튼을 누르면 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(
      <RegisterInfoForm
        formData={createFormData()}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "다음 단계로 이동" }));

    expect(screen.getByText("이름은 필수입니다.")).toBeVisible();
    expect(screen.getByText("아이디는 4자 이상 20자 이하로 입력해주세요.")).toBeVisible();
    expect(screen.getByText("비밀번호는 영문, 숫자 조합 8자 이상이어야 합니다.")).toBeVisible();
    expect(screen.getByText("올바른 이메일 형식을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)")).toBeVisible();
    expect(screen.getByText("생년월일은 필수입니다.")).toBeVisible();
    expect(screen.getByText("성별은 필수입니다.")).toBeVisible();
    expect(screen.getByText("닉네임은 필수이며 50자 이내여야 합니다.")).toBeVisible();
  });
});