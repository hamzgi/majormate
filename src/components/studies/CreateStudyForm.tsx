"use client";

import { useActionState } from "react";
import { createStudyAction } from "@/app/actions/studies";
import { StudyActionState } from "@/lib/study-validation";

const initialState: StudyActionState = {};
const days = ["월", "화", "수", "목", "금", "토", "일"];

export function CreateStudyForm() {
  const [state, formAction, isPending] = useActionState(createStudyAction, initialState);

  return <form action={formAction} className="entry-form study-entry-form" noValidate>
    {state.message ? <p className="auth-message" role="alert">{state.message}</p> : null}
    <label>스터디 제목<input name="title" maxLength={100} placeholder="예: 웹 보안 실습 같이 끝내요" required />{state.fieldErrors?.title?.[0] ? <small>{state.fieldErrors.title[0]}</small> : null}</label>
    <label>과목 또는 주제<input name="subject" maxLength={60} placeholder="예: 웹 보안" required />{state.fieldErrors?.subject?.[0] ? <small>{state.fieldErrors.subject[0]}</small> : null}</label>
    <label>스터디 소개<textarea name="description" rows={6} maxLength={2000} placeholder="목표, 진행 방식, 함께할 내용을 적어 주세요." required />{state.fieldErrors?.description?.[0] ? <small>{state.fieldErrors.description[0]}</small> : null}</label>
    <fieldset className="study-days"><legend>모임 요일</legend><div>{days.map((day) => <label key={day}><input name="meetingDays" type="checkbox" value={day} />{day}</label>)}</div>{state.fieldErrors?.meetingDays?.[0] ? <small>{state.fieldErrors.meetingDays[0]}</small> : null}</fieldset>
    <div className="form-two"><label>모임 시간<input name="meetingTime" maxLength={60} placeholder="예: 19:00 - 21:00" required />{state.fieldErrors?.meetingTime?.[0] ? <small>{state.fieldErrors.meetingTime[0]}</small> : null}</label><label>진행 방식<select name="meetingType" defaultValue="ONLINE"><option value="ONLINE">온라인</option><option value="OFFLINE">오프라인</option></select></label></div>
    <label>최대 인원<input name="maxMembers" type="number" min="2" max="20" defaultValue="4" required />{state.fieldErrors?.maxMembers?.[0] ? <small>{state.fieldErrors.maxMembers[0]}</small> : null}</label>
    <p className="form-notice">모집글을 등록한 본인은 첫 멤버로 자동 반영됩니다.</p>
    <button className="button button--primary button--wide" type="submit" disabled={isPending}>{isPending ? "등록 중…" : "스터디 모집글 등록"}</button>
  </form>;
}
