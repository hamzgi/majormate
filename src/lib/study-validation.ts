import { z } from "zod";

export const studySchema = z.object({
  title: z.string().trim().min(3, "제목은 3자 이상 입력해 주세요.").max(100, "제목은 100자 이하로 입력해 주세요."),
  subject: z.string().trim().min(2, "과목 또는 주제를 입력해 주세요.").max(60),
  description: z.string().trim().min(10, "스터디 소개는 10자 이상 입력해 주세요.").max(2000),
  meetingDays: z.array(z.enum(["월", "화", "수", "목", "금", "토", "일"])).min(1, "모임 요일을 하나 이상 선택해 주세요."),
  meetingTime: z.string().trim().min(2, "모임 시간을 입력해 주세요.").max(60),
  meetingType: z.enum(["ONLINE", "OFFLINE"]),
  maxMembers: z.coerce.number().int().min(2, "모집 인원은 2명 이상이어야 합니다.").max(20, "모집 인원은 최대 20명입니다."),
});

export const studyApplicationSchema = z.object({
  message: z.string().trim().min(5, "신청 메시지는 5자 이상 입력해 주세요.").max(500, "신청 메시지는 500자 이하로 입력해 주세요."),
});

export type StudyActionState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
};

export function studyValidationState(error: z.ZodError): StudyActionState {
  return { fieldErrors: error.flatten().fieldErrors };
}
