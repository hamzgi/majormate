import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const StudyApplicationSchema = new Schema(
  {
    study: { type: Schema.Types.ObjectId, ref: "Study", required: true, index: true },
    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true, trim: true, minlength: 5, maxlength: 500 },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], required: true, default: "PENDING", index: true },
  },
  { timestamps: true, versionKey: false },
);

StudyApplicationSchema.index({ study: 1, applicant: 1 }, { unique: true });

export type StudyApplicationRecord = InferSchemaType<typeof StudyApplicationSchema>;

const StudyApplication = (models.StudyApplication as Model<StudyApplicationRecord>) || model<StudyApplicationRecord>("StudyApplication", StudyApplicationSchema);

export default StudyApplication;
