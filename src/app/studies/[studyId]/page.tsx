import Link from "next/link";
import { auth } from "@/auth";
import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { SiteFrame } from "@/components/layout/SiteChrome";
import { ApplyStudyForm } from "@/components/studies/ApplyStudyForm";
import { meetingTypeLabelForDisplay } from "@/components/studies/StudyCard";
import { isAuthConfigured } from "@/lib/auth-config";
import { getStudyApplicationStatus, getStudyById } from "@/lib/studies";
import { notFound } from "next/navigation";
import { connection } from "next/server";

export const instant = false;

type StudyDetailPageProps = { params: Promise<{ studyId: string }> };

function applicationStatusLabel(status: string) {
  if (status === "APPROVED") return "참여가 승인되었습니다.";
  if (status === "REJECTED") return "참여 신청이 거절되었습니다.";
  return "참여 신청을 검토 중입니다.";
}

export default async function StudyDetailPage({ params }: StudyDetailPageProps) {
  await connection();
  if (!isAuthConfigured()) return <AuthSetupNotice />;
  const { studyId } = await params;
  const [session, study] = await Promise.all([auth(), getStudyById(studyId)]);
  if (!study) notFound();

  const user = session?.user ?? null;
  const isOwner = user?.id === study.owner.id;
  const applicationStatus = user && !isOwner ? await getStudyApplicationStatus(study.id, user.id) : null;
  const isClosed = study.status === "CLOSED";

  return <SiteFrame user={user}>
    <main className="page-wrap narrow-page">
      <Link className="back-link" href="/studies">← 스터디 목록</Link>
      <section className="study-detail-card">
        <div className="study-detail-top"><div><span className="study-subject">{study.subject}</span><h1>{study.title}</h1><p>그룹장 {study.owner.nickname} · {study.owner.major} {study.owner.grade}학년</p></div><span className={`status status--${isClosed ? "closed" : "good"}`}>{isClosed ? "모집 마감" : "모집 중"}</span></div>
        <p className="study-detail-description">{study.description}</p>
        <div className="study-detail-grid"><div><small>모임 요일</small><b>{study.meetingDays.join(" · ")}</b></div><div><small>모임 시간</small><b>{study.meetingTime}</b></div><div><small>진행 방식</small><b>{meetingTypeLabelForDisplay(study.meetingType)}</b></div><div><small>참여 인원</small><b>{study.currentMembers} / {study.maxMembers}명</b></div></div>
      </section>
      <section className="study-action-card">
        {isOwner ? <><h2>내가 만든 스터디입니다</h2><p>참여 신청을 검토하고 구성원을 관리할 수 있어요.</p><Link className="button button--primary" href={`/studies/${study.id}/manage`}>신청 관리하기</Link></> : !user ? <><h2>참여하려면 로그인이 필요해요</h2><p>로그인 후 스터디 참여 신청을 보낼 수 있습니다.</p><Link className="button button--primary" href={`/login?callbackUrl=${encodeURIComponent(`/studies/${study.id}`)}`}>로그인하고 신청하기</Link></> : isClosed ? <><h2>모집이 마감된 스터디입니다</h2><p>다른 스터디를 둘러보거나 새로운 스터디를 만들어 보세요.</p></> : applicationStatus ? <><h2>{applicationStatusLabel(applicationStatus)}</h2><p>신청 상태는 MY 페이지와 이 화면에서 확인할 수 있습니다.</p></> : <><h2>이 스터디에 참여할까요?</h2><p>신청 메시지는 그룹장에게만 전달됩니다.</p><ApplyStudyForm studyId={study.id} /></>}
      </section>
    </main>
  </SiteFrame>;
}
