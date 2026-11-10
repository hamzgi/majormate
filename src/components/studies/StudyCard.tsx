import Link from "next/link";
import { StudySummary } from "@/lib/studies";

function meetingTypeLabel(value: StudySummary["meetingType"]) {
  return value === "ONLINE" ? "온라인" : "오프라인";
}

export function StudyCard({ study }: { study: StudySummary }) {
  const isRecruiting = study.status === "RECRUITING";
  const percent = Math.round((study.currentMembers / study.maxMembers) * 100);

  return (
    <Link className="study-card" href={`/studies/${study.id}`}>
      <div className="study-card-top"><span className="study-subject">{study.subject}</span><span className={`status status--${isRecruiting ? "good" : "closed"}`}>{isRecruiting ? "모집 중" : "모집 마감"}</span></div>
      <h2>{study.title}</h2>
      <p>{study.description}</p>
      <div className="study-info"><span>요일 · {study.meetingDays.join(" · ")}</span><span>시간 · {study.meetingTime}</span><span>{meetingTypeLabel(study.meetingType)} · 그룹장 {study.owner.nickname}</span></div>
      <div className="study-card-footer"><div className="member-progress"><div><span>참여 인원</span><b>{study.currentMembers}<small> / {study.maxMembers}</small></b></div><div className="progress"><i style={{ width: `${percent}%` }} /></div></div><span className="deadline">상세 보기 →</span></div>
    </Link>
  );
}

export function meetingTypeLabelForDisplay(value: StudySummary["meetingType"]) {
  return meetingTypeLabel(value);
}
