import Link from "next/link";
import { auth } from "@/auth";
import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { SiteFrame } from "@/components/layout/SiteChrome";
import { StudyCard } from "@/components/studies/StudyCard";
import { isAuthConfigured } from "@/lib/auth-config";
import { getRecruitingStudies } from "@/lib/studies";
import { connection } from "next/server";

export const instant = false;

export default async function StudiesPage() {
  await connection();
  if (!isAuthConfigured()) return <AuthSetupNotice />;
  const [session, studies] = await Promise.all([auth(), getRecruitingStudies()]);

  return <SiteFrame user={session?.user ?? null}>
    <main className="page-wrap">
      <section className="page-intro page-intro--study"><div><div className="eyebrow eyebrow--dark"><span className="pulse-dot" />STUDY MATCHING</div><h1>나와 맞는 시간,<br /><em>같은 목표의 사람.</em></h1><p>실제 MajorMate 회원이 등록한 스터디를 둘러보고 참여를 신청해 보세요.</p></div><Link className="button button--primary" href="/studies/new">+ 스터디 모집</Link></section>
      <section className="study-grid">{studies.length ? studies.map((study) => <StudyCard key={study.id} study={study} />) : <div className="empty-state"><b>현재 모집 중인 스터디가 없어요</b><p>첫 번째 그룹장이 되어 스터디를 만들어 보세요.</p><Link className="button button--primary" href="/studies/new">스터디 모집하기</Link></div>}</section>
    </main>
  </SiteFrame>;
}
