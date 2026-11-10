import Link from "next/link";
import { ReactNode } from "react";
import { logoutAction } from "@/app/actions/auth";

export type SiteUser = {
  id: string;
  name?: string | null;
  nickname: string;
};

export function SiteHeader({ user }: { user: SiteUser | null }) {
  const displayName = user?.name ?? user?.nickname;

  return (
    <header className="topbar">
      <Link href="/" className="brand" aria-label="MajorMate 홈"><span className="brand-mark">M</span><span>MajorMate</span></Link>
      <nav className="nav" aria-label="주요 메뉴">
        <Link href="/" className="nav-link">홈</Link>
        <Link href="/community" className="nav-link">커뮤니티</Link>
        <Link href="/studies" className="nav-link">스터디</Link>
        <Link href="/my" className="nav-link">MY</Link>
      </nav>
      <div className="profile-area">
        {user ? (
          <>
            <Link href="/my" className="profile-link"><span className="avatar avatar--small">{displayName?.slice(0, 1)}</span><span>{displayName}</span></Link>
            <form action={logoutAction}><button className="auth-link" type="submit">로그아웃</button></form>
          </>
        ) : (
          <>
            <Link href="/login" className="auth-link">로그인</Link>
            <Link href="/register" className="auth-link auth-link--primary">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return <footer className="footer"><span>MajorMate</span><span>전공의 연결이 학업의 힘이 되도록.</span><span>실시간 계정·스터디 데이터</span></footer>;
}

export function SiteFrame({ user, children }: { user: SiteUser | null; children: ReactNode }) {
  return <div className="app-shell"><SiteHeader user={user} />{children}<SiteFooter /></div>;
}
