import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  age:       { type: String, required: true },
  gender:    { type: String, required: true },
  contact:   { type: String, required: true },
  createdBy: { type: String, default: "" },
  // Links a Patient record to a User account (set when patient signs up)
  userId:    { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

patientSchema.index({ userId: 1 });

// Guard against "Cannot overwrite model" error during Next.js hot-reload
export default mongoose.models.Patient ?? mongoose.model("Patient", patientSchema);
