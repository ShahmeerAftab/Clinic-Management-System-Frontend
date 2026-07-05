import { connectdb } from "@/backend/lib/db";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";
import Patient from "@/backend/models/patients";
import Appointment from "@/backend/models/appointment";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  const { id } = await params;

  await connectdb();

  const patient = await Patient.findOne({ userId: payload.userId });
  if (!patient) {
    return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  }

  const body = await req.json();

  // patients can only cancel, not mark Completed
  if (body.status && body.status !== "Cancelled") {
    return NextResponse.json(
      { message: "Patients can only cancel appointments." },
      { status: 403 }
    );
  }

  // scoped to this patient's appointments only
  const appointment = await Appointment.findOneAndUpdate(
    { _id: id, patientID: patient._id },
    { $set: body },
    { new: true }
  );

  if (!appointment) {
    return NextResponse.json(
      { message: "Appointment not found or access denied" },
      { status: 404 }
    );
  }

  return NextResponse.json(appointment);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  const { id } = await params;

  await connectdb();

  const patient = await Patient.findOne({ userId: payload.userId });
  if (!patient) {
    return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  }

  // scoped to this patient's appointments only
  const appointment = await Appointment.findOneAndDelete({
    _id: id,
    patientID: patient._id,
  });

  if (!appointment) {
    return NextResponse.json(
      { message: "Appointment not found or access denied" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Appointment cancelled successfully." });
}
