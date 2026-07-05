import { connectdb } from "@/backend/lib/db";
import Patient from "@/backend/models/patients";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";

const STAFF_ROLES = ["admin", "doctor", "receptionist"];

// staff only
export const GET = async (req: Request) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  await connectdb();
  const patients = await Patient.find();
  return NextResponse.json(patients);
};

// staff only
export const POST = async (req: Request) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  await connectdb();
  const body = await req.json();
  const newPatient = await Patient.create(body);
  return NextResponse.json(newPatient, { status: 201 });
};
