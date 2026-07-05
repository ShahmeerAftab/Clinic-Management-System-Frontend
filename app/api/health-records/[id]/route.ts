import { connectdb } from "@/backend/lib/db";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";
import HealthRecord from "@/backend/models/healthRecord";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  const { id } = await params;

  await connectdb();

  const record = await HealthRecord.findById(id)
    .populate("patientId", "name")
    .lean();

  if (!record) {
    return NextResponse.json({ message: "Record not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}

// doctor/admin only
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  if (payload.role === "patient") {
    return NextResponse.json({ message: "Access denied." }, { status: 403 });
  }

  const { id } = await params;

  await connectdb();

  const body = await req.json();

  const record = await HealthRecord.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );

  if (!record) {
    return NextResponse.json({ message: "Record not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}

// doctor/admin only
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  if (payload.role === "patient") {
    return NextResponse.json({ message: "Access denied." }, { status: 403 });
  }

  const { id } = await params;

  await connectdb();

  const record = await HealthRecord.findByIdAndDelete(id);

  if (!record) {
    return NextResponse.json({ message: "Record not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Record deleted successfully." });
}
