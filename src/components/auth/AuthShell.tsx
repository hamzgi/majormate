import Link from "next/link";
import { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-panel">
        <Link className="brand auth-brand" href="/" aria-label="MajorMate 홈으로">
          <span className="brand-mark">M</span>
          <span>MajorMate</span>
        </Link>
        <div className="auth-heading">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{description}</span>
        </div>
        {children}
      </div>
      <aside className="auth-aside" aria-hidden="true">
        <div className="auth-orbit auth-orbit--one" />
        <div className="auth-orbit auth-orbit--two" />
        <div className="auth-aside-copy">
          <span>STUDY TOGETHER</span>
          <strong>전공을 잇고,<br />성장을 나누세요.</strong>
          <p>같은 목표를 가진 학우와 안전하게 연결되는 전공 스터디 커뮤니티입니다.</p>
        </div>
      </aside>
    </main>
  );
}
