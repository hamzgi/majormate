"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import {
  AuthActionState,
  loginSchema,
  registerSchema,
  validationState,
} from "@/lib/auth-validation";
import { isAuthConfigured, safeCallbackUrl } from "@/lib/auth-config";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isAuthConfigured()) {
    return { message: "계정 서비스를 준비 중입니다. 잠시 후 다시 시도해 주세요." };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
    major: formData.get("major"),
    grade: formData.get("grade"),
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const email = parsed.data.email.toLowerCase();

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({
      $or: [{ email }, { nickname: parsed.data.nickname }],
    })
      .select("email nickname")
      .lean();

    if (existingUser) {
      return {
        message:
          existingUser.email === email
            ? "이미 가입된 이메일입니다. 로그인해 주세요."
            : "이미 사용 중인 닉네임입니다.",
      };
    }

    const passwordHash = await hash(parsed.data.password, 12);

    await User.create({
      ...parsed.data,
      email,
      passwordHash,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return { message: "이미 사용 중인 이메일 또는 닉네임입니다." };
    }

    console.error("Failed to register user", error);
    return { message: "회원가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }

  redirect("/login?registered=1");
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isAuthConfigured()) {
    return { message: "계정 서비스를 준비 중입니다. 잠시 후 다시 시도해 주세요." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: safeCallbackUrl(String(formData.get("callbackUrl") ?? "/my")),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "이메일 또는 비밀번호를 확인해 주세요." };
    }

    throw error;
  }

  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
