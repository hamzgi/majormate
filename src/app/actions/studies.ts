"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { StudyActionState, studyApplicationSchema, studySchema, studyValidationState } from "@/lib/study-validation";
import Study from "@/models/Study";
import StudyApplication from "@/models/StudyApplication";

async function requireUserId(callbackUrl: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session.user.id;
}

export async function createStudyAction(
  _previousState: StudyActionState,
  formData: FormData,
): Promise<StudyActionState> {
  const parsed = studySchema.safeParse({
    title: formData.get("title"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    meetingDays: formData.getAll("meetingDays"),
    meetingTime: formData.get("meetingTime"),
    meetingType: formData.get("meetingType"),
    maxMembers: formData.get("maxMembers"),
  });

  if (!parsed.success) return studyValidationState(parsed.error);

  const userId = await requireUserId("/studies/new");
  let studyId: string;

  try {
    await connectToDatabase();
    const study = await Study.create({ ...parsed.data, owner: userId, currentMembers: 1 });
    studyId = study._id.toString();
  } catch (error) {
    console.error("Failed to create study", error);
    return { message: "스터디 모집글을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath("/");
  revalidatePath("/studies");
  redirect(`/studies/${studyId}`);
}

export async function applyToStudyAction(
  studyId: string,
  _previousState: StudyActionState,
  formData: FormData,
): Promise<StudyActionState> {
  if (!isValidObjectId(studyId)) return { message: "존재하지 않는 스터디입니다." };
  const parsed = studyApplicationSchema.safeParse({ message: formData.get("message") });
  if (!parsed.success) return studyValidationState(parsed.error);

  const userId = await requireUserId(`/studies/${studyId}`);

  try {
    await connectToDatabase();
    const study = await Study.findById(studyId).select("owner status currentMembers maxMembers").lean();
    if (!study || study.status !== "RECRUITING") return { message: "현재 모집 중인 스터디가 아닙니다." };
    if (String(study.owner) === userId) return { message: "본인이 만든 스터디에는 신청할 수 없습니다." };
    if (study.currentMembers >= study.maxMembers) return { message: "모집 인원이 모두 찼습니다." };

    const existing = await StudyApplication.exists({ study: studyId, applicant: userId });
    if (existing) return { message: "이미 참여 신청한 스터디입니다." };

    await StudyApplication.create({ study: studyId, applicant: userId, message: parsed.data.message });
    revalidatePath(`/studies/${studyId}`);
    revalidatePath("/my");
    return { message: "참여 신청을 보냈습니다. 그룹장의 승인을 기다려 주세요." };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return { message: "이미 참여 신청한 스터디입니다." };
    }
    console.error("Failed to apply to study", error);
    return { message: "참여 신청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }
}

export async function reviewStudyApplicationAction(
  studyId: string,
  applicationId: string,
  decision: "APPROVED" | "REJECTED",
) {
  if (!isValidObjectId(studyId) || !isValidObjectId(applicationId)) redirect("/studies");
  const userId = await requireUserId(`/studies/${studyId}/manage`);

  await connectToDatabase();
  const application = await StudyApplication.findOne({ _id: applicationId, study: studyId, status: "PENDING" }).lean();
  if (!application) return;

  const study = await Study.findOne({ _id: studyId, owner: userId }).select("currentMembers maxMembers status").lean();
  if (!study) redirect("/studies");

  if (decision === "APPROVED") {
    const updatedStudy = await Study.findOneAndUpdate(
      { _id: studyId, owner: userId, status: "RECRUITING", $expr: { $lt: ["$currentMembers", "$maxMembers"] } },
      { $inc: { currentMembers: 1 } },
      { new: true },
    ).lean();

    if (!updatedStudy) return;
    await StudyApplication.updateOne({ _id: applicationId, status: "PENDING" }, { $set: { status: "APPROVED" } });
    if (updatedStudy.currentMembers >= updatedStudy.maxMembers) {
      await Study.updateOne({ _id: studyId }, { $set: { status: "CLOSED" } });
    }
  } else {
    await StudyApplication.updateOne({ _id: applicationId, status: "PENDING" }, { $set: { status: "REJECTED" } });
  }

  revalidatePath("/");
  revalidatePath("/studies");
  revalidatePath(`/studies/${studyId}`);
  revalidatePath(`/studies/${studyId}/manage`);
  revalidatePath("/my");
}
