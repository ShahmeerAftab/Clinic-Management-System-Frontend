import { connectdb } from "@/backend/lib/db";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";
import Patient from "@/backend/models/patients";
import HealthRecord from "@/backend/models/healthRecord";
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

  const records = await HealthRecord.find(filter)
    .populate("patientId", "name") // populate patient name
    .sort({ visitDate: -1 })       // newest first
    .lean();

  return NextResponse.json(records);
}

// doctor/admin only
export async function POST(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  if (payload.role === "patient") {
    return NextResponse.json(
      { message: "Patients cannot create health records." },
      { status: 403 }
    );
  }

  await connectdb();

  const body = await req.json();

  if (!body.patientId || !body.title || !body.type || !body.doctor || !body.visitDate) {
    return NextResponse.json(
      { message: "patientId, title, type, doctor, and visitDate are required." },
      { status: 400 }
    );
  }

  const record = await HealthRecord.create(body);
  return NextResponse.json(record, { status: 201 });
}
