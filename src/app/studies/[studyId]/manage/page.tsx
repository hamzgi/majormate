import Link from "next/link";
import { auth } from "@/auth";
import { reviewStudyApplicationAction } from "@/app/actions/studies";
import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { SiteFrame } from "@/components/layout/SiteChrome";
import { isAuthConfigured } from "@/lib/auth-config";
import { getManagedApplications, getStudyById } from "@/lib/studies";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const instant = false;

type ManageStudyPageProps = { params: Promise<{ studyId: string }> };

function statusLabel(status: string) {
  return status === "APPROVED" ? "승인됨" : status === "REJECTED" ? "거절됨" : "검토 중";
}

export default async function ManageStudyPage({ params }: ManageStudyPageProps) {
  await connection();
  if (!isAuthConfigured()) return <AuthSetupNotice />;
  const { studyId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=${encodeURIComponent(`/studies/${studyId}/manage`)}`);
  const study = await getStudyById(studyId);
  if (!study || study.owner.id !== session.user.id) redirect(`/studies/${studyId}`);
  const applications = await getManagedApplications(studyId, session.user.id);

  return <SiteFrame user={session.user}>
    <main className="page-wrap narrow-page">
      <Link className="back-link" href={`/studies/${studyId}`}>← 스터디 상세</Link>
      <section className="manage-head"><span className="section-kicker">LEADER DESK</span><h1>{study.title}<br /><em>참여 신청 관리</em></h1><p>현재 {study.currentMembers} / {study.maxMembers}명 참여 중입니다.</p></section>
      <section className="applications-card">
        {applications.length === 0 ? <div className="empty-state"><b>아직 참여 신청이 없어요</b><p>새 신청이 들어오면 이곳에서 승인하거나 거절할 수 있습니다.</p></div> : applications.map((application) => <article className="application-review" key={application.id}><div className="applicant-summary"><span className="avatar">{application.applicant.nickname.slice(0, 1)}</span><div><b>{application.applicant.nickname}</b><small>{application.applicant.major} · {application.applicant.grade}학년</small></div><span className={`status status--${application.status === "PENDING" ? "wait" : application.status === "APPROVED" ? "good" : "closed"}`}>{statusLabel(application.status)}</span></div><p>{application.message}</p>{application.status === "PENDING" ? <div className="decision-buttons"><form action={reviewStudyApplicationAction.bind(null, studyId, application.id, "REJECTED")}><button type="submit">거절</button></form><form action={reviewStudyApplicationAction.bind(null, studyId, application.id, "APPROVED")}><button type="submit">승인</button></form></div> : null}</article>)}
      </section>
    </main>
  </SiteFrame>;
}
