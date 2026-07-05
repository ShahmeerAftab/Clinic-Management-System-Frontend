import { connectdb } from "@/backend/lib/db";
import Patient from "@/backend/models/patients";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";

const STAFF_ROLES = ["admin", "doctor", "receptionist"];

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();
  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  await connectdb();
  const { id } = await params;
  const patient = await Patient.findById(id);
  if (!patient) return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  return NextResponse.json(patient);
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();
  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  await connectdb();
  const { id } = await params;
  const body = await req.json();
  const updated = await Patient.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  return NextResponse.json(updated);
};

// admin only
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();
  if (!["admin"].includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Admins only." }, { status: 403 });
  }

  await connectdb();
  const { id } = await params;
  const deleted = await Patient.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  return NextResponse.json({ message: "Patient deleted" });
};
