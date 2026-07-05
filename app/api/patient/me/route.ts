import { connectdb } from "@/backend/lib/db";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";
import Patient from "@/backend/models/patients";
import User from "@/backend/models/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  let patient = await Patient.findOne({ userId: payload.userId });

  // lazy-create patient profile if missing
  if (!patient) {
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    patient = await Patient.create({
      name:      user.name,
      age:       "N/A",
      gender:    "N/A",
      contact:   user.email,
      userId:    payload.userId,
      createdBy: "self",
    });
  }

  return NextResponse.json(patient);
}

export async function PUT(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  const body = await req.json();

  const patient = await Patient.findOneAndUpdate(
    { userId: payload.userId },
    { $set: body },
    { new: true }
  );

  if (!patient) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(patient);
}
