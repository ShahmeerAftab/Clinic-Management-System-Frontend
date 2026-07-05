import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    dose:     { type: String, required: true },
    duration: { type: String, required: true },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    doctor: { type: String, required: true },
    date: { type: Date, required: true },
    medicines: { type: [medicineSchema], required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });

export default mongoose.models.Prescription ??
  mongoose.model("Prescription", prescriptionSchema);
