"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import { AuthActionState } from "@/lib/auth-validation";
import { AuthShell } from "@/components/auth/AuthShell";

const initialState: AuthActionState = {};

const majors = ["컴퓨터공학", "소프트웨어학", "정보보호학", "인공지능학", "기타"];

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <AuthShell
      eyebrow="START WITH MAJORMATE"
      title="같이 공부할 준비가 됐나요?"
      description="기본 정보를 입력하면 전공 스터디를 찾아볼 수 있어요."
    >
      <form action={formAction} className="auth-card auth-form" noValidate>
        {state.message ? <p className="auth-message" role="alert">{state.message}</p> : null}
        <div className="auth-field-row">
          <label className="auth-field">
            <span>이름</span>
            <input autoComplete="name" name="name" placeholder="홍길동" required />
            {state.fieldErrors?.name?.[0] ? <small>{state.fieldErrors.name[0]}</small> : null}
          </label>
          <label className="auth-field">
            <span>닉네임</span>
            <input autoComplete="nickname" name="nickname" placeholder="major_mate" required />
            {state.fieldErrors?.nickname?.[0] ? <small>{state.fieldErrors.nickname[0]}</small> : null}
          </label>
        </div>
        <label className="auth-field">
          <span>이메일</span>
          <input autoComplete="email" name="email" type="email" placeholder="name@example.com" required />
          {state.fieldErrors?.email?.[0] ? <small>{state.fieldErrors.email[0]}</small> : null}
        </label>
        <div className="auth-field-row">
          <label className="auth-field">
            <span>전공</span>
            <select defaultValue="" name="major" required>
              <option disabled value="">전공 선택</option>
              {majors.map((major) => <option key={major} value={major}>{major}</option>)}
            </select>
            {state.fieldErrors?.major?.[0] ? <small>{state.fieldErrors.major[0]}</small> : null}
          </label>
          <label className="auth-field">
            <span>학년</span>
            <select defaultValue="" name="grade" required>
              <option disabled value="">학년 선택</option>
              {[1, 2, 3, 4, 5, 6].map((grade) => <option key={grade} value={grade}>{grade}학년</option>)}
            </select>
            {state.fieldErrors?.grade?.[0] ? <small>{state.fieldErrors.grade[0]}</small> : null}
          </label>
        </div>
        <label className="auth-field">
          <span>비밀번호</span>
          <input autoComplete="new-password" name="password" type="password" placeholder="영문·숫자·특수문자 포함 10자 이상" required />
          {state.fieldErrors?.password?.[0] ? <small>{state.fieldErrors.password[0]}</small> : <small className="auth-hint">영문, 숫자, 특수문자를 모두 포함해 주세요.</small>}
        </label>
        <button className="button button--primary button--full auth-submit" disabled={isPending} type="submit">
          {isPending ? "가입 처리 중…" : "회원가입"}
        </button>
        <p className="auth-switch">이미 계정이 있나요? <Link href="/login">로그인</Link></p>
      </form>
    </AuthShell>
  );
}
