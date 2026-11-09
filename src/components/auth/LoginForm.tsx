"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { AuthActionState } from "@/lib/auth-validation";
import { AuthShell } from "@/components/auth/AuthShell";

const initialState: AuthActionState = {};

export function LoginForm({ callbackUrl, showRegistered }: { callbackUrl: string; showRegistered: boolean }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      title="다시 만나 반가워요"
      description="MajorMate에서 내 전공 스터디를 이어가 보세요."
    >
      <form action={formAction} className="auth-card auth-form" noValidate>
        <input name="callbackUrl" type="hidden" value={callbackUrl} />
        {showRegistered ? <p className="auth-message auth-message--success">회원가입이 완료되었습니다. 로그인해 주세요.</p> : null}
        {state.message ? <p className="auth-message" role="alert">{state.message}</p> : null}
        <label className="auth-field">
          <span>이메일</span>
          <input autoComplete="email" name="email" type="email" placeholder="name@example.com" required />
          {state.fieldErrors?.email?.[0] ? <small>{state.fieldErrors.email[0]}</small> : null}
        </label>
        <label className="auth-field">
          <span>비밀번호</span>
          <input autoComplete="current-password" name="password" type="password" placeholder="비밀번호를 입력하세요" required />
          {state.fieldErrors?.password?.[0] ? <small>{state.fieldErrors.password[0]}</small> : null}
        </label>
        <button className="button button--primary button--full auth-submit" disabled={isPending} type="submit">
          {isPending ? "로그인 중…" : "로그인"}
        </button>
        <p className="auth-switch">아직 MajorMate 회원이 아닌가요? <Link href="/register">회원가입</Link></p>
      </form>
    </AuthShell>
  );
}
