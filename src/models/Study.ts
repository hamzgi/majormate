import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const StudySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    subject: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    meetingDays: { type: [String], required: true, validate: [(days: string[]) => days.length > 0, "모임 요일을 선택해 주세요."] },
    meetingTime: { type: String, required: true, trim: true, maxlength: 60 },
    meetingType: { type: String, enum: ["ONLINE", "OFFLINE"], required: true },
    maxMembers: { type: Number, required: true, min: 2, max: 20 },
    currentMembers: { type: Number, required: true, default: 1, min: 1 },
    status: { type: String, enum: ["RECRUITING", "CLOSED"], required: true, default: "RECRUITING", index: true },
  },
  { timestamps: true, versionKey: false },
);

StudySchema.index({ status: 1, createdAt: -1 });

export type StudyRecord = InferSchemaType<typeof StudySchema>;

const Study = (models.Study as Model<StudyRecord>) || model<StudyRecord>("Study", StudySchema);

export default Study;
