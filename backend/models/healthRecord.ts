import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Lab Report", "Imaging", "Prescription", "Discharge Summary", "Other"],
      required: true,
    },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    doctor: { type: String, required: true },
    hospital: { type: String, default: "" },
    visitDate: { type: Date, required: true },
    diagnosis: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

healthRecordSchema.index({ patientId: 1 });
healthRecordSchema.index({ doctorId: 1 });

export default mongoose.models.HealthRecord ??
  mongoose.model("HealthRecord", healthRecordSchema);
