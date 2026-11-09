import { z } from "zod";

const passwordSchema = z
  .string()
  .min(10, "비밀번호는 10자 이상이어야 합니다.")
  .max(72, "비밀번호는 72자 이하여야 합니다.")
  .regex(/[A-Za-z]/, "비밀번호에 영문자를 포함해 주세요.")
  .regex(/[0-9]/, "비밀번호에 숫자를 포함해 주세요.")
  .regex(/[^A-Za-z0-9]/, "비밀번호에 특수문자를 포함해 주세요.");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "이름은 2자 이상 입력해 주세요.").max(30),
  nickname: z
    .string()
    .trim()
    .min(2, "닉네임은 2자 이상 입력해 주세요.")
    .max(20, "닉네임은 20자 이하로 입력해 주세요.")
    .regex(/^[가-힣A-Za-z0-9_]+$/, "닉네임은 한글, 영문, 숫자, 밑줄만 사용할 수 있습니다."),
  email: z.string().trim().email("올바른 이메일 주소를 입력해 주세요.").max(254),
  password: passwordSchema,
  major: z.string().trim().min(2, "전공을 입력해 주세요.").max(60),
  grade: z.coerce.number().int().min(1, "학년을 선택해 주세요.").max(6),
});

export const loginSchema = z.object({
  email: z.string().trim().email("올바른 이메일 주소를 입력해 주세요.").max(254),
  password: z.string().min(1, "비밀번호를 입력해 주세요.").max(72),
});

export type AuthActionState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
};

export function validationState(error: z.ZodError): AuthActionState {
  return { fieldErrors: error.flatten().fieldErrors };
}
