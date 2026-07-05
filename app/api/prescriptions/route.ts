import { connectdb } from "@/backend/lib/db";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";
import Patient from "@/backend/models/patients";
import Prescription from "@/backend/models/prescription";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  const filter: Record<string, string> = {};

  if (payload.role === "patient") {
    const patient = await Patient.findOne({ userId: payload.userId });
    if (!patient) return NextResponse.json([]);
    filter.patientId = patient._id;
  } else {
    // staff can filter by ?patientId=
    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");
    if (patientId) filter.patientId = patientId;
  }

  const prescriptions = await Prescription.find(filter)
    .populate("patientId", "name") // populate patient name
    .sort({ date: -1 })            // newest first
    .lean();

  return NextResponse.json(prescriptions);
}

// doctor/admin only
export async function POST(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  if (payload.role === "patient") {
    return NextResponse.json(
      { message: "Patients cannot issue prescriptions." },
      { status: 403 }
    );
  }

  await connectdb();

  const body = await req.json();

  if (
    !body.patientId ||
    !body.doctor ||
    !body.date ||
    !body.medicines ||
    body.medicines.length === 0
  ) {
    return NextResponse.json(
      { message: "patientId, doctor, date, and at least one medicine are required." },
      { status: 400 }
    );
  }

  const prescription = await Prescription.create(body);
  await prescription.populate("patientId", "name"); // populate patient name
  return NextResponse.json(prescription, { status: 201 });
}
