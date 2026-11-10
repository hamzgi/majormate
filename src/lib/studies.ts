import "server-only";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Study from "@/models/Study";
import StudyApplication from "@/models/StudyApplication";

type OwnerSnapshot = { _id: { toString(): string }; nickname: string; major: string; grade: number };

export type StudySummary = {
  id: string;
  title: string;
  subject: string;
  description: string;
  meetingDays: string[];
  meetingTime: string;
  meetingType: "ONLINE" | "OFFLINE";
  maxMembers: number;
  currentMembers: number;
  status: "RECRUITING" | "CLOSED";
  owner: { id: string; nickname: string; major: string; grade: number };
  createdAt: Date;
};

function toStudySummary(study: Record<string, unknown>): StudySummary {
  const owner = study.owner as OwnerSnapshot;
  return {
    id: String(study._id),
    title: String(study.title),
    subject: String(study.subject),
    description: String(study.description),
    meetingDays: study.meetingDays as string[],
    meetingTime: String(study.meetingTime),
    meetingType: study.meetingType as "ONLINE" | "OFFLINE",
    maxMembers: Number(study.maxMembers),
    currentMembers: Number(study.currentMembers),
    status: study.status as "RECRUITING" | "CLOSED",
    owner: { id: String(owner._id), nickname: owner.nickname, major: owner.major, grade: owner.grade },
    createdAt: new Date(study.createdAt as Date),
  };
}

export async function getRecruitingStudies(limit?: number) {
  await connectToDatabase();
  const query = Study.find({ status: "RECRUITING" }).sort({ createdAt: -1 }).populate("owner", "nickname major grade");
  if (limit) query.limit(limit);
  const studies = await query.lean();
  return studies.map((study) => toStudySummary(study as unknown as Record<string, unknown>));
}

export async function getStudyById(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const study = await Study.findById(id).populate("owner", "nickname major grade").lean();
  return study ? toStudySummary(study as unknown as Record<string, unknown>) : null;
}

export async function getStudyApplicationStatus(studyId: string, userId: string) {
  if (!isValidObjectId(studyId)) return null;
  await connectToDatabase();
  const application = await StudyApplication.findOne({ study: studyId, applicant: userId }).select("status").lean();
  return application?.status ?? null;
}

export type ManagedApplication = {
  id: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  applicant: { id: string; nickname: string; major: string; grade: number };
};

export async function getManagedApplications(studyId: string, ownerId: string) {
  if (!isValidObjectId(studyId)) return [];
  await connectToDatabase();
  const study = await Study.findOne({ _id: studyId, owner: ownerId }).select("_id").lean();
  if (!study) return [];
  const applications = await StudyApplication.find({ study: studyId })
    .sort({ createdAt: -1 })
    .populate("applicant", "nickname major grade")
    .lean();
  return applications.map((application) => {
    const applicant = application.applicant as unknown as OwnerSnapshot;
    return {
      id: String(application._id),
      message: application.message,
      status: application.status as ManagedApplication["status"],
      createdAt: new Date(application.createdAt),
      applicant: { id: String(applicant._id), nickname: applicant.nickname, major: applicant.major, grade: applicant.grade },
    };
  });
}

export async function getMyStudySummaries(userId: string) {
  await connectToDatabase();
  const studies = await Study.find({ owner: userId }).sort({ createdAt: -1 }).populate("owner", "nickname major grade").lean();
  return studies.map((study) => toStudySummary(study as unknown as Record<string, unknown>));
}
