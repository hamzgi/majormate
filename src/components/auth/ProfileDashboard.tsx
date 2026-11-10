import Link from "next/link";
import { SiteFrame } from "@/components/layout/SiteChrome";
import { StudySummary } from "@/lib/studies";

type ProfileDashboardProps = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    nickname: string;
    major: string;
    grade: number;
  };
  studies: StudySummary[];
};

export function ProfileDashboard({ user, studies }: ProfileDashboardProps) {
  const displayName = user.name ?? user.nickname;

  return <SiteFrame user={user}>
    <main className="account-page"><section className="account-wrap">
      <div className="account-hero"><div className="account-avatar">{displayName.slice(0, 1)}</div><div><p>MY MAJORMATE</p><h1>{displayName}님, 환영합니다.</h1><span>{user.major} · {user.grade}학년</span></div></div>
      <div className="account-grid"><section className="account-card"><span className="account-label">PROFILE</span><h2>내 기본 정보</h2><dl className="account-details"><div><dt>닉네임</dt><dd>{user.nickname}</dd></div><div><dt>이메일</dt><dd>{user.email ?? "등록된 이메일 없음"}</dd></div><div><dt>전공 / 학년</dt><dd>{user.major} / {user.grade}학년</dd></div></dl></section><section className="account-card account-card--accent"><span className="account-label">STUDY</span><h2>내가 만든 스터디</h2>{studies.length ? <div className="my-study-links">{studies.map((study) => <Link href={`/studies/${study.id}/manage`} key={study.id}>{study.title}<small>{study.currentMembers} / {study.maxMembers}명 · 신청 관리</small></Link>)}</div> : <p>아직 만든 스터디가 없어요.</p>}<Link className="button button--primary" href="/studies/new">스터디 모집하기</Link></section></div>
    </section></main>
  </SiteFrame>;
}
