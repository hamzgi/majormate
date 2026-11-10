import Link from "next/link";
import { auth } from "@/auth";
import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { SiteFrame } from "@/components/layout/SiteChrome";
import { StudyCard } from "@/components/studies/StudyCard";
import { isAuthConfigured } from "@/lib/auth-config";
import { getHomeStats } from "@/lib/home-stats";
import { getRecruitingStudies } from "@/lib/studies";
import { connection } from "next/server";

export const instant = false;

export default async function Home() {
  await connection();
  if (!isAuthConfigured()) return <AuthSetupNotice />;
  const [session, homeStats, studies] = await Promise.all([auth(), getHomeStats(), getRecruitingStudies(2)]);
  const memberCount = homeStats?.memberCount.toLocaleString("ko-KR") ?? "—";
  const studyCount = homeStats?.recruitingStudyCount.toLocaleString("ko-KR") ?? "—";

  return <SiteFrame user={session?.user ?? null}>
    <main className="page-wrap">
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="pulse-dot" />COMPUTING MAJOR COMMUNITY</div><h1>혼자 풀던 전공 고민,<br /><em>같이</em> 해답을 찾다.</h1><p>실제 회원이 만든 스터디를 둘러보고,<br />같은 목표를 가진 학우와 연결되어 보세요.</p><div className="hero-actions"><Link href="/studies" className="button button--primary">스터디 둘러보기 →</Link><Link href="/community" className="button button--ghost">커뮤니티 가기</Link></div></div>
        <div className="hero-art" aria-label="MajorMate 실제 현황"><div className="orbit orbit--one" /><div className="orbit orbit--two" /><div className="art-core"><span>현재</span><strong>{studyCount}</strong><small>모집 중인<br />스터디</small></div><div className="floating-card floating-card--top"><div><b>가입 회원 {memberCount}명</b><small>실제 MajorMate 계정 기준</small></div></div><div className="floating-card floating-card--bottom"><div><b>매칭 기능 준비 중</b><small>스터디 신청으로 시작해 보세요</small></div></div><span className="hero-star hero-star--one">✦</span><span className="hero-star hero-star--two">✦</span></div>
      </section>
      <section className="stat-grid" aria-label="MajorMate 실제 현황"><article className="stat-card"><div><strong>{memberCount}</strong><p>가입한 커뮤니티 멤버</p></div></article><article className="stat-card"><div><strong>{studyCount}</strong><p>현재 모집 중인 스터디</p></div></article><article className="stat-card"><div><strong>준비 중</strong><p>조건 기반 스터디 매칭</p></div></article></section>
      <section className="section-block split-section"><div className="feed-panel"><span className="section-kicker">COMMUNITY</span><h2>실제 커뮤니티를 준비 중이에요</h2><p className="panel-copy">프로토타입 게시글은 제거했습니다. 다음 단계에서 회원 계정 기반의 글·댓글 기능을 연결합니다.</p><Link className="button button--ghost" href="/community">커뮤니티 보기</Link></div><div className="study-panel"><div className="section-heading section-heading--compact"><div><span className="section-kicker">STUDY PICK</span><h2>지금 모집 중인 스터디</h2></div><Link className="see-all" href="/studies">전체 보기 →</Link></div><div className="home-study-list">{studies.length ? studies.map((study) => <StudyCard key={study.id} study={study} />) : <div className="empty-state"><b>첫 스터디를 만들어 보세요</b><p>아직 실제 모집글이 없습니다.</p><Link className="button button--primary" href="/studies/new">스터디 모집하기</Link></div>}</div></div></section>
    </main>
  </SiteFrame>;
}
