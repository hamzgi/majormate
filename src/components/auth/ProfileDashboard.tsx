import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

type ProfileDashboardProps = {
  user: {
    name?: string | null;
    email?: string | null;
    nickname: string;
    major: string;
    grade: number;
  };
};

export function ProfileDashboard({ user }: ProfileDashboardProps) {
  const displayName = user.name ?? user.nickname;

  return (
    <main className="account-page">
      <header className="account-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">M</span>
          <span>MajorMate</span>
        </Link>
        <nav className="account-nav" aria-label="계정 메뉴">
          <Link href="/studies">스터디 찾기</Link>
          <form action={logoutAction}><button type="submit">로그아웃</button></form>
        </nav>
      </header>
      <section className="account-wrap">
        <div className="account-hero">
          <div className="account-avatar">{displayName.slice(0, 1)}</div>
          <div>
            <p>MY MAJORMATE</p>
            <h1>{displayName}님, 환영합니다.</h1>
            <span>{user.major} · {user.grade}학년</span>
          </div>
        </div>
        <div className="account-grid">
          <section className="account-card">
            <span className="account-label">PROFILE</span>
            <h2>내 기본 정보</h2>
            <dl className="account-details">
              <div><dt>닉네임</dt><dd>{user.nickname}</dd></div>
              <div><dt>이메일</dt><dd>{user.email ?? "등록된 이메일 없음"}</dd></div>
              <div><dt>전공 / 학년</dt><dd>{user.major} / {user.grade}학년</dd></div>
            </dl>
          </section>
          <section className="account-card account-card--accent">
            <span className="account-label">NEXT STEP</span>
            <h2>스터디를 찾아볼까요?</h2>
            <p>2단계에서 실제 스터디 모집, 신청, 승인 기능을 이 계정과 연결합니다.</p>
            <Link className="button button--primary" href="/studies">스터디 둘러보기</Link>
          </section>
        </div>
      </section>
    </main>
  );
}
