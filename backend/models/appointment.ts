import mongoose, { model, Schema } from "mongoose";

const appointmentSchema=new Schema({
patientID:{type:mongoose.Schema.Types.ObjectId, ref:"Patient", required:true},
doctorId:{type:mongoose.Schema.Types.ObjectId, ref:"User", default:null},
doctor:{type:String, required:true},
date:{type:Date,required:true},
time:{type:String, required:true},
reason:{type:String},
status:{type:String,enum:["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
}, {timestamps: true})

appointmentSchema.index({ patientID: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ date: 1 });

export default mongoose.models.Appointment??model("Appointment", appointmentSchema)