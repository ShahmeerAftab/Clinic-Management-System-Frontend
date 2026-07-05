import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "doctor", "receptionist", "patient"],
    default: "patient"
  },
  specialization: {
    type: String,
    default: ""
  }
});

UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);