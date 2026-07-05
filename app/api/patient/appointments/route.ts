import { connectdb } from "@/backend/lib/db";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";
import Patient from "@/backend/models/patients";
import Appointment from "@/backend/models/appointment";
import { NextResponse } from "next/server";
import { ensurePatientProfile } from "@/backend/lib/ensure-patient";

export async function GET(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  const patient = await Patient.findOne({ userId: payload.userId });
  if (!patient) return NextResponse.json([]);

  // newest first
  const appointments = await Appointment.find({ patientID: patient._id })
    .sort({ date: -1 })
    .lean();

  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  const patient = await ensurePatientProfile(payload.userId);

  const body = await req.json();

  if (!body.doctor || !body.date || !body.time) {
    return NextResponse.json(
      { message: "Doctor, date, and time are required." },
      { status: 400 }
    );
  }

  const appointment = await Appointment.create({
    patientID: patient._id,
    doctorId:  body.doctorId || null,
    doctor:    body.doctor,
    date:      body.date,
    time:      body.time,
    reason:    body.reason || "",
    status:    "Scheduled",
  });

  return NextResponse.json(appointment, { status: 201 });
}
