import type { RegisterFormData } from "@/features/auth/types";
import {ValidateRegisterInfoOptions} from "../types"

export const REGISTER_REQUIRED_NAME_MESSAGE = "이름은 필수입니다.";
export const REGISTER_REQUIRED_USERNAME_MESSAGE ="아이디는 4자 이상 20자 이하로 입력해주세요.";
export const REGISTER_REQUIRED_PASSWORD_MESSAGE ="비밀번호는 영문, 숫자 조합 8자 이상이어야 합니다.";
export const REGISTER_INVALID_EMAIL_MESSAGE = "올바른 이메일 형식을 입력해주세요.";
export const REGISTER_REQUIRED_EMAIL_MESSAGE = REGISTER_INVALID_EMAIL_MESSAGE;
export const REGISTER_REQUIRED_NICKNAME_MESSAGE ="닉네임은 필수이며 50자 이내여야 합니다.";
export const REGISTER_PASSWORD_CONFIRM_MESSAGE = "비밀번호가 일치하지 않습니다.";
export const REGISTER_USERNAME_CHECK_MESSAGE ="아이디 중복 확인을 완료해주세요.";
export const REGISTER_EMAIL_VERIFY_MESSAGE = "이메일 인증을 완료해주세요.";
export const REGISTER_INVALID_PHONE_MESSAGE ="올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)";
export const REGISTER_REQUIRED_BIRTH_DATE_MESSAGE = "생년월일은 필수입니다.";
export const REGISTER_REQUIRED_GENDER_MESSAGE = "성별은 필수입니다.";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

export const validateRegisterName = (name: string) => {
  return name.trim() ? "" : REGISTER_REQUIRED_NAME_MESSAGE;
};

export const validateRegisterUsername = (username: string) => {
  return username.length >= 4 && username.length <= 20
    ? ""
    : REGISTER_REQUIRED_USERNAME_MESSAGE;
};

export const validateRegisterPassword = (password: string) => {
  return passwordRegex.test(password) ? "" : REGISTER_REQUIRED_PASSWORD_MESSAGE;
};

export const validateRegisterEmail = (email: string) => {
  return emailRegex.test(email) ? "" : REGISTER_INVALID_EMAIL_MESSAGE;
};

export const validateRegisterNickname = (nickname: string) => {
  return nickname && nickname.length <= 50
    ? ""
    : REGISTER_REQUIRED_NICKNAME_MESSAGE;
};


export const validateRegisterInfoForm = (
  formData: RegisterFormData,
  {
    isSocialSignup = false,
    isUsernameChecked = false,
    isEmailVerified = false,
  }: ValidateRegisterInfoOptions = {}
) => {
  const errors: Record<string, string> = {};

  const nameError = validateRegisterName(formData.name);
  if (nameError) errors.name = nameError;

  if (!isSocialSignup) {
    const usernameError = validateRegisterUsername(formData.username);
    if (usernameError) {
      errors.username = usernameError;
    } else if (!isUsernameChecked) {
      errors.username = REGISTER_USERNAME_CHECK_MESSAGE;
    }

    const passwordError = validateRegisterPassword(formData.password);
    if (passwordError) errors.password = passwordError;

    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = REGISTER_PASSWORD_CONFIRM_MESSAGE;
    }
  }

  const emailError = validateRegisterEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  } else if (!isSocialSignup && !isEmailVerified) {
    errors.email = REGISTER_EMAIL_VERIFY_MESSAGE;
  }

  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    errors.phone = REGISTER_INVALID_PHONE_MESSAGE;
  }

  if (!formData.birthDate) errors.birthDate = REGISTER_REQUIRED_BIRTH_DATE_MESSAGE;

  if (!formData.gender) errors.gender = REGISTER_REQUIRED_GENDER_MESSAGE;

  const nicknameError = validateRegisterNickname(formData.nickname);
  if (nicknameError) errors.nickname = nicknameError;

  return errors;
};

export const createRegisterPayload = (
  formData: Pick<
    RegisterFormData,
    "name" | "username" | "password" | "passwordConfirm" | "email" | "nickname"
  >
) => {
  const nameError = validateRegisterName(formData.name);
  const usernameError = validateRegisterUsername(formData.username);
  const passwordError = validateRegisterPassword(formData.password);
  const emailError = validateRegisterEmail(formData.email);
  const nicknameError = validateRegisterNickname(formData.nickname);

  if (nameError) throw new Error(nameError);
  if (usernameError) throw new Error(usernameError);
  if (passwordError) throw new Error(passwordError);
  if (emailError) throw new Error(emailError);
  if (nicknameError) throw new Error(nicknameError);

  if (formData.password !== formData.passwordConfirm) {
    throw new Error(REGISTER_PASSWORD_CONFIRM_MESSAGE);
  }

  return {
    name: formData.name.trim(),
    username: formData.username.trim(),
    password: formData.password,
    passwordConfirm: formData.passwordConfirm,
    email: formData.email.trim(),
    nickname: formData.nickname.trim(),
  };
};
