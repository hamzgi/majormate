"use client";

import { useActionState } from "react";
import { applyToStudyAction } from "@/app/actions/studies";
import { StudyActionState } from "@/lib/study-validation";

const initialState: StudyActionState = {};

export function ApplyStudyForm({ studyId }: { studyId: string }) {
  const action = applyToStudyAction.bind(null, studyId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  return <form action={formAction} className="entry-form apply-study-form" noValidate>
    {state.message ? <p className="auth-message auth-message--success" role="status">{state.message}</p> : null}
    <label>참여 신청 메시지<textarea name="message" rows={4} maxLength={500} placeholder="스터디에 참여하고 싶은 이유와 목표를 간단히 적어 주세요." required />{state.fieldErrors?.message?.[0] ? <small>{state.fieldErrors.message[0]}</small> : null}</label>
    <button className="button button--primary button--wide" type="submit" disabled={isPending}>{isPending ? "신청 중…" : "참여 신청 보내기"}</button>
  </form>;
}
